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
import { RecentActivity } from "@/components/dashboards/recent-activity";
import MyTeamsComponent from "../../manager/my-department";

export function ManagerDashboard() {
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
          <MyTeamsComponent />
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
