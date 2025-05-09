/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// UI components imports
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
  CheckCircle2,
  CircleCheckBigIcon,
  ClipboardList,
  Clock,
  Users,
} from "lucide-react";
import { DashboardChart } from "@/components/dashboards/dashboard-chart";

// Custom components imports
import { RecentActivity } from "@/components/dashboards/recent-activity";
import {
  useGetAllAdminDashboardInfo,
  useGetAllAdminDepartmentReviews,
} from "@/hooks/admin.hooks";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * AdminDashboard Component
 *
 * A dashboard for monitoring organization-wide review progress and performance
 * metrics.
 *
 * @returns {JSX.Element} The rendered dashboard
 */
export function AdminDashboard() {
  const { data: dashboardInfo, isLoading: isDashboardInfoLoading } =
    useGetAllAdminDashboardInfo();

  const { data: departmentReviews, isLoading: isDepartmentsReviewsLoading } =
    useGetAllAdminDepartmentReviews();

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
          {isDashboardInfoLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Reviews
                  </CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardInfo.data.totalReviews}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current total reviews
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardInfo.data.totalCompletedReviews}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total completed reviews
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
                    {dashboardInfo.data.totalPendingReviews}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(
                      (dashboardInfo.data.totalPendingReviews /
                        dashboardInfo.data.totalReviews) *
                        100
                    )}
                    % of total reviews
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Submitted Reviews
                  </CardTitle>
                  <CircleCheckBigIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardInfo.data.totalSubmittedReviews}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total submitted reviews
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

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
                  {/* {departmentStats.map((dept) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{dept.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dept.completed}/{dept.total}
                        </div>
                      </div>
                      <Progress value={(dept.completed / dept.total) * 100} />
                    </div>
                  ))} */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          {isDepartmentsReviewsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>
                  Review status and performance metrics by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {departmentReviews.data.map((dept: any) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div className="font-medium">{dept.department}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(
                            (dept.completedReviews / dept.totalReviews) * 100
                          )}
                          % Complete
                        </div>
                      </div>
                      <Progress
                        value={
                          (dept.completedReviews / dept.totalReviews) * 100
                        }
                      />
                      <div className="grid grid-cols-4 gap-4 pt-2">
                        <div className="space-y-1 rounded-lg border p-2">
                          <div className="text-xs text-muted-foreground">
                            Total Reviews
                          </div>
                          <div className="text-lg font-bold">
                            {dept.totalReviews}
                          </div>
                        </div>
                        <div className="space-y-1 rounded-lg border p-2">
                          <div className="text-xs text-muted-foreground">
                            Submitted Reviews
                          </div>
                          <div className="text-lg font-bold">
                            {dept.submittedReviews}
                          </div>
                        </div>
                        <div className="space-y-1 rounded-lg border p-2">
                          <div className="text-xs text-muted-foreground">
                            Completed
                          </div>
                          <div className="text-lg font-bold">
                            {dept.completedReviews}
                          </div>
                        </div>
                        <div className="space-y-1 rounded-lg border p-2">
                          <div className="text-xs text-muted-foreground">
                            Pending
                          </div>
                          <div className="text-lg font-bold">
                            {dept.pendingReviews}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
}
