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
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { RecentActivity } from "@/components/dashboards/recent-activity";

export function EmployeeDashboard() {
  // In a real app, this data would come from your API
  const reviewStats = {
    selfReview: { status: "completed", dueDate: "March 15, 2025" },
    peerReviews: { completed: 3, total: 5, dueDate: "March 20, 2025" },
    managerReview: { status: "pending", dueDate: "April 1, 2025" },
  };

  const skillsData = [
    { name: "Technical Skills", rating: 4, maxRating: 5 },
    { name: "Communication", rating: 3, maxRating: 5 },
    { name: "Teamwork", rating: 5, maxRating: 5 },
    { name: "Problem Solving", rating: 4, maxRating: 5 },
    { name: "Leadership", rating: 3, maxRating: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Employee Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your performance reviews and professional development.
        </p>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Self Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {reviewStats.selfReview.status === "completed" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">
                        Completed
                      </span>
                    </>
                  ) : reviewStats.selfReview.status === "in-progress" ? (
                    <>
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-500">
                        In Progress
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">
                        Pending
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Due: {reviewStats.selfReview.dueDate}
                </div>
                <div className="mt-4">
                  <Link href="/reviews">
                    <Button size="sm" variant="outline" className="w-full">
                      {reviewStats.selfReview.status === "completed"
                        ? "View"
                        : "Complete"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Peer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Progress:</div>
                    <div className="text-sm text-muted-foreground">
                      {reviewStats.peerReviews.completed}/
                      {reviewStats.peerReviews.total}
                    </div>
                  </div>
                  <Progress
                    value={
                      (reviewStats.peerReviews.completed /
                        reviewStats.peerReviews.total) *
                      100
                    }
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Due: {reviewStats.peerReviews.dueDate}
                </div>
                <div className="mt-4">
                  <Link href="/reviews">
                    <Button size="sm" variant="outline" className="w-full">
                      Continue
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Manager Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {reviewStats.managerReview.status === "completed" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">
                        Completed
                      </span>
                    </>
                  ) : reviewStats.managerReview.status === "in-progress" ? (
                    <>
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-500">
                        In Progress
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">
                        Pending
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Due: {reviewStats.managerReview.dueDate}
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Awaiting Manager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reviews</CardTitle>
              <CardDescription>
                Reviews that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">Peer Review: John Smith</div>
                    <div className="text-sm text-muted-foreground">
                      Due in 3 days
                    </div>
                  </div>
                  <Link href="/reviews">
                    <Button size="sm">Complete</Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">
                      Peer Review: Sarah Johnson
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Due in 5 days
                    </div>
                  </div>
                  <Link href="/reviews">
                    <Button size="sm">Complete</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>
                Based on your most recent performance review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsData.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{skill.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {skill.rating}/{skill.maxRating}
                      </div>
                    </div>
                    <Progress value={(skill.rating / skill.maxRating) * 100} />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Manager Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  {`"Consistently delivers high-quality work and collaborates
                  effectively with the team. Could improve on taking more
                  initiative in leading projects and developing strategic
                  thinking skills."`}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Goals</CardTitle>
              <CardDescription>
                Areas to focus on for professional growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="font-medium">Improve Leadership Skills</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Take on more project leadership responsibilities and mentor
                    junior team members.
                  </div>
                  <Progress className="mt-2" value={30} />
                </div>
                <div className="rounded-lg border p-3">
                  <div className="font-medium">Enhance Technical Knowledge</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Complete advanced certification in relevant technical areas.
                  </div>
                  <Progress className="mt-2" value={60} />
                </div>
                <div className="rounded-lg border p-3">
                  <div className="font-medium">Improve Presentation Skills</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Practice delivering presentations to larger audiences and
                    stakeholders.
                  </div>
                  <Progress className="mt-2" value={45} />
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
