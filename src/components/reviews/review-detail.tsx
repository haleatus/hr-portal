"use client";

import { useState } from "react";

const ReviewDetailPage = ({ id }: { id: string }) => {
  const [review] = useState({
    employeeName: "John Doe",
    position: "Senior Software Engineer",
    reviewPeriod: "Q1 2024",
    overallRating: 4.5,
    scores: [
      { category: "Performance", score: 4 },
      { category: "Collaboration", score: 5 },
      { category: "Innovation", score: 4 },
      { category: "Communication", score: 5 },
    ],
    comments: [
      {
        type: "Manager",
        text: "John consistently delivers high-quality work and shows great initiative.",
      },
      {
        type: "Peer",
        text: "Always willing to help teammates and shares valuable knowledge.",
      },
      {
        type: "Self",
        text: "I feel I have improved technically but need to work more on time management.",
      },
    ],
    goals: [
      { title: "Complete Project X", status: "Completed" },
      { title: "Learn React Native", status: "In Progress" },
      { title: "Improve CI/CD pipeline", status: "Not Started" },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {review.employeeName}
        </h1>
        <p className="text-gray-600">
          {review.position} - {review.reviewPeriod} Review
        </p>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Performance Breakdown {id}
          </h2>
          <div className="mt-2 space-y-2">
            {review.scores.map((score) => (
              <div
                key={score.category}
                className="flex justify-between text-gray-600"
              >
                <span>{score.category}</span>
                <span>
                  {"★".repeat(score.score) + "☆".repeat(5 - score.score)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Feedback</h2>
          <div className="mt-2 space-y-2">
            {review.comments.map((comment) => (
              <div key={comment.type} className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">{comment.type}</p>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Goal Progress</h2>
          <div className="mt-2 space-y-2">
            {review.goals.map((goal) => (
              <div
                key={goal.title}
                className="flex justify-between text-gray-600"
              >
                <span>{goal.title}</span>
                <span
                  className={`text-sm font-medium ${
                    goal.status === "Completed"
                      ? "text-green-600"
                      : goal.status === "In Progress"
                      ? "text-yellow-600"
                      : "text-gray-400"
                  }`}
                >
                  {goal.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">Overall Rating</h2>
          <p className="text-3xl font-semibold text-purple-600 mt-2">
            {review.overallRating} / 5
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
