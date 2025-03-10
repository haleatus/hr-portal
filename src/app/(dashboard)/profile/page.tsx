"use client";

import { Card } from "@/components/ui/card";
import Loading from "../loading";
import { useAuth } from "@/providers/auth-provider";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <div className="container max-w-3xl mx-auto py-4">
      <Card className="p-4">
        <h1 className="text-xl font-bold mb-2">Profile</h1>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h2 className="font-semibold">{user.fullname}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
