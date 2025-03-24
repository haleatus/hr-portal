"use client";

import Loading from "@/app/loading";
import { ReviewDetail } from "@/components/dashboards/reviews/review-detail";
import ReviewNotFound from "@/components/dashboards/reviews/summary/review-not-found";
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
    return <ReviewNotFound />;
  }

  return <ReviewDetail reviewData={reviewData} />;
};

export default ReviewDetailPage;
