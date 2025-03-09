"use client";

import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { ManagerDashboard } from "@/components/dashboards/manager-dashboard";
import { EmployeeDashboard } from "@/components/dashboards/employee-dashboard";
import { useAuthStore } from "@/store/auth-store";
import Loading from "@/app/loading";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <Loading />;
  }

  // Render the appropriate dashboard based on user role
  return (
    <div className="container mx-auto p-6">
      {user.role === "ADMIN" && <AdminDashboard />}
      {user.role === "MANAGER" && <ManagerDashboard />}
      {user.role === "EMPLOYEE" && <EmployeeDashboard />}
    </div>
  );
}
