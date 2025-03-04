"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle2, Clock, PlusCircle } from "lucide-react";
import Link from "next/link";
import { RecentActivity } from "@/components/dashboards/recent-activity";

export function ManagerDashboard() {
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

  const reviewStats = {
    total: 12,
    completed: 5,
    inProgress: 4,
    pending: 3,
    completionRate: 42,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground">
          {`Track your team's performance reviews and progress.`}
        </p>
      </div>

      <Tabs defaultValue="team" className="space-y-4">
        <TabsList>
          <TabsTrigger value="team">My Team</TabsTrigger>
          <TabsTrigger value="reviews">Review Status</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  Current review cycle
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reviewStats.completed}
                </div>
                <p className="text-xs text-muted-foreground">
                  {reviewStats.completionRate}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reviewStats.inProgress}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(
                    (reviewStats.inProgress / reviewStats.total) * 100
                  )}
                  % of total reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewStats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((reviewStats.pending / reviewStats.total) * 100)}%
                  of total reviews
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Review Progress</CardTitle>
              <CardDescription>
                {`Overall completion rate for your team's reviews`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Overall Progress</div>
                    <div className="text-sm text-muted-foreground">
                      {reviewStats.completed}/{reviewStats.total} Reviews
                    </div>
                  </div>
                  <Progress value={reviewStats.completionRate} />
                </div>

                <div className="pt-4">
                  <h3 className="mb-4 text-sm font-medium">
                    Upcoming Deadlines
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">
                          Q1 Performance Reviews
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Due in 5 days
                        </div>
                      </div>
                      <Button size="sm">Complete</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">Project Assessments</div>
                        <div className="text-sm text-muted-foreground">
                          Due in 12 days
                        </div>
                      </div>
                      <Button size="sm">Complete</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
}
