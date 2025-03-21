import React from "react";
import RatingStars from "./rating-star";
import { FeedbackResponse } from "@/interfaces/reviews.interface";

interface FeedbackCardProps {
  feedback: FeedbackResponse;
  title: string;
  colorScheme: "blue" | "purple";
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  title,
  colorScheme,
}) => {
  const bgColor = colorScheme === "blue" ? "bg-blue-50" : "bg-purple-50";
  const textColor =
    colorScheme === "blue" ? "text-blue-800" : "text-purple-800";

  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className={`font-semibold ${textColor}`}>{title}</h4>
        {feedback.ratings > 0 && <RatingStars rating={feedback.ratings} />}
      </div>
      <p className="text-gray-700">
        {feedback.answers[0] || "No feedback provided"}
      </p>
    </div>
  );
};

export default FeedbackCard;
