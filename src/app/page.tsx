"use client";

import LandingPage from "@/components/base/landing-page/landing-page";
import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LandingPage />
    </div>
  );
}
