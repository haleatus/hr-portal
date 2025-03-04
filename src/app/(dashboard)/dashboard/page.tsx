"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { ManagerDashboard } from "@/components/dashboards/manager-dashboard";
import { EmployeeDashboard } from "@/components/dashboards/employee-dashboard";

export default function DashboardPage() {
  // In a real app, this would come from your auth state
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching user role from API or local storage
    // In a real app, this would be handled by your auth provider
    const role = localStorage.getItem("userRole") || "employee";
    setUserRole(role);
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
      {userRole === "admin" && <AdminDashboard />}
      {userRole === "manager" && <ManagerDashboard />}
      {userRole === "employee" && <EmployeeDashboard />}
    </div>
  );
}
