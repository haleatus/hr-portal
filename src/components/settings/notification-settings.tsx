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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Default notification settings
  const [notifications, setNotifications] = useState({
    reviewAssigned: true,
    reviewCompleted: true,
    reviewReminder: true,
    systemUpdates: false,
    teamChanges: true,
    performanceGoals: true,
  });

  const handleToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      toast.success("Your notification preferences have been saved.");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure which email notifications you receive about your reviews
            and activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="reviewAssigned" className="flex flex-col space-y-1">
              <span>Review Assigned</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive an email when a review is assigned to you.
              </span>
            </Label>
            <Switch
              id="reviewAssigned"
              checked={notifications.reviewAssigned}
              onCheckedChange={() => handleToggle("reviewAssigned")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="reviewCompleted"
              className="flex flex-col space-y-1"
            >
              <span>Review Completed</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive an email when a review about you is completed.
              </span>
            </Label>
            <Switch
              id="reviewCompleted"
              checked={notifications.reviewCompleted}
              onCheckedChange={() => handleToggle("reviewCompleted")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="reviewReminder" className="flex flex-col space-y-1">
              <span>Review Reminders</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive reminder emails about upcoming review deadlines.
              </span>
            </Label>
            <Switch
              id="reviewReminder"
              checked={notifications.reviewReminder}
              onCheckedChange={() => handleToggle("reviewReminder")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="systemUpdates" className="flex flex-col space-y-1">
              <span>System Updates</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive emails about system updates and maintenance.
              </span>
            </Label>
            <Switch
              id="systemUpdates"
              checked={notifications.systemUpdates}
              onCheckedChange={() => handleToggle("systemUpdates")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="teamChanges" className="flex flex-col space-y-1">
              <span>Team Changes</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive emails when there are changes to your team structure.
              </span>
            </Label>
            <Switch
              id="teamChanges"
              checked={notifications.teamChanges}
              onCheckedChange={() => handleToggle("teamChanges")}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="performanceGoals"
              className="flex flex-col space-y-1"
            >
              <span>Performance Goals</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive emails about updates to your performance goals.
              </span>
            </Label>
            <Switch
              id="performanceGoals"
              checked={notifications.performanceGoals}
              onCheckedChange={() => handleToggle("performanceGoals")}
            />
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
          <CardTitle>Notification Schedule</CardTitle>
          <CardDescription>
            Configure when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="notification-frequency">
                Notification Frequency
              </Label>
              <select
                id="notification-frequency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
              <p className="text-sm text-muted-foreground">
                Choose how frequently you want to receive notification emails.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Schedule</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
