"use client";

import React, { useState } from "react";
import { useAcknowledgeReviewSummary } from "@/hooks/reviews.hooks";

interface AcknowledgmentSectionProps {
  reviewId: string | number;
  isAcknowledged: boolean;
}

const AcknowledgmentSection: React.FC<AcknowledgmentSectionProps> = ({
  reviewId,
  isAcknowledged,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const { mutate: acknowledgeReview, isPending } =
    useAcknowledgeReviewSummary();

  const handleAcknowledge = () => {
    if (isChecked) {
      acknowledgeReview({ id: reviewId.toString() });
    }
  };

  if (isAcknowledged) {
    return (
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
        <p className="text-green-700 font-medium">
          You have acknowledged this review.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-start mb-4">
        <div className="flex h-5 items-center">
          <input
            id="acknowledgment"
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="acknowledgment" className="font-medium text-gray-700">
            I acknowledge a performance discussion has taken place, and my
            review has been shared with me, understanding that my
            acknowledgement does not necessarily indicate I am in agreement with
            the content of the review.
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleAcknowledge}
          disabled={!isChecked || isPending}
          className={`px-4 py-2 rounded-md ${
            isChecked
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition-colors`}
        >
          {isPending ? "Processing..." : "Submit Acknowledgment"}
        </button>
      </div>
    </div>
  );
};

export default AcknowledgmentSection;
