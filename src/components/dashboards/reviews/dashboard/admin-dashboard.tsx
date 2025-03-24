"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Users,
} from "lucide-react";
import { DashboardChart } from "@/components/dashboards/dashboard-chart";
import { RecentActivity } from "@/components/dashboards/recent-activity";

export function AdminDashboard() {
  // In a real app, this data would come from your API
  const reviewStats = {
    total: 124,
    completed: 78,
    inProgress: 32,
    pending: 14,
    completionRate: 63,
  };

  const departmentStats = [
    { name: "Engineering", completed: 85, total: 100 },
    { name: "Marketing", completed: 45, total: 60 },
    { name: "Sales", completed: 32, total: 40 },
    { name: "HR", completed: 18, total: 20 },
    { name: "Finance", completed: 12, total: 15 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor organization-wide review progress and performance metrics.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reviews
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Review Completion Trend</CardTitle>
                <CardDescription>
                  Review completion rate over the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Department Progress</CardTitle>
                <CardDescription>
                  Review completion by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{dept.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dept.completed}/{dept.total}
                        </div>
                      </div>
                      <Progress value={(dept.completed / dept.total) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>
                Review status and performance metrics by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {departmentStats.map((dept) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div className="font-medium">{dept.name}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((dept.completed / dept.total) * 100)}%
                        Complete
                      </div>
                    </div>
                    <Progress value={(dept.completed / dept.total) * 100} />
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1 rounded-lg border p-2">
                        <div className="text-xs text-muted-foreground">
                          Total Reviews
                        </div>
                        <div className="text-lg font-bold">{dept.total}</div>
                      </div>
                      <div className="space-y-1 rounded-lg border p-2">
                        <div className="text-xs text-muted-foreground">
                          Completed
                        </div>
                        <div className="text-lg font-bold">
                          {dept.completed}
                        </div>
                      </div>
                      <div className="space-y-1 rounded-lg border p-2">
                        <div className="text-xs text-muted-foreground">
                          Pending
                        </div>
                        <div className="text-lg font-bold">
                          {dept.total - dept.completed}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
