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
import OverallRatingCard from "@/components/dashboards/reviews/summary/overall-rating-card";

const ReviewSummaryDetailPage: React.FC = () => {
  const params = useParams();
  const reviewId = params.id as string;

  // Fetch review data using the hook
  const { data: reviewSummaryData, isLoading } =
    useGetReviewSummaryDetails(reviewId);

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
    <div className="container mx-auto py-8 px-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ReviewHeader reviewData={reviewSummaryData.data} />

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Questionnaire Responses
          </h2>
          {summaryQuestionnaire.length > 0 ? (
            <div className="space-y-8">
              {summaryQuestionnaire.map((item: any, index: number) => (
                <QuestionnaireItem key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
              No questionnaire responses available.
            </div>
          )}
        </div>

        {/* Overall Rating Card at the bottom */}
        <div className="mt-6 p-6 bg-gray-50 border-t">
          <OverallRatingCard
            rating={reviewSummaryData.data.averagePerformanceRating}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewSummaryDetailPage;
