"use client";

// Core React imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// hooks imports
import {
  useDeleteDepartmentMember,
  useGetDepartmentDetails,
} from "@/hooks/department.hooks";
import Link from "next/link";

// UI components imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  UserCircle,
  Mail,
  Users,
  Calendar,
  ArrowLeft,
  Clock,
  Trash2,
} from "lucide-react";

// Third-party imports
import { format } from "date-fns";
import { toast } from "sonner";

// Local imports
import DepartmentManagerChangeForm from "./department-manager-change-form";
import AddDepartmentMembersForm from "./add-department-members-form";
import DepartmentNameUpdateForm from "./department-name-update-form";
import { ErrorState } from "@/components/base/error-state";

// Interface for member data
interface IMember {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullname: string;
  email: string;
  role: string;
}

// Interface for department members
export interface IDepartmentMembers {
  id: string;
  createdAt: string;
  updatedAt: string;
  team: {
    id: string;
    createdAt: string;
    updatedAt: string;
    department: string;
    leader: IMember;
  };
  member: IMember;
}

/**
 * DepartmentDetailPage component
 * @param id
 * @returns JSX.Element - Department details page
 */
const DepartmentDetailPage = ({ id }: { id: string }) => {
  // Router instance
  const router = useRouter();

  // Department ID
  const departmentId = id;

  // State variables
  const [selectedMember, setSelectedMember] = useState<IMember | null>(null);

  // Member Detail Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Confirm deletion dialog state for Member
  const [isConfirmDeletionOpen, setIsComfirmDeletionOpen] = useState(false);

  // State variable to store the memberId
  const [selectedMemberMemberId, setSelectedMemberMemberId] = useState<
    string | null
  >(null);

  // Fetch department details
  const {
    data: departmentDetailsData,
    isError,
    isLoading,
  } = useGetDepartmentDetails(departmentId);

  // Mutation to delete a department member
  const memberDeleteMutation = useDeleteDepartmentMember();

  // Function to handle member click
  const handleMemberClick = (member: IMember, memberId?: string) => {
    setSelectedMember(member);
    if (memberId) {
      setSelectedMemberMemberId(memberId); // Store the memberId
    }
    setIsDialogOpen(true);
  };

  // Error state
  if (isError) {
    return (
      <ErrorState
        title="Error loading department data"
        description="We couldn't retrieve the department information. The department with this ID may not exist. Please try again later."
        onRetry={() => window.location.reload()}
        onBack={() => router.push("/departments")}
      />
    );
  }

  // If data is still loading or not available, return null (loading.tsx will handle the loading state)
  if (isLoading || !departmentDetailsData) {
    return null;
  }

  // Destructure department details
  const { department, leader, members } = departmentDetailsData.data;

  // Created at date
  const createdAt = new Date(departmentDetailsData.data.createdAt);

  return (
    <div className="container mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* Back button */}
          <Link
            href="/departments"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Departments
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{department} Department</h1>
            {/* Department Name Update Form */}
            <DepartmentNameUpdateForm
              departmentDetailsData={departmentDetailsData}
              departmentId={departmentId}
              members={members}
            />
          </div>
        </div>
        {/* Add Department Members Form */}
        <AddDepartmentMembersForm departmentId={Number(departmentId)} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Leader Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-primary" />
                Department Leader
              </div>
              {/* Department Manager Change Form */}
              <DepartmentManagerChangeForm
                departmentDetailsData={departmentDetailsData}
                id={departmentId}
              />
            </CardTitle>
          </CardHeader>
          {/* Leader Card Content */}
          <CardContent>
            <div
              className="flex flex-col gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleMemberClick(leader)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {leader.fullname
                      .split(" ")
                      .map((name: string) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{leader.fullname}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{leader.email}</span>
                  </div>
                </div>
              </div>
              <Badge className="self-start mt-1 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                {leader.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Team Members
              </div>
              <Badge variant="outline" className="bg-secondary/50 text-black">
                {members.length} {members.length === 1 ? "Member" : "Members"}
              </Badge>
            </CardTitle>
          </CardHeader>
          {/* Team Members Card Content */}
          <CardContent>
            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Users className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  No team members assigned yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {members.map((memberData: IDepartmentMembers) => (
                  <div
                    key={memberData.id}
                    className="relative p-3 w-60 rounded-md border border-black/20 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedMemberMemberId(memberData.id); // Store the memberId
                      handleMemberClick(memberData.member, memberData.id); // Pass member and memberId
                    }}
                  >
                    {/* Delete Member button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="absolute top-2 right-2 p-1 cursor-pointer rounded-md hover:bg-destructive/10 text-destructive hover:text-destructive/80 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the card click event from firing
                              setIsComfirmDeletionOpen(true);
                              setSelectedMember(memberData.member);
                              setSelectedMemberMemberId(memberData.id); // Store the memberId
                            }}
                            aria-label="Delete member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-red-500">Delete Member</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Member details */}
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12 border-2 border-black/20">
                        <AvatarFallback className="bg-secondary/70 text-black">
                          {memberData.member.fullname
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm truncate">
                          {memberData.member.fullname}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {memberData.member.email}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs px-1 py-0"
                        >
                          {memberData.member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Info Card */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Department Information
          </CardTitle>
        </CardHeader>

        {/* Department Info Card Content */}
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Department ID</p>
              <p className="font-medium">{departmentDetailsData.data.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex gap-2 items-center">
                <Calendar className="h-4 w-4" />
                Created
              </p>
              <div className="font-medium">
                <span>{format(createdAt, "MMM d, yyyy")}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {format(new Date(departmentDetailsData.data.updatedAt), "PPP")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="font-medium">
                {members.length + 1} (including leader)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedMember && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>
                Detailed information about this team member.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="text-lg">
                  {selectedMember.fullname
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mb-1">
                {selectedMember.fullname}
              </h2>
              <Badge className="mb-4">{selectedMember.role}</Badge>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedMember.email}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-2 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">Member ID</p>
                    <p className="font-medium">{selectedMember.id}</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {format(
                        new Date(selectedMember.createdAt),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                </div>

                {leader.id === selectedMember.id && (
                  <div className="p-2 rounded-md bg-primary/10 text-primary border border-primary/20">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      <p className="font-medium">Department Leader</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              {selectedMember.role === "EMPLOYEE" && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsComfirmDeletionOpen(true);
                    setIsDialogOpen(false);
                  }}
                  className="text-white cursor-pointer"
                >
                  Delete Member
                </Button>
              )}
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirm Deletion Dialog For Member */}
      <Dialog
        open={isConfirmDeletionOpen}
        onOpenChange={setIsComfirmDeletionOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsComfirmDeletionOpen(false)}
              className="cursor-pointer"
              disabled={memberDeleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedMemberMemberId) {
                  memberDeleteMutation.mutate(selectedMemberMemberId, {
                    onSuccess: () => {
                      setIsComfirmDeletionOpen(false);
                      toast.success("Member deleted successfully.");
                    },
                    onError: (error) => {
                      toast.error(error.message || "Failed to delete member.");
                    },
                  });
                }
              }}
              disabled={memberDeleteMutation.isPending}
              className="text-white cursor-pointer"
            >
              {memberDeleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentDetailPage;
