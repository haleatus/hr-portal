"use client";

import Loading from "@/app/loading";
import { ReviewDetail } from "@/components/reviews/review-detail";
import { useGetReviewDetails } from "@/hooks/reviews.hooks";
import { useParams } from "next/navigation";
import React from "react";

const ReviewDetailPage = () => {
  const params = useParams();
  const reviewId = params.id as string;

  // Fetch review data using the hook
  const { data: reviewData, isLoading } = useGetReviewDetails(reviewId);

  if (isLoading) {
    return <Loading />;
  }

  if (!reviewData) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Review not found</h2>
          <p className="text-muted-foreground">
            {`The review you're looking for doesn't exist or you don't have
            permission to view it.`}
          </p>
        </div>
      </div>
    );
  }

  return <ReviewDetail reviewData={reviewData} />;
};

export default ReviewDetailPage;
