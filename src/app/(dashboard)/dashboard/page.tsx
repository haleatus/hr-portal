"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { ManagerDashboard } from "@/components/dashboards/manager-dashboard";
import { EmployeeDashboard } from "@/components/dashboards/employee-dashboard";
import { toast } from "sonner";

export default function DashboardPage() {
  // In a real app, this would come from your auth state
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching user role from API or local storage
    // In a real app, this would be handled by your auth provider
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

  // Render the appropriate dashboard based on user role
  return (
    <div className="container mx-auto p-6">
      {userRole === "ADMIN" && <AdminDashboard />}
      {userRole === "MANAGER" && <ManagerDashboard />}
      {userRole === "EMPLOYEE" && <EmployeeDashboard />}
    </div>
  );
}
