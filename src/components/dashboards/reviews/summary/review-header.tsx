import type React from "react";
import type { ReviewSummary } from "@/interfaces/reviews.interface";
import { CalendarDays, User } from "lucide-react";

interface ReviewHeaderProps {
  reviewData: ReviewSummary;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ reviewData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">
        Performance Review Summary
      </h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <User className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium">{reviewData.reviewee.fullname}</span>
            <span className="text-gray-500 ml-2 text-sm">
              ({reviewData.reviewee.email})
            </span>
          </div>

          <div className="flex items-center text-gray-700">
            <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
            <span>
              {new Date(reviewData.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              reviewData.isAcknowledged
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
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
