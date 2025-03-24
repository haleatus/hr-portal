"use client";

import type React from "react";
import FeedbackCard from "./feedback-card";
import type { QuestionnaireItem as QuestionnaireItemType } from "@/interfaces/reviews.interface";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface QuestionnaireItemProps {
  item: QuestionnaireItemType;
}

const QuestionnaireItem: React.FC<QuestionnaireItemProps> = ({ item }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.h3
        className="text-lg font-medium text-gray-800 mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {item.question}
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FeedbackCard
            feedback={item.managerFeedback}
            title="Manager Feedback"
            colorScheme="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <FeedbackCard
            feedback={item.revieweeFeedback}
            title="Self Assessment"
            colorScheme="purple"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuestionnaireItem;
