"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      toast.success("The system settings have been updated successfully.");
    }, 1000);
  };

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="review-process">Review Process</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company details and branding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="Acme Corporation" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-domain">Company Domain</Label>
              <Input id="company-domain" defaultValue="acmecorp.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Logo</span>
                </div>
                <Button size="sm">Upload New Logo</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Recommended size: 200x200px. Max file size: 2MB.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure global system settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="maintenance-mode"
                className="flex flex-col space-y-1"
              >
                <span>Maintenance Mode</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Put the system in maintenance mode. Only admins can access.
                </span>
              </Label>
              <Switch id="maintenance-mode" />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="debug-mode" className="flex flex-col space-y-1">
                <span>Debug Mode</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Enable detailed error messages and logging.
                </span>
              </Label>
              <Switch id="debug-mode" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="system-email">System Email</Label>
              <Input id="system-email" defaultValue="system@acmecorp.com" />
              <p className="text-sm text-muted-foreground">
                Email address used for system notifications.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="review-process" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Cycle Settings</CardTitle>
            <CardDescription>
              Configure the performance review cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="review-frequency">Review Frequency</Label>
              <select
                id="review-frequency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="quarterly">Quarterly</option>
                <option value="biannual">Bi-Annual</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="review-window">Review Window (Days)</Label>
              <Input id="review-window" type="number" defaultValue="14" />
              <p className="text-sm text-muted-foreground">
                Number of days employees have to complete their reviews.
              </p>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="peer-reviews" className="flex flex-col space-y-1">
                <span>Enable Peer Reviews</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Allow employees to review their peers.
                </span>
              </Label>
              <Switch id="peer-reviews" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="self-assessments"
                className="flex flex-col space-y-1"
              >
                <span>Enable Self Assessments</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Allow employees to complete self-assessments.
                </span>
              </Label>
              <Switch id="self-assessments" defaultChecked />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reminder-days">Reminder Days</Label>
              <Input id="reminder-days" type="number" defaultValue="3" />
              <p className="text-sm text-muted-foreground">
                Days before deadline to send reminder notifications.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Templates</CardTitle>
            <CardDescription>
              Manage the templates used for different types of reviews.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                defaultValue="Standard Performance Review"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                defaultValue="Standard template for quarterly performance reviews."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid gap-2">
              <Label>Rating Scale</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">5-Point Scale</div>
                    <div className="text-sm text-muted-foreground">
                      1 (Poor) to 5 (Excellent)
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Criteria Categories</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>Technical Skills</div>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>Communication</div>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>Teamwork</div>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Add Category
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Create New Template</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Template"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>
              Configure what each user role can access and modify.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Admin Role</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="admin-manage-users"
                      className="flex flex-col space-y-1"
                    >
                      <span>Manage Users</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Create, edit, and delete user accounts.
                      </span>
                    </Label>
                    <Switch id="admin-manage-users" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="admin-manage-reviews"
                      className="flex flex-col space-y-1"
                    >
                      <span>Manage All Reviews</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Access and modify all reviews in the system.
                      </span>
                    </Label>
                    <Switch id="admin-manage-reviews" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="admin-system-settings"
                      className="flex flex-col space-y-1"
                    >
                      <span>System Settings</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Modify system configuration and settings.
                      </span>
                    </Label>
                    <Switch id="admin-system-settings" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Manager Role</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="manager-team-reviews"
                      className="flex flex-col space-y-1"
                    >
                      <span>Manage Team Reviews</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Create and manage reviews for team members.
                      </span>
                    </Label>
                    <Switch id="manager-team-reviews" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="manager-view-reports"
                      className="flex flex-col space-y-1"
                    >
                      <span>View Team Reports</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Access performance reports for team members.
                      </span>
                    </Label>
                    <Switch id="manager-view-reports" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="manager-set-goals"
                      className="flex flex-col space-y-1"
                    >
                      <span>Set Performance Goals</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Define performance goals for team members.
                      </span>
                    </Label>
                    <Switch id="manager-set-goals" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Employee Role</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="employee-self-review"
                      className="flex flex-col space-y-1"
                    >
                      <span>Submit Self Reviews</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Complete self-assessment reviews.
                      </span>
                    </Label>
                    <Switch id="employee-self-review" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="employee-peer-review"
                      className="flex flex-col space-y-1"
                    >
                      <span>Submit Peer Reviews</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Complete reviews for colleagues.
                      </span>
                    </Label>
                    <Switch id="employee-peer-review" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="employee-view-history"
                      className="flex flex-col space-y-1"
                    >
                      <span>View Review History</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Access past performance reviews.
                      </span>
                    </Label>
                    <Switch id="employee-view-history" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Permissions"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
