"use client";

// import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { JSX } from "react";

// Define types for the review data
interface Questionnaire {
  id: number;
  question: string;
  answers: string[];
  ratings: number;
}

interface ReviewDetail {
  id: number;
  createdAt: string;
  updatedAt: string;
  reviewType: "SELF" | "PEER" | "MANAGER";
  subject: string;
  description: string;
  progressStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  questionnaires: Questionnaire[];
}

interface FormValues {
  answers: {
    questionId: number;
    answer: string;
    rating: number;
  }[];
}

export function ReviewDetail({ reviewId }: { reviewId: string }): JSX.Element {
  //   const params = useParams();
  //   const router = useRouter();
  //   const reviewId = params.id as string;
  console.log("Review ID:", reviewId);

  // You would implement this hook to fetch the review details
  const {
    data: review,
    isLoading,
  }: { data: ReviewDetail | null; isLoading: boolean } = {
    data: null,
    isLoading: false,
  }; // Placeholder

  // For demo purposes, we'll use the data you provided
  const demoReview: ReviewDetail = {
    id: 17,
    createdAt: "2025-03-15T05:32:52.597Z",
    updatedAt: "2025-03-15T05:32:52.597Z",
    reviewType: "SELF",
    subject: "monthly self review another 2",
    description:
      "This is a periodic self review to evaluate my performance another 2",
    progressStatus: "PENDING",
    dueDate: "2025-03-17T14:00:00.000Z",
    questionnaires: [
      {
        id: 110,
        question: "What achievements are you most proud of during this period?",
        answers: [],
        ratings: 0,
      },
      {
        id: 111,
        question:
          "What challenges did you face, and how did you overcome them?",
        answers: [],
        ratings: 0,
      },
      {
        id: 112,
        question: "What support or resources do you need to perform better?",
        answers: [],
        ratings: 0,
      },
      {
        id: 113,
        question: "How well do you collaborate with your team members?",
        answers: [],
        ratings: 0,
      },
      {
        id: 114,
        question: "What are your goals for the next review period?",
        answers: [],
        ratings: 0,
      },
      {
        id: 115,
        question: "What skills or areas do you think you need to improve?",
        answers: [],
        ratings: 0,
      },
      {
        id: 116,
        question:
          "On a scale of 1-5, how would you rate your overall performance in the last review period?",
        answers: [],
        ratings: 0,
      },
      {
        id: 117,
        question:
          "How effectively do you manage your time and prioritize tasks?",
        answers: [],
        ratings: 0,
      },
    ],
  };

  const reviewData = review || demoReview;

  const form = useForm<FormValues>({
    defaultValues: {
      answers: reviewData.questionnaires.map((q) => ({
        questionId: q.id,
        answer: "",
        rating: q.ratings || 0,
      })),
    },
  });

  const mapProgressStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      PENDING: "Pending",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
    };
    return statusMap[status] || status;
  };

  const statusVariant: Record<string, "default" | "outline" | "secondary"> = {
    Pending: "secondary",
    "In Progress": "outline",
    Completed: "default",
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Submitting review answers:", data);
    // Implement your API call to save the answers
    // Then navigate or show success message
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading review details...</div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Link
        href="/reviews"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Reviews
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{reviewData.subject}</h1>
          <p className="text-muted-foreground">{reviewData.description}</p>
        </div>
        <Badge
          variant={statusVariant[mapProgressStatus(reviewData.progressStatus)]}
        >
          {mapProgressStatus(reviewData.progressStatus)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Review Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Type
                </dt>
                <dd>{reviewData.reviewType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Due Date
                </dt>
                <dd>{formatDate(reviewData.dueDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created
                </dt>
                <dd>{formatDate(reviewData.createdAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span>0%</span>
              </div>
              <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                <div
                  className="h-full bg-primary"
                  style={{ width: "0%" }} // This would be dynamic based on completed answers
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {reviewData.questionnaires.map(
            (question: Questionnaire, index: number) => {
              const isRatingQuestion = question.question
                .toLowerCase()
                .includes("scale");

              return (
                <Card key={question.id} className="w-full">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {index + 1}. {question.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isRatingQuestion ? (
                      <FormField
                        control={form.control}
                        name={`answers.${index}.rating`}
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                                defaultValue={field.value.toString()}
                                className="flex space-x-4"
                              >
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <FormItem
                                    key={value}
                                    className="flex items-center space-x-2"
                                  >
                                    <FormControl>
                                      <RadioGroupItem
                                        value={value.toString()}
                                      />
                                    </FormControl>
                                    <FormLabel>{value}</FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        control={form.control}
                        name={`answers.${index}.answer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your answer..."
                                {...field}
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            }
          )}

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Responses
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
