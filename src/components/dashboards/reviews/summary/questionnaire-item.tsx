import React from "react";
import FeedbackCard from "./feedback-card";
import { QuestionnaireItem as QuestionnaireItemType } from "@/interfaces/reviews.interface";

interface QuestionnaireItemProps {
  item: QuestionnaireItemType;
}

const QuestionnaireItem: React.FC<QuestionnaireItemProps> = ({ item }) => {
  return (
    <div className="mb-8 border-b pb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        {item.question}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeedbackCard
          feedback={item.managerFeedback}
          title="Manager Feedback"
          colorScheme="blue"
        />

        <FeedbackCard
          feedback={item.revieweeFeedback}
          title="Self Assessment"
          colorScheme="purple"
        />
      </div>
    </div>
  );
};

export default QuestionnaireItem;
