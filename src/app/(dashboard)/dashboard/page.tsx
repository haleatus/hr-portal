"use client";

import { AdminDashboard } from "@/components/dashboards/reviews/dashboard/admin-dashboard";
import { ManagerDashboard } from "@/components/dashboards/reviews/dashboard/manager-dashboard";
import { EmployeeDashboard } from "@/components/dashboards/reviews/dashboard/employee-dashboard";
import Loading from "@/app/loading";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <Loading />;
  }

  const userRole = user.role;

  // Render the appropriate dashboard based on user role
  return (
    <div className="container mx-auto p-6">
      {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
        <AdminDashboard />
      )}
      {userRole === "MANAGER" && <ManagerDashboard />}
      {userRole === "EMPLOYEE" && <EmployeeDashboard />}
    </div>
  );
}
