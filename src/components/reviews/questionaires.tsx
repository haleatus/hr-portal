/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { useGetReviewDetails } from "@/hooks/reviews.hooks";
import { useReviewIdStore } from "@/store/review-store";

const RATING_DESCRIPTIONS = {
  "1": "Needs significant improvement",
  "2": "Below expectations",
  "3": "Meets expectations",
  "4": "Exceeds expectations",
  "5": "Outstanding performance",
} as const;

const Questionnaire = () => {
  const { reviewId } = useReviewIdStore(); // Retrieve the review ID from the store

  console.log("Review ID from store", reviewId);

  const {
    data: reviewDetails,
    isLoading,
    isError,
  } = useGetReviewDetails(reviewId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching review details</div>;

  const questionnaires = reviewDetails?.data?.questionnaires || [];

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
                      {/* Replace FormLabel with a standard label */}
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
                              bg-gray-50 border border-gray-200 hover:bg-gray-100
                            `}
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
                    {/* Replace FormControl with a standard div */}
                    <div>
                      <Textarea
                        placeholder={`Optional comments about ${questionnaire.question.toLowerCase()}...`}
                        className="min-h-[80px] resize-none"
                        value={questionnaire.answers.join(", ")}
                        readOnly
                      />
                    </div>
                    {/* Replace FormDescription with a standard paragraph */}
                    <p className="text-xs text-muted-foreground">
                      Provide specific examples or context for your rating
                      (optional)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Questionnaire;
