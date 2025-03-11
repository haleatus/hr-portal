"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Check if in browser environment
    if (typeof window !== "undefined") {
      // Get the user role from localStorage
      const userRole = localStorage.getItem("userRole");

      // Redirect to dashboard if not SUPER_ADMIN
      if (userRole !== "SUPER_ADMIN") {
        toast.error("You are not authorized to access this page.");
        router.replace("/dashboard");
      }
    }
  }, [router]);

  return (
    <div>
      {/* Main content */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
