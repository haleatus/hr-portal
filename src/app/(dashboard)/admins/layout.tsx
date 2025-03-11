"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AdminsPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "SUPER_ADMIN") {
      toast.error("Unauthorized access");
      router.push("/dashboard");
    }
  }, [router]);

  return <>{children}</>;
};

export default AdminsPageLayout;
