"use client";
import Link from "next/link";

// Loading component import
import Loading from "@/app/(dashboard)/loading";

// UI Component imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Auth context import
import { useAuth } from "@/providers/auth-provider";

// Lucide icons import
import { PlusCircle, Users, CalendarDays } from "lucide-react";
import { useGetMyDepartment } from "@/hooks/department.hooks";
import { JSX } from "react";

// TypeScript interfaces
interface User {
  id: number;
  fullname: string;
  email: string;
  role: "MANAGER" | "EMPLOYEE";
  createdAt: string;
  updatedAt: string;
}

interface DepartmentMember {
  id: number;
  createdAt: string;
  updatedAt: string;
  member: User;
}

/**
 * MyTeamsComponent component
 * @returns {JSX.Element} MyTeamsComponent
 */
const MyDepartmentComponent = (): JSX.Element => {
  // Get the user and loading state from the auth context
  const { user, loading } = useAuth();

  // Fetch department data
  const { data: departmentData, isLoading: isDepartmentLoading } =
    useGetMyDepartment();

  // Extract department members from the response
  const departmentMembers = departmentData?.data?.members || [];
  const departmentName = departmentData?.data?.department || "My Department";
  const departmentLeader = departmentData?.data?.leader || null;
  const departmentCreatedAt = departmentData?.data?.createdAt
    ? new Date(departmentData.data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Function to get initials from full name
  const getInitials = (name: string): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading || !user || isDepartmentLoading) {
    return <Loading />;
  }

  // If there's no department data yet
  if (!departmentData?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-primary/10 p-6 rounded-full mb-4">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Department Data</h3>
        <p className="text-muted-foreground text-center max-w-md">
          There is no department data available at the moment. Please check back
          later or contact your administrator.
        </p>
        <Button variant="outline" className="mt-6">
          Refresh Data
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Department Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">
                {departmentName} Department
              </h2>
            </div>
            {departmentLeader && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <p>
                  Led by{" "}
                  <span className="font-medium text-sky-600">
                    {departmentLeader.fullname}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-2.5 cursor-pointer">
              <Users className="h-3.5 w-3.5 mr-1" />
              {departmentMembers.length} Members
            </Badge>

            {user.role === "MANAGER" && (
              <Link href="/reviews/create">
                <Button className="cursor-pointer">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Review
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-4">Team Members</h3>
          {departmentCreatedAt && (
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <p>Established {departmentCreatedAt}</p>
            </div>
          )}
        </div>
        <Separator className="mb-6" />

        {user.role === "MANAGER" ? (
          // Card view for managers
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {departmentMembers.map((memberObj: DepartmentMember) => {
              const member = memberObj.member;
              return (
                <Card
                  key={member.id}
                  className="overflow-hidden transition-all hover:shadow-md"
                >
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-start">
                      <Avatar className="h-12 w-12 border-2 border-background">
                        <AvatarImage
                          src={`/placeholder.svg?height=48&width=48`}
                          alt={member.fullname}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(member.fullname)}
                        </AvatarFallback>
                      </Avatar>
                      <Badge
                        variant={
                          member.role === "MANAGER" ? "default" : "outline"
                        }
                      >
                        {member.role}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3">{member.fullname}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      {member.email}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-2 py-0">
                    <div className="text-xs text-muted-foreground">
                      <div className="flex justify-end items-center gap-2 mb-1">
                        <span>Joined {formatDate(member.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-2 px-2">
                    <Link
                      href={`/reviews?employee=${member.id}`}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full cursor-pointer"
                      >
                        View Reviews
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          // Enhanced table view for employees
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Department Leader */}
                {departmentLeader && (
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableCell>
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage
                          src={`/placeholder.svg?height=36&width=36`}
                          alt={departmentLeader.fullname}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(departmentLeader.fullname)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {departmentLeader.fullname}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Department Leader
                      </div>
                    </TableCell>
                    <TableCell>{departmentLeader.email}</TableCell>
                    <TableCell>
                      <Badge>{departmentLeader.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(departmentLeader.createdAt)}
                    </TableCell>
                  </TableRow>
                )}

                {/* Department Members */}
                {departmentMembers.map((memberObj: DepartmentMember) => {
                  const member = memberObj.member;
                  // Skip if this member is the same as the leader
                  if (departmentLeader && member.id === departmentLeader.id)
                    return null;

                  return (
                    <TableRow key={member.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={`/placeholder.svg?height=36&width=36`}
                            alt={member.fullname}
                          />
                          <AvatarFallback>
                            {getInitials(member.fullname)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {member.fullname}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatDate(member.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default MyDepartmentComponent;
