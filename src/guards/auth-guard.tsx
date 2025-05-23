"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import Loading from "@/app/(dashboard)/loading";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure the Zustand store is properly hydrated from localStorage
    const checkAuth = setTimeout(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.push("/signin");
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [router]);

  // Once we know auth state has stabilized, we can respond to changes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center w-full">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
