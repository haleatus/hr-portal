/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { useGetReviewSummaryDetails } from "@/hooks/reviews.hooks";

// Import components
import ReviewHeader from "@/components/dashboards/reviews/summary/review-header";
import QuestionnaireItem from "@/components/dashboards/reviews/summary/questionnaire-item";
import ReviewNotFound from "@/components/dashboards/reviews/summary/review-not-found";

const ReviewSummaryDetailPage: React.FC = () => {
  const params = useParams();
  const reviewId = params.id as string;

  // Fetch review data using the hook
  const { data: reviewSummaryData, isLoading } =
    useGetReviewSummaryDetails(reviewId);

  console.log("rd", reviewSummaryData);

  if (isLoading) {
    return <Loading />;
  }

  if (!reviewSummaryData) {
    return <ReviewNotFound />;
  }

  // Check if summaryQuestionnaire exists
  const summaryQuestionnaire =
    reviewSummaryData.data.summaryQuestionnaire || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <ReviewHeader reviewData={reviewSummaryData.data} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Questionnaire Responses
          </h2>
          {summaryQuestionnaire.length > 0 ? (
            summaryQuestionnaire.map((item: any, index: number) => (
              <QuestionnaireItem key={index} item={item} />
            ))
          ) : (
            <p className="text-gray-600 italic">
              No questionnaire responses available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummaryDetailPage;
