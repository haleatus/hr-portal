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
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

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

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handleAcknowledge = () => {
    if (isChecked) {
      acknowledgeReview({ id: reviewId.toString() });
    }
  };

  if (isAcknowledged) {
    return (
      <motion.div
        ref={ref}
        className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.7,
          type: "spring",
          stiffness: 50,
          damping: 15,
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div
            className="bg-white rounded-full p-3 mb-4 shadow-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              delay: 0.3,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
          >
            <motion.div
              animate={
                isInView
                  ? {
                      rotate: [0, 10, 0],
                    }
                  : {}
              }
              transition={{
                delay: 0.8,
                duration: 0.6,
                type: "tween", // Explicitly set animation type to tween
              }}
            >
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </motion.div>
          </motion.div>
          <motion.h3
            className="text-lg font-medium text-green-800 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Review Acknowledged
          </motion.h3>
          <motion.p
            className="text-green-700"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            You have successfully acknowledged this performance review summary.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={ref} className="mt-8">
      <motion.div
        className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
        }}
      >
        <div className="flex items-start">
          <motion.div
            className="bg-white rounded-full p-2 mr-4 shadow-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              delay: 0.3,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
          >
            <motion.div
              animate={
                isInView
                  ? {
                      y: [0, -3, 0, -3, 0],
                    }
                  : {}
              }
              transition={{
                delay: 0.8,
                duration: 1,
                repeat: 2,
                repeatType: "reverse",
                type: "tween", // Explicitly set animation type to tween instead of spring
              }}
            >
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </motion.div>
          </motion.div>
          <div>
            <motion.h3
              className="text-lg font-medium text-amber-800 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Action Required
            </motion.h3>
            <motion.p
              className="text-amber-700"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Please review your performance assessment and acknowledge receipt
              by checking the box below.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: 0.3,
          type: "spring",
          stiffness: 100,
        }}
      >
        <motion.div
          className="flex items-start mb-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div
            className="mt-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <input
              id="acknowledgment"
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer"
            />
          </motion.div>
          <div className="ml-3">
            <motion.label
              htmlFor="acknowledgment"
              className="text-gray-800 font-medium cursor-pointer"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Acknowledgment Statement
            </motion.label>
            <motion.p
              className="mt-1 text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              I acknowledge a performance discussion has taken place, and my
              review has been shared with me, understanding that my
              acknowledgement does not necessarily indicate I am in agreement
              with the content of the review.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.div
            whileHover={!isPending && isChecked ? { scale: 1.03 } : {}}
            whileTap={!isPending && isChecked ? { scale: 0.97 } : {}}
          >
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
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AcknowledgmentSection;
