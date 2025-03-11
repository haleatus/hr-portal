"use client";

import { useState } from "react";
import {
  useGetDepartmentDetails,
  useUpdateDepartmentName,
} from "@/hooks/department.hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface IMember {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullname: string;
  email: string;
  role: string;
}

interface IDepartmentMembers {
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

// Form schema for department name update
const departmentUpdateSchema = z.object({
  department: z.string().min(1, "Department name is required"),
});

const DepartmentDetailPage = ({ id }: { id: string }) => {
  const [selectedMember, setSelectedMember] = useState<IMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const {
    data: departmentDetailsData,
    isError,
    isLoading,
  } = useGetDepartmentDetails(id);

  const updateDepartmentMutation = useUpdateDepartmentName();

  const updateForm = useForm({
    resolver: zodResolver(departmentUpdateSchema),
    defaultValues: {
      department: "",
    },
  });

  // Handle when edit icon is clicked
  const handleEditClick = () => {
    if (departmentDetailsData) {
      updateForm.reset({
        department: departmentDetailsData.data.department,
      });
      setIsUpdateFormOpen(true);
    }
  };

  // Handle form submission
  const onUpdateSubmit = (values: z.infer<typeof departmentUpdateSchema>) => {
    updateDepartmentMutation.mutate(
      {
        id: Number(id),
        data: {
          department: values.department,
        },
      },
      {
        onSuccess: () => {
          setIsUpdateFormOpen(false);
          toast.success("Department name has been updated successfully.");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update department name.");
        },
      }
    );
  };

  const handleMemberClick = (member: IMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  // Error state
  if (isError) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <div className="text-xl font-semibold text-destructive">
          Error loading department data
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // If data is still loading or not available, return null (loading.tsx will handle the loading state)
  if (isLoading || !departmentDetailsData) {
    return null;
  }

  const { department, leader, members } = departmentDetailsData.data;
  const createdAt = new Date(departmentDetailsData.data.createdAt);

  return (
    <div className="container mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/departments"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Departments
          </Link>
          <h1 className="text-2xl font-bold">{department} Department</h1>
          <button
            onClick={handleEditClick}
            className="p-1 rounded-md hover:bg-muted/80 transition-colors"
            aria-label="Edit department name"
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created {format(createdAt, "MMM d, yyyy")}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Leader Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-primary" />
              Department Leader
            </CardTitle>
          </CardHeader>
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
          <CardContent>
            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Users className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  No team members assigned yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-3">
                {members.map((memberData: IDepartmentMembers) => (
                  <div
                    key={memberData.id}
                    className="p-3 rounded-md border border-black/20 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleMemberClick(memberData.member)}
                  >
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
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Department ID</p>
              <p className="font-medium">{departmentDetailsData.data.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{format(createdAt, "PPP")}</p>
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
            <div className="flex justify-end">
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Department Name Update Dialog */}
      <Dialog open={isUpdateFormOpen} onOpenChange={setIsUpdateFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Department Name</DialogTitle>
            <DialogDescription>
              Change the name of the department.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={updateForm.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter department name"
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateDepartmentMutation.isPending}
                >
                  {updateDepartmentMutation.isPending
                    ? "Updating..."
                    : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentDetailPage;
