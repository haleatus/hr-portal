import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const MyTeamsComponent = () => {
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
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <Link href="/reviews/create">
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Review
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
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
    </>
  );
};

export default MyTeamsComponent;
