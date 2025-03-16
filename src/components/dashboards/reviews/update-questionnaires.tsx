"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateQuestionnaire } from "@/hooks/reviews.hooks";
import { toast } from "sonner";
import { PlusCircle, Trash2, Save, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RATING_DESCRIPTIONS = {
  "1": "Needs significant improvement",
  "2": "Below expectations",
  "3": "Meets expectations",
  "4": "Exceeds expectations",
  "5": "Outstanding performance",
} as const;

interface Questionnaire {
  id: number;
  question: string;
  answers: string[];
  ratings: number;
}

interface UpdateQuestionnaireProps {
  reviewId: string;
  questionnaires: Questionnaire[];
}

const UpdateQuestionnaire = ({
  reviewId,
  questionnaires,
}: UpdateQuestionnaireProps) => {
  const router = useRouter();

  // State to manage answers and ratings
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Use the update questionnaire hook
  const updateQuestionnaireMutation = useUpdateQuestionnaire();

  // Initialize state with existing data
  useEffect(() => {
    const initialAnswers: Record<number, string[]> = {};
    const initialRatings: Record<number, number> = {};

    questionnaires.forEach((questionnaire) => {
      initialAnswers[questionnaire.id] = [...questionnaire.answers];
      initialRatings[questionnaire.id] = questionnaire.ratings;
    });

    setAnswers(initialAnswers);
    setRatings(initialRatings);
  }, [questionnaires]);

  // Check if a question requires rating (has "1-5 scale" in the text)
  const requiresRating = (question: string) => {
    return question.toLowerCase().includes("(1-5 scale)");
  };

  // Clean question text by removing the scale indicator
  const cleanQuestionText = (question: string) => {
    return requiresRating(question)
      ? question.replace(/\s*$$1-5 scale$$\s*/i, "")
      : question;
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

    setIsFormDirty(true);
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

    setIsFormDirty(true);
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

    setIsFormDirty(true);
  };

  // Handle rating change
  const handleRatingChange = (questionnaireId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionnaireId]: rating }));
    setIsFormDirty(true);
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<number, string> = {};
    questionnaires.forEach((questionnaire) => {
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
      questionnaires: questionnaires.map((questionnaire) => {
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
      await updateQuestionnaireMutation.mutateAsync({
        questionnaireData,
      });

      toast.success("Questionnaire updated successfully");
      setIsFormDirty(false);

      router.push(`/reviews/${reviewId}`);
    } catch (error) {
      console.error("Failed to update questionnaire:", error);
      toast.error("Failed to update questionnaire. Please try again.");
    }
  };

  return (
    <div className="space-y-8 pt-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/reviews/${reviewId}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Review
        </Link>

        <Button
          variant="default"
          size="sm"
          onClick={() => router.push(`/reviews/${reviewId}`)}
          disabled={updateQuestionnaireMutation.isPending}
        >
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Responses</CardTitle>
          <CardDescription>
            Edit your responses to the review questions. Questions with (1-5
            scale) require a rating.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questionnaires.map((questionnaire) => {
              const needsRating = requiresRating(questionnaire.question);
              const cleanQuestion = cleanQuestionText(questionnaire.question);

              return (
                <div
                  key={questionnaire.id}
                  className="bg-muted/20 p-4 rounded-md border border-muted"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-base font-medium mb-2">
                        {cleanQuestion}
                        {needsRating && (
                          <span className="text-sm text-muted-foreground ml-2">
                            (1-5 scale)
                          </span>
                        )}
                      </label>

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
                                    ? "bg-blue-100 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500"
                                    : "bg-muted border-muted-foreground/20 hover:bg-muted/80"
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
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="mt-1"
                                        onClick={() =>
                                          removeAnswerField(
                                            questionnaire.id,
                                            index
                                          )
                                        }
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-red-500">
                                        Delete this answer
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
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
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-4">
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={updateQuestionnaireMutation.isPending || !isFormDirty}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {updateQuestionnaireMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdateQuestionnaire;
