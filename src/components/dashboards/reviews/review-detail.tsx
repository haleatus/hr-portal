"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  StarHalf,
  User,
  FileText,
  BarChart2,
  EditIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMarkReviewAsComplete } from "@/hooks/reviews.hooks";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

// Type definitions
interface Questionnaire {
  id: number;
  createdAt: string;
  updatedAt: string;
  question: string;
  answers: string[];
  ratings: number;
}

interface ReviewData {
  id: number;
  createdAt: string;
  updatedAt: string;
  reviewType: string;
  subject: string;
  description: string;
  progressStatus: string;
  reviewee: {
    id: number;
    fullname: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  reviewer: {
    id: number;
    fullname: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  dueDate: string;
  questionnaires: Questionnaire[];
}

interface ReviewResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: ReviewData;
}

export function ReviewDetail({ reviewData }: { reviewData: ReviewResponse }) {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const review = reviewData.data;

  // Calculate average rating
  const ratedQuestionnaires = review.questionnaires.filter(
    (q) => q.ratings > 0
  );
  const totalRatings = ratedQuestionnaires.reduce(
    (sum, q) => sum + q.ratings,
    0
  );
  const averageRating =
    ratedQuestionnaires.length > 0
      ? totalRatings / ratedQuestionnaires.length
      : 0;

  // Format dates
  const formattedDueDate = format(
    new Date(review.dueDate),
    "MMMM d, yyyy 'at' h:mm a"
  );
  const formattedCreatedDate = format(
    new Date(review.createdAt),
    "MMMM d, yyyy"
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUBMITTED":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/10";
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10";
      case "DRAFT":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10";
      default:
        return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/10";
    }
  };

  // Render stars for ratings
  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <StarHalf key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
        );
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-muted-foreground" />);
      }
    }
    return stars;
  };

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

  const markReviewAsCompletedMutation = useMarkReviewAsComplete();

  const handleMarkAsComplete = async (reviewId: string) => {
    try {
      await markReviewAsCompletedMutation.mutateAsync(reviewId);
      toast.success("Review marked as completed successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          "An error occurred while marking the review as completed"
      );
    }
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/reviews"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reviews
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
            {review.subject}
          </h1>
        </div>
        <Badge
          className={`${getStatusColor(
            review.progressStatus
          )} text-sm px-3 py-1`}
        >
          {review.progressStatus}
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card className="border-muted/40">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-muted-foreground">{review.description}</p>
              <div className="flex items-center gap-2">
                {user?.role === "MANAGER" &&
                  review.progressStatus === "SUBMITTED" && (
                    <Button
                      variant="outline"
                      onClick={() => handleMarkAsComplete(review.id.toString())}
                    >
                      Mark As Completed
                    </Button>
                  )}

                {review.progressStatus !== "COMPLETED" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="cursor-pointer size-9"
                        >
                          <Link href={`/reviews/${review.id}/edit`}>
                            <EditIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Edit Review "${review.subject}"`}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Review Type</div>
                  <div className="text-muted-foreground">
                    {review.reviewType === "SELF"
                      ? "Self Review"
                      : review.reviewType === "MANAGER"
                      ? "Manager Review"
                      : "Peer Review"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Created On</div>
                  <div className="text-muted-foreground">
                    {formattedCreatedDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Due By</div>
                  <div className="text-muted-foreground">
                    {formattedDueDate}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 grid grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Questions & Answers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {ratedQuestionnaires.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Performance Summary</CardTitle>
                  <CardDescription>
                    Average rating across all performance criteria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-muted/50 p-6">
                    <div className="flex">
                      {renderRatingStars(averageRating)}
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {averageRating.toFixed(1)}/5.0
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Average Rating
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {ratedQuestionnaires.map((q) => (
                      <div key={q.id} className="grid gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate max-w-[80%]">
                            {cleanQuestionText(q.question)}
                          </span>
                          <span className="text-sm font-medium">
                            {q.ratings}/5
                          </span>
                        </div>
                        <Progress value={q.ratings * 20} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No ratings available for this review.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            {review.questionnaires.map((questionnaire) => (
              <Card key={questionnaire.id} className="overflow-hidden">
                <CardHeader className="bg-muted/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle
                      className="text-base font-medium"
                      dangerouslySetInnerHTML={{
                        __html: cleanQuestionText(
                          questionnaire.question
                        ).replace(
                          review.reviewee.fullname,
                          `<span class="text-blue-500 font-semibold">${review.reviewee.fullname}</span>`
                        ),
                      }}
                    />
                    {questionnaire.ratings > 0 && (
                      <div className="flex shrink-0">
                        {renderRatingStars(questionnaire.ratings)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {questionnaire.answers && questionnaire.answers.length > 0 ? (
                    <div className="divide-y">
                      {questionnaire.answers.map((answer, index) => (
                        <div key={index} className="p-4">
                          {questionnaire.answers.length > 1 && (
                            <div className="text-xs font-medium text-muted-foreground mb-2">
                              Answer {index + 1}
                            </div>
                          )}
                          <div className="rounded-md bg-muted/30 p-4">
                            <p className="whitespace-pre-line">{answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No answers provided
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
