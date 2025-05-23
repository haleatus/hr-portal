"use client";

import { useState, useEffect } from "react";
import { ReportsList } from "@/components/reports/reports-list";
import { ReportFilters } from "@/components/reports/report-filters";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Loading from "@/app/loading";
import { useAuthStore } from "@/store/auth-store";

export default function ReportsPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reports, setReports] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    department: "all",
    period: "q1-2025",
  });

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    setReports([
      {
        id: "1",
        name: "Department Performance Summary",
        description: "Overall performance metrics by department",
        lastUpdated: "2025-03-15",
      },
      {
        id: "2",
        name: "Individual Progress Report",
        description: "Detailed performance metrics for each employee",
        lastUpdated: "2025-03-10",
      },
      {
        id: "3",
        name: "Review Completion Status",
        description: "Tracking of review completion across the organization",
        lastUpdated: "2025-03-05",
      },
    ]);
  }, []);

  if (isLoading || !user) {
    return <Loading />;
  }

  // Only admin and managers can access reports
  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    user.role !== "MANAGER"
  ) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to view reports.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Performance Reports</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <ReportFilters filters={filters} setFilters={setFilters} />

      <ReportsList reports={reports} />
    </div>
  );
}
