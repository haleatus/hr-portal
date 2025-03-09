"use client";

// Hooks
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/user.hooks";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Icons
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  // Get current user data from the hook
  const { data: userData, isLoading, isError } = useCurrentUser();

  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(["currentUser"]);
  console.log("Cached User Data:", cachedData);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-xl font-semibold text-destructive">
          Error loading profile
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Extract user data
  const user = userData?.data || {};
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

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
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar || ""} alt={user.fullname} />
            <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-semibold">{user.fullname}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </Card>
      </div>
    </div>
  );
}
