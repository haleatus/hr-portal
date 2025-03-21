"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Star, TrendingUp, Brain, Users, Clock, Target } from "lucide-react";

interface OverallRatingCardProps {
  rating: number;
}

// Performance categories with sample data
// In a real app, these would come from the API
const performanceCategories = [
  { name: "Productivity", icon: TrendingUp, value: 0, color: "bg-blue-500" },
  { name: "Knowledge & Skills", icon: Brain, value: 0, color: "bg-indigo-500" },
  { name: "Teamwork", icon: Users, value: 0, color: "bg-purple-500" },
  { name: "Timeliness", icon: Clock, value: 0, color: "bg-pink-500" },
  { name: "Goal Achievement", icon: Target, value: 0, color: "bg-amber-500" },
];

const OverallRatingCard: React.FC<OverallRatingCardProps> = ({ rating }) => {
  const numRating = Number(rating);
  const [categories, setCategories] = useState(performanceCategories);
  const [animatedRating, setAnimatedRating] = useState(0);

  // Generate realistic-looking category ratings based on overall rating
  useEffect(() => {
    // Only run once when component mounts
    const variance = 0.7; // How much categories can vary from overall rating
    const newCategories = categories.map((category) => {
      // Generate a value that's within variance of the overall rating
      // but still between 1 and 5
      let value = numRating + (Math.random() * variance * 2 - variance);
      value = Math.max(1, Math.min(5, value));
      return { ...category, value };
    });
    setCategories(newCategories);

    // Animate the rating number counting up
    const duration = 1500; // ms
    const interval = 15; // ms
    const steps = duration / interval;
    const increment = numRating / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numRating) {
        current = numRating;
        clearInterval(timer);
      }
      setAnimatedRating(current);
    }, interval);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numRating]);

  // Function to get feedback message based on rating
  const getFeedbackMessage = (rating: number) => {
    if (rating >= 4.5) return "Outstanding Performance";
    if (rating >= 4) return "Excellent Work";
    if (rating >= 3) return "Good Performance";
    if (rating >= 2) return "Developing Skills";
    return "Needs Improvement";
  };

  // Function to get color scheme based on rating
  const getColorScheme = (rating: number) => {
    if (rating >= 4.5)
      return "text-emerald-600 from-emerald-500 to-emerald-400";
    if (rating >= 4) return "text-blue-600 from-blue-500 to-blue-400";
    if (rating >= 3) return "text-indigo-600 from-indigo-500 to-indigo-400";
    if (rating >= 2) return "text-amber-600 from-amber-500 to-amber-400";
    return "text-red-600 from-red-500 to-red-400";
  };

  const message = getFeedbackMessage(numRating);
  const colorScheme = getColorScheme(numRating);

  // Calculate the percentage for the circular progress
  const percentage = (numRating / 5) * 100;
  const circumference = 2 * Math.PI * 58; // 58 is the radius of the circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Overall Performance Assessment
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Circular Rating Indicator */}
        <div className="flex flex-col items-center justify-center col-span-1">
          <div className="relative size-48 flex items-center justify-center">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="58"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="58"
                fill="none"
                stroke={`url(#${colorScheme.split(" ")[1]}Gradient)`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                className="transition-all duration-1000 ease-out"
              />
              {/* Define gradients */}
              <defs>
                <linearGradient
                  id="emerald-500Gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient
                  id="blue-500Gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient
                  id="indigo-500Gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient
                  id="amber-500Gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient
                  id="red-500Gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>
            </svg>

            {/* Rating text in the center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-4xl font-bold ${colorScheme.split(" ")[0]}`}
              >
                {animatedRating.toFixed(1)}
              </span>
              <div className="flex items-center mt-1">
                <Star
                  className={`h-5 w-5 ${
                    colorScheme.split(" ")[0]
                  } fill-current`}
                />
                <span className="text-gray-500 text-sm ml-1">/ 5.0</span>
              </div>
            </div>
          </div>

          <h4
            className={`text-xl font-medium mt-4 mb-2 ${
              colorScheme.split(" ")[0]
            }`}
          >
            {message}
          </h4>
        </div>

        {/* Category Progress Bars */}
        <div className="col-span-1 md:col-span-2 w-full space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="w-full">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <category.icon className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {category.value.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${category.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(category.value / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-8 p-5 bg-white rounded-lg border border-gray-200 shadow-sm w-full">
        <h5 className="font-medium text-gray-800 mb-3">Performance Summary</h5>
        <p className="text-gray-600">
          {numRating >= 4
            ? "Consistently exceeds expectations and delivers exceptional results. Demonstrates strong leadership qualities and contributes innovative ideas. A valuable asset to the team with excellent technical and interpersonal skills."
            : numRating >= 3
            ? "Meets expectations and contributes positively to team goals. Demonstrates good understanding of responsibilities and delivers quality work. Shows potential for further growth with continued development in key areas."
            : numRating >= 2
            ? "Shows progress in key areas but has opportunities for improvement. Additional support and development recommended to enhance performance. With focused effort, can achieve consistent results across all responsibilities."
            : "Requires significant improvement in multiple areas. A focused development plan is recommended with regular check-ins and mentoring. Clear goals and expectations should be established to track progress."}
        </p>
      </div>
    </div>
  );
};

export default OverallRatingCard;
