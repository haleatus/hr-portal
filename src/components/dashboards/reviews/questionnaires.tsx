/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useReviewIdStore } from "@/store/review-store";
import { useGetReviewDetails } from "@/hooks/reviews.hooks";
import { useSubmitQuestionnaire } from "@/hooks/reviews.hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2 } from "lucide-react";

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

  // State to manage multiple answers per question
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Use the submit questionnaire hook
  const submitQuestionnaireMutation = useSubmitQuestionnaire();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching review details</div>;

  const questionnaires = reviewDetails?.data?.questionnaires || [];

  // Check if a question requires rating (has "1-5 scale" in the text)
  const requiresRating = (question: string) => {
    return question.toLowerCase().includes("(1-5 scale)");
  };

  // Handle answer change for a specific index
  const handleAnswerChange = (
    questionnaireId: number,
    index: number,
    value: string
  ) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev };
      if (!updatedAnswers[questionnaireId]) {
        updatedAnswers[questionnaireId] = [""];
      }
      updatedAnswers[questionnaireId][index] = value;
      return updatedAnswers;
    });

    if (errors[questionnaireId]) {
      setErrors((prev) => ({ ...prev, [questionnaireId]: "" }));
    }
  };

  // Add a new answer field for a question
  const addAnswerField = (questionnaireId: number) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev };
      if (!updatedAnswers[questionnaireId]) {
        updatedAnswers[questionnaireId] = [""];
      } else {
        updatedAnswers[questionnaireId] = [
          ...updatedAnswers[questionnaireId],
          "",
        ];
      }
      return updatedAnswers;
    });
  };

  // Remove an answer field for a question
  const removeAnswerField = (questionnaireId: number, index: number) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev };
      if (
        updatedAnswers[questionnaireId] &&
        updatedAnswers[questionnaireId].length > 1
      ) {
        updatedAnswers[questionnaireId] = updatedAnswers[
          questionnaireId
        ].filter((_, i) => i !== index);
      }
      return updatedAnswers;
    });
  };

  // Handle rating change
  const handleRatingChange = (questionnaireId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionnaireId]: rating }));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<number, string> = {};
    questionnaires.forEach((questionnaire: any) => {
      // Initialize answers array if it doesn't exist
      if (!answers[questionnaire.id]) {
        setAnswers((prev) => ({ ...prev, [questionnaire.id]: [""] }));
      }

      // Check if at least one answer is provided and not empty
      const questionAnswers = answers[questionnaire.id] || [];
      const hasValidAnswer = questionAnswers.some(
        (answer) => answer.trim() !== ""
      );

      if (!hasValidAnswer) {
        newErrors[questionnaire.id] = "At least one answer is required";
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
      questionnaires: questionnaires.map((questionnaire: any) => {
        // Filter out empty answers
        const filteredAnswers = (answers[questionnaire.id] || []).filter(
          (answer) => answer.trim() !== ""
        );

        return {
          questionnaireId: questionnaire.id,
          answers: filteredAnswers.length > 0 ? filteredAnswers : [""], // Ensure answers is an array
          ratings: requiresRating(questionnaire.question)
            ? ratings[questionnaire.id] || 0
            : 0, // Only include rating if required
        };
      }),
    };

    try {
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

  // Initialize answers for each questionnaire if not already set
  questionnaires.forEach((questionnaire: any) => {
    if (!answers[questionnaire.id]) {
      setAnswers((prev) => ({ ...prev, [questionnaire.id]: [""] }));
    }
  });

  return (
    <>
      <div className="space-y-8 pt-4">
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Performance Criteria</h3>
          <p className="text-sm text-muted-foreground">
            Answer the following questions. Questions with (1-5 scale) require a
            rating.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          {/* Criteria rating cards */}
          <div className="space-y-6">
            {questionnaires.map((questionnaire: any) => {
              const needsRating = requiresRating(questionnaire.question);
              // Clean question text by removing the scale indicator
              const cleanQuestion = needsRating
                ? questionnaire.question.replace(/\s*$$1-5 scale$$\s*/i, "")
                : questionnaire.question;

              return (
                <div
                  key={questionnaire.id}
                  className="bg-white p-4 rounded-md border border-gray-100 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label
                        className="text-base font-medium mb-2"
                        dangerouslySetInnerHTML={{
                          __html: cleanQuestion.replace(
                            reviewDetails.data.reviewee.fullname,
                            `<span class="text-blue-500 font-semibold">${reviewDetails.data.reviewee.fullname}</span>`
                          ),
                        }}
                      />

                      {/* Only show rating if needed */}
                      {needsRating && (
                        <div className="grid grid-cols-5 gap-1 text-center mb-4">
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
                      )}

                      {/* Multiple answers section */}
                      <div className="space-y-3">
                        {(answers[questionnaire.id] || [""]).map(
                          (answer, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Textarea
                                placeholder={`Provide your answer for ${cleanQuestion.toLowerCase()}...`}
                                value={answer}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    questionnaire.id,
                                    index,
                                    e.target.value
                                  )
                                }
                                className={`min-h-[80px] resize-none flex-1 ${
                                  errors[questionnaire.id]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {index > 0 && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="mt-1"
                                  onClick={() =>
                                    removeAnswerField(questionnaire.id, index)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          )
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => addAnswerField(questionnaire.id)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Another Answer
                        </Button>

                        {errors[questionnaire.id] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[questionnaire.id]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
