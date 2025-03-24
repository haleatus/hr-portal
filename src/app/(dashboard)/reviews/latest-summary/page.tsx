/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useGetLatestReviewsSummary } from "@/hooks/reviews.hooks";
import { CalendarDays, User } from "lucide-react";

// Import components
import QuestionnaireItem from "@/components/dashboards/reviews/summary/questionnaire-item";
import ReviewNotFound from "@/components/dashboards/reviews/summary/review-not-found";
import AcknowledgmentSection from "@/components/dashboards/reviews/summary/acknowledgment-section";
import OverallRatingCard from "@/components/dashboards/reviews/summary/overall-rating-card";

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

  // Check if we have a proper response with data
  if (
    !latestReviewSummaryData ||
    !latestReviewSummaryData.data ||
    Object.keys(latestReviewSummaryData.data).length === 0
  ) {
    return <ReviewNotFound />;
  }

  // Check if summaryQuestionnaire exists
  const summaryQuestionnaire =
    latestReviewSummaryData.data.summaryQuestionnaire || [];

  const reviewId = latestReviewSummaryData.data.id;
  const isAcknowledged = latestReviewSummaryData.data.isAcknowledged || false;

  // Convert string rating to a number and ensure it's valid
  const ratingValue = latestReviewSummaryData.data.averagePerformanceRating;
  const validRating = parseFloat(ratingValue) || 0; // Parse the string to float, default to 0 if parsing fails

  return (
    <div className="container mx-auto py-8 px-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            My Performance Review Summary
          </h1>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-medium">
                  {latestReviewSummaryData.data.reviewee?.fullname ||
                    "Your Review"}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
                <span>
                  {latestReviewSummaryData.data.createdAt
                    ? new Date(
                        latestReviewSummaryData.data.createdAt
                      ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Date not available"}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isAcknowledged
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isAcknowledged ? "Acknowledged" : "Pending Acknowledgement"}
              </span>
            </div>
          </div>
        </div>

        {/* Questionnaire Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Questionnaire Responses
          </h2>
          {summaryQuestionnaire.length > 0 ? (
            <div className="space-y-2">
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

        {/* Overall Rating Card */}
        <div className="mt-6 p-8 bg-gray-50 border-t">
          <OverallRatingCard rating={validRating} />
        </div>

        {/* Acknowledgment Section - Only for employees */}
        {isEmployee && reviewId && (
          <div className="p-6 border-t bg-white">
            <AcknowledgmentSection
              reviewId={reviewId}
              isAcknowledged={isAcknowledged}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestSummaryDetailPage;
