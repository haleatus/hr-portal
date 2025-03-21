"use client";

import type React from "react";
import { useState } from "react";
import { useAcknowledgeReviewSummary } from "@/hooks/reviews.hooks";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ClipboardCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white rounded-full p-3 mb-4 shadow-sm">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Review Acknowledged
          </h3>
          <p className="text-green-700">
            You have successfully acknowledged this performance review summary.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-start">
          <div className="bg-white rounded-full p-2 mr-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-amber-800 mb-2">
              Action Required
            </h3>
            <p className="text-amber-700">
              Please review your performance assessment and acknowledge receipt
              by checking the box below.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start mb-6">
          <div className="mt-1">
            <input
              id="acknowledgment"
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer"
            />
          </div>
          <div className="ml-3">
            <label
              htmlFor="acknowledgment"
              className="text-gray-800 font-medium cursor-pointer"
            >
              Acknowledgment Statement
            </label>
            <p className="mt-1 text-gray-600 text-sm">
              I acknowledge a performance discussion has taken place, and my
              review has been shared with me, understanding that my
              acknowledgement does not necessarily indicate I am in agreement
              with the content of the review.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleAcknowledge}
            disabled={!isChecked || isPending}
            className={`relative px-6 py-2 rounded-md transition-all duration-200 ${
              isChecked && !isPending
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Submit Acknowledgment
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgmentSection;
