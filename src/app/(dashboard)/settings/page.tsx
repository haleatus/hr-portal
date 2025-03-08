"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { AdminSettings } from "@/components/settings/admin-settings";
import { toast } from "sonner";

export default function SettingsPage() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching user role
    const authData = localStorage.getItem("auth-storage");
    if (authData) {
      const parsedAuth = JSON.parse(authData); // Parse stored string into JSON
      setUserRole(parsedAuth.state.user.role);
    } else {
      toast.error("No role found in localStorage.");
    }
  }, []);

  if (!userRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {userRole === "ADMIN" && (
            <TabsTrigger value="ADMIN">Admin Settings</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        {userRole === "ADMIN" && (
          <TabsContent value="ADMIN">
            <AdminSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
