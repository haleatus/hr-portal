/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useGetLatestReviewsSummary } from "@/hooks/reviews.hooks";
import { CalendarDays, User } from "lucide-react";
import { motion } from "framer-motion";

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
  const validRating = Number.parseFloat(ratingValue) || 0; // Parse the string to float, default to 0 if parsing fails

  return (
    <motion.div
      className="container mx-auto py-8 px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
        }}
      >
        {/* Header Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1
            className="text-2xl font-bold text-gray-800 mb-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            My Performance Review Summary
          </motion.h1>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <motion.div
              className="space-y-2"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
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
            </motion.div>

            <motion.div
              className="flex items-center"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isAcknowledged
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isAcknowledged ? "Acknowledged" : "Pending Acknowledgement"}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Questionnaire Section */}
        <motion.div
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.h2
            className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3"
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Questionnaire Responses
          </motion.h2>
          {summaryQuestionnaire.length > 0 ? (
            <div className="space-y-2">
              {summaryQuestionnaire.map((item: any, index: number) => (
                <QuestionnaireItem key={index} item={item} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              No questionnaire responses available.
            </motion.div>
          )}
        </motion.div>

        {/* Overall Rating Card */}
        <motion.div
          className="mt-6 p-8 bg-gray-50 border-t"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <OverallRatingCard rating={validRating} />
        </motion.div>

        {/* Acknowledgment Section - Only for employees */}
        {isEmployee && reviewId && (
          <div className="p-6 border-t bg-white">
            <AcknowledgmentSection
              reviewId={reviewId}
              isAcknowledged={isAcknowledged}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LatestSummaryDetailPage;
