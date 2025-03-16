/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useReviewIdStore } from "@/store/review-store";
import { useGetReviewDetails } from "@/hooks/reviews.hooks";
import { useSubmitQuestionnaire } from "@/hooks/reviews.hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RATING_DESCRIPTIONS = {
  "1": "Needs significant improvement",
  "2": "Below expectations",
  "3": "Meets expectations",
  "4": "Exceeds expectations",
  "5": "Outstanding performance",
} as const;

const Questionnaire = () => {
  const router = useRouter();

  const { reviewId } = useReviewIdStore(); // Retrieve the review ID from the store
  const {
    data: reviewDetails,
    isLoading,
    isError,
  } = useGetReviewDetails(reviewId);

  // State to manage answers and ratings
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Use the submit questionnaire hook
  const submitQuestionnaireMutation = useSubmitQuestionnaire();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching review details</div>;

  const questionnaires = reviewDetails?.data?.questionnaires || [];

  // Handle answer change
  const handleAnswerChange = (questionnaireId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionnaireId]: value }));
    if (errors[questionnaireId]) {
      setErrors((prev) => ({ ...prev, [questionnaireId]: "" }));
    }
  };

  // Handle rating change
  const handleRatingChange = (questionnaireId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionnaireId]: rating }));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<number, string> = {};
    questionnaires.forEach((questionnaire: any) => {
      if (!answers[questionnaire.id]?.trim()) {
        newErrors[questionnaire.id] = "Answer is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill out all required fields");
      return;
    }

    // Prepare the questionnaire data
    const questionnaireData = {
      questionnaires: questionnaires.map((questionnaire: any) => ({
        questionnaireId: questionnaire.id,
        answers: [answers[questionnaire.id]], // Ensure answers is an array
        ratings: ratings[questionnaire.id] || 0, // Default to 0 if no rating is provided
      })),
    };

    try {
      console.log("questionnaireData", questionnaireData);

      await submitQuestionnaireMutation.mutateAsync({
        id: reviewId,
        questionnaireData,
      });
      toast.success("Questionnaire submitted successfully");
      router.push(`/reviews/${reviewId}`);
    } catch (error) {
      console.error("Failed to submit questionnaire:", error);
      toast.error("Failed to submit questionnaire. Please try again.");
    }
  };

  return (
    <>
      <div className="space-y-8 pt-4">
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Performance Criteria</h3>
          <p className="text-sm text-muted-foreground">
            Rate the performance in each of the following areas on a scale of
            1-5.
          </p>
        </div>

        {/* Rating scale legend */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="w-1/4"></div>
          <div className="w-3/4 grid grid-cols-5 gap-1 text-center text-xs font-medium">
            {Object.entries(RATING_DESCRIPTIONS).map(([rating, desc]) => (
              <div key={rating} className="flex flex-col items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mb-1">
                  {rating}
                </span>
                <span className="hidden md:inline text-gray-600">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          {/* Criteria rating cards */}
          <div className="space-y-6">
            {questionnaires.map((questionnaire: any) => (
              <div
                key={questionnaire.id}
                className="bg-white p-4 rounded-md border border-gray-100 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-full md:w-1/4">
                      <label className="text-base font-medium">
                        {questionnaire.question}
                      </label>
                    </div>
                    <div className="w-full md:w-3/4 mt-2 md:mt-0">
                      <div className="grid grid-cols-5 gap-1 text-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <div
                            key={rating}
                            className={`
                              p-2 rounded-md cursor-pointer transition-all
                              ${
                                ratings[questionnaire.id] === rating
                                  ? "bg-blue-100 border-blue-500"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                              }
                            `}
                            onClick={() =>
                              handleRatingChange(questionnaire.id, rating)
                            }
                          >
                            <div className="font-medium mb-1">{rating}</div>
                            <div className="text-xs hidden md:block">
                              {
                                RATING_DESCRIPTIONS[
                                  rating.toString() as keyof typeof RATING_DESCRIPTIONS
                                ]
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comments section for each criterion */}
                  <div className="mt-4">
                    <Textarea
                      placeholder={`Provide your answer for ${questionnaire.question.toLowerCase()}...`}
                      value={answers[questionnaire.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(questionnaire.id, e.target.value)
                      }
                      className={`min-h-[80px] resize-none ${
                        errors[questionnaire.id] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[questionnaire.id] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[questionnaire.id]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={submitQuestionnaireMutation.isPending}
          >
            {submitQuestionnaireMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Questionnaire;
