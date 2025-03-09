"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { signOut } = useAuthStore();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    signOut();
    toast.success("Successfully logged out");
    router.push("/signin");
  }, [signOut, router]);

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-4 w-full rounded focus:outline-none focus:shadow-outline"
    >
      <LogOut /> Logout
    </Button>
  );
}
