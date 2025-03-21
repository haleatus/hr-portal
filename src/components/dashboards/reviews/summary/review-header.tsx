import React from "react";
import { ReviewSummary } from "@/interfaces/reviews.interface";

interface ReviewHeaderProps {
  reviewData: ReviewSummary;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ reviewData }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Performance Review Summary
        </h1>
        <p className="text-gray-600">
          For:{" "}
          <span className="font-semibold">{reviewData.reviewee.fullname}</span>{" "}
          ({reviewData.reviewee.email})
        </p>
        <p className="text-gray-600">
          Created: {new Date(reviewData.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <div className="flex items-center">
          <span className="text-gray-700 mr-2">Overall Rating:</span>
          <div className="bg-blue-100 px-3 py-1 rounded-full">
            <span className="font-bold text-blue-800">
              {reviewData.averagePerformanceRating}/5
            </span>
          </div>
        </div>
        <div className="mt-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              reviewData.isAcknowledged
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {reviewData.isAcknowledged
              ? "Acknowledged"
              : "Pending Acknowledgement"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewHeader;
