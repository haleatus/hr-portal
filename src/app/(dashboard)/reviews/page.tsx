"use client";

import { useState, useEffect } from "react";
import { ReviewsList } from "@/components/reviews/reviews-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ReviewsPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching user role and reviews
    const role = localStorage.getItem("userRole") || "employee";
    setUserRole(role);

    // Mock data - in a real app, this would come from an API
    setReviews([
      {
        id: "1",
        type: "Self Assessment",
        subject: "Annual Self Review",
        status: "Pending",
        dueDate: "2025-04-15",
      },
      {
        id: "2",
        type: "Peer Review",
        subject: "John Doe - Q1 Review",
        status: "Completed",
        dueDate: "2025-03-01",
      },
      {
        id: "3",
        type: "Manager Review",
        subject: "Jane Smith - Annual Review",
        status: "In Progress",
        dueDate: "2025-04-10",
      },
    ]);
  }, []);

  if (!userRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Performance Reviews</h1>
        {(userRole === "admin" || userRole === "manager") && (
          <Link href="/reviews/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Review
            </Button>
          </Link>
        )}
      </div>

      <ReviewsList reviews={reviews} userRole={userRole} />
    </div>
  );
}
