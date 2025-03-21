import type React from "react";
import { Star } from "lucide-react";

interface OverallRatingCardProps {
  rating: number;
}

const OverallRatingCard: React.FC<OverallRatingCardProps> = ({ rating }) => {
  // Function to get feedback message based on rating
  const getFeedbackMessage = (rating: number) => {
    const numRating = Number(rating);
    if (numRating >= 4.5) return "Outstanding Performance";
    if (numRating >= 4) return "Excellent Work";
    if (numRating >= 3) return "Good Performance";
    if (numRating >= 2) return "Developing Skills";
    return "Needs Improvement";
  };

  // Function to get color scheme based on rating
  const getColorScheme = (rating: number) => {
    const numRating = Number(rating);
    if (numRating >= 4.5) return "text-emerald-600 bg-emerald-50";
    if (numRating >= 4) return "text-blue-600 bg-blue-50";
    if (numRating >= 3) return "text-indigo-600 bg-indigo-50";
    if (numRating >= 2) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const message = getFeedbackMessage(rating);
  const colorScheme = getColorScheme(rating);

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Overall Performance
      </h3>

      <div className={`${colorScheme} rounded-full px-6 py-3 mb-4`}>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold">
            {Number(rating).toFixed(1)}
          </span>
          <Star className="h-6 w-6 fill-current" />
          <span className="text-lg font-medium">/ 5.0</span>
        </div>
      </div>

      <h4 className="text-xl font-medium mb-3">{message}</h4>

      <p className="text-gray-600 max-w-md">
        {rating >= 4
          ? "Consistently exceeds expectations and delivers exceptional results. A valuable asset to the team."
          : rating >= 3
          ? "Meets expectations and contributes positively to team goals. Shows potential for further growth."
          : rating >= 2
          ? "Shows progress in key areas but has opportunities for improvement. Additional support and development recommended."
          : "Requires significant improvement in multiple areas. A focused development plan is recommended."}
      </p>
    </div>
  );
};

export default OverallRatingCard;
