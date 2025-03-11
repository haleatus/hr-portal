import React from "react";
import DepartmentDetailPage from "@/components/dashboards/department/department-details";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DepartmentDetail = async ({ params }: PageProps) => {
  const { id } = await params;
  return <DepartmentDetailPage id={id} />;
};

export default DepartmentDetail;
