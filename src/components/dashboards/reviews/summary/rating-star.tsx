import type React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, maxRating = 5 }) => {
  const numRating = Number(rating);

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < numRating ? "text-amber-400 fill-amber-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-600">
        {Number.isNaN(numRating) ? "-" : numRating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;
// Compare this snippet from src/components/dashboards/reviews/summary/overall-rating-card.tsx:
