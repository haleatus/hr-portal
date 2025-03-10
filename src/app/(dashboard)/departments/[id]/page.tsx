import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DepartmentDetail = async ({ params }: PageProps) => {
  const { id } = await params;
  return <div>DepartmentDetail {id}</div>;
};

export default DepartmentDetail;
