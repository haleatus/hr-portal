"use client";

import { ReviewsDashboard } from "@/components/reviews/reviews-dashboard";
import Loading from "@/app/loading";

export default function ReviewsPage() {
  const userRole = localStorage.getItem("userRole") || "EMPLOYEE";

  if (!userRole) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6">
      <ReviewsDashboard userRole={userRole} />
    </div>
  );
}
