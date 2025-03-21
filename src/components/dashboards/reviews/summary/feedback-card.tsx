import type React from "react";
import RatingStars from "./rating-star";
import type { FeedbackResponse } from "@/interfaces/reviews.interface";

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
  const bgColor = colorScheme === "blue" ? "bg-blue-50/50" : "bg-purple-50/50";
  const borderColor =
    colorScheme === "blue" ? "border-blue-200" : "border-purple-200";
  const textColor =
    colorScheme === "blue" ? "text-blue-700" : "text-purple-700";

  return (
    <div
      className={`${bgColor} p-5 rounded-lg border ${borderColor} transition-all hover:shadow-sm`}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className={`font-medium ${textColor}`}>{title}</h4>
        {feedback.ratings !== undefined && feedback.ratings > 0 && (
          <RatingStars rating={feedback.ratings} />
        )}
      </div>

      {feedback.answers.length > 0 ? (
        <div className="space-y-3">
          {feedback.answers.map((answer, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded border border-gray-100"
            >
              <p className="text-gray-700 text-sm">{answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-3 rounded border border-gray-100 text-gray-500 text-sm italic">
          No feedback provided
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
