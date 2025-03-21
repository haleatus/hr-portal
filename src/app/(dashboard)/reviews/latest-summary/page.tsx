/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useGetLatestReviewsSummary } from "@/hooks/reviews.hooks";

// Import components
import QuestionnaireItem from "@/components/dashboards/reviews/summary/questionnaire-item";
import ReviewNotFound from "@/components/dashboards/reviews/summary/review-not-found";
import AcknowledgmentSection from "@/components/dashboards/reviews/summary/acknowledgment-section";

const LatestSummaryDetailPage: React.FC = () => {
  const [userRole, setUserRole] = useState<string>("EMPLOYEE");

  useEffect(() => {
    // Get user role from localStorage after component is mounted to avoid SSR issues
    setUserRole(localStorage.getItem("userRole") || "EMPLOYEE");
  }, []);

  const isEmployee = userRole === "EMPLOYEE";

  // Fetch review data using the hook
  const { data: latestReviewSummaryData, isLoading } =
    useGetLatestReviewsSummary({ isEmployee });

  if (isLoading) {
    return <Loading />;
  }

  if (!latestReviewSummaryData) {
    return <ReviewNotFound />;
  }

  // Check if summaryQuestionnaire exists
  const summaryQuestionnaire =
    latestReviewSummaryData.data.summaryQuestionnaire || [];

  const reviewId = latestReviewSummaryData.data.id;
  const isAcknowledged = latestReviewSummaryData.data.isAcknowledged;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              My Performance Review Summary
            </h1>

            <p className="text-gray-600">
              Created:{" "}
              {new Date(
                latestReviewSummaryData.data.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">Overall Rating:</span>
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="font-bold text-blue-800">
                  {latestReviewSummaryData.data.averagePerformanceRating}/5
                </span>
              </div>
            </div>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  latestReviewSummaryData.data.isAcknowledged
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {latestReviewSummaryData.data.isAcknowledged
                  ? "Acknowledged"
                  : "Pending Acknowledgement"}
              </span>
            </div>
          </div>
        </div>

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
        {/* Only show acknowledgment section for employees */}
        {isEmployee &&
          Object.keys(latestReviewSummaryData.data).length !== 0 && (
            <AcknowledgmentSection
              reviewId={reviewId}
              isAcknowledged={isAcknowledged}
            />
          )}
      </div>
    </div>
  );
};

export default LatestSummaryDetailPage;
