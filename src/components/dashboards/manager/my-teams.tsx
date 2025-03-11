"use client";

// Core imports
import React from "react";
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

// Auth context import
import { useAuth } from "@/providers/auth-provider";

// Lucide icons import
import { AlertCircle, CheckCircle2, Clock, PlusCircle } from "lucide-react";
import { useGetMyDepartment } from "@/hooks/department.hooks";

/**
 * MyTeamsComponent component
 * @returns {JSX.Element} MyTeamsComponent
 */
const MyTeamsComponent = () => {
  // Get the user and loading state from the auth context
  const { user, loading } = useAuth();

  const { data: departmentMembers } = useGetMyDepartment();

  console.log("dep", departmentMembers);

  // In a real app, this data would come from your API
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Senior Developer",
      reviewStatus: "completed",
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "UX Designer",
      reviewStatus: "in-progress",
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Product Manager",
      reviewStatus: "pending",
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Marketing Specialist",
      reviewStatus: "completed",
    },
    {
      id: 5,
      name: "David Wilson",
      role: "Data Analyst",
      reviewStatus: "in-progress",
    },
  ];

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Team Members</h2>
        {user.role === "MANAGER" && (
          <Link href="/reviews/create">
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Review
            </Button>
          </Link>
        )}
      </div>

      {user.role === "MANAGER" ? (
        // Card view for managers
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40`}
                    alt={member.name}
                  />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm">Review Status:</div>
                  <div className="flex items-center gap-1">
                    {member.reviewStatus === "completed" && (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                          Completed
                        </span>
                      </>
                    )}
                    {member.reviewStatus === "in-progress" && (
                      <>
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium text-amber-500">
                          In Progress
                        </span>
                      </>
                    )}
                    {member.reviewStatus === "pending" && (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500">
                          Pending
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href={`/reviews?employee=${member.id}`}>
                    <Button variant="outline" size="sm">
                      View Reviews
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Table view for employees
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32`}
                        alt={member.name}
                      />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default MyTeamsComponent;
