"use client";

// UI Components
import { Card } from "@/components/ui/card";
import Loading from "../loading";

// Hooks
import { useAuth } from "@/providers/auth-provider";

export default function ProfilePage() {
  // Get current user data from the hook
  const { user, loading } = useAuth();

  // Loading state
  if (loading || !user) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <Card className="p-4 flex flex-col items-center">
          <h2 className="mt-4 text-xl font-semibold">{user.fullname}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </Card>
      </div>
    </div>
  );
}
