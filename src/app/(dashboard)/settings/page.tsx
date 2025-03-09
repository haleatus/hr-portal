"use client";

import { NotificationSettings } from "@/components/settings/notification-settings";
import { AdminSettings } from "@/components/settings/admin-settings";
import Loading from "@/app/loading";
import { useAuth } from "@/providers/auth-provider";

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      {user.role === "ADMIN" ? <AdminSettings /> : <NotificationSettings />}
    </div>
  );
}
