"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Star, StarHalf, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

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
  const [activeTab, setActiveTab] = useState("overview");
  const review = reviewData.data;

  // Calculate average rating
  const totalRatings = review.questionnaires.reduce(
    (sum, q) => sum + q.ratings,
    0
  );
  const averageRating = totalRatings / review.questionnaires.length;

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
    switch (status) {
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

  return (
    <div className="container p-6">
      <div className="flex items-center justify-between">
        <Link
          href="/reviews"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Link>
        <Badge className={getStatusColor(review.progressStatus)}>
          {review.progressStatus}
        </Badge>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {review.subject}
          </h1>
          <p className="text-muted-foreground">{review.description}</p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>
                {review.reviewType === "SELF"
                  ? "Self Review"
                  : review.reviewType === "MANAGER"
                  ? "Manager Review"
                  : "Peer Review"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Created on {formattedCreatedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Due by {formattedDueDate}</span>
            </div>
          </div>
        </div>

        <Separator />

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions & Answers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-muted p-6">
                  <div className="flex">{renderRatingStars(averageRating)}</div>
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
                  {review.questionnaires.map((q) => (
                    <div key={q.id} className="grid gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate max-w-[80%]">
                          {q.question}
                        </span>
                        <span className="text-sm">{q.ratings}/5</span>
                      </div>
                      <Progress value={q.ratings * 20} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            {review.questionnaires.map((questionnaire) => (
              <Card key={questionnaire.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-medium">
                      {questionnaire.question}
                    </CardTitle>
                    <div className="flex">
                      {renderRatingStars(questionnaire.ratings)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4">
                    <p className="whitespace-pre-line">
                      {questionnaire.answers[0]}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Example usage
export default function ReviewDetailPage() {
  // In a real app, you would fetch this data from an API
  const reviewData = {
    statusCode: 200,
    timestamp: "2025-03-15T06:30:22.313Z",
    message: "success",
    data: {
      id: 14,
      createdAt: "2025-03-11T14:21:28.371Z",
      updatedAt: "2025-03-11T14:28:27.913Z",
      reviewType: "SELF",
      subject: "monthly self review",
      description: "This is a periodic self review to evaluate my performance",
      progressStatus: "SUBMITTED",
      dueDate: "2025-03-12T14:00:00.000Z",
      questionnaires: [
        {
          id: 87,
          createdAt: "2025-03-11T14:21:28.915Z",
          updatedAt: "2025-03-11T14:27:18.351Z",
          question:
            "What challenges did you face, and how did you overcome them?",
          answers: ["Another response for questionnaire 87"],
          ratings: 4,
        },
        {
          id: 86,
          createdAt: "2025-03-11T14:21:28.915Z",
          updatedAt: "2025-03-11T14:27:17.769Z",
          question:
            "What achievements are you most proud of during this period?",
          answers: ["This is my response for questionnaire 86"],
          ratings: 5,
        },
        {
          id: 90,
          createdAt: "2025-03-11T14:21:28.915Z",
          updatedAt: "2025-03-11T14:27:18.236Z",
          question: "What are your goals for the next review period?",
          answers: ["Another response for questionnaire 90"],
          ratings: 4,
        },
        {
          id: 89,
          createdAt: "2025-03-11T14:21:28.915Z",
          updatedAt: "2025-03-11T14:27:18.240Z",
          question: "How well do you collaborate with your team members?",
          answers: ["Another response for questionnaire 89"],
          ratings: 4,
        },
        {
          id: 91,
          createdAt: "2025-03-11T14:21:28.915Z",
          updatedAt: "2025-03-11T14:27:18.255Z",
          question: "What skills or areas do you think you need to improve?",
          answers: ["Another response for questionnaire 91"],
          ratings: 4,
        },
        {
          id: 92,
          createdAt: "2025-03-11T14:21:28.915Z",
          updatedAt: "2025-03-11T14:27:18.264Z",
          question:
            "On a scale of 1-5, how would you rate your overall performance in the last review period?",
          answers: ["Another response for questionnaire 92"],
          ratings: 4,
        },
        {
          id: 88,
          createdAt: "2025-03-11T14:21:28.915Z",
          updatedAt: "2025-03-11T14:27:18.295Z",
          question: "What support or resources do you need to perform better?",
          answers: ["Another response for questionnaire 88"],
          ratings: 4,
        },
        {
          id: 93,
          createdAt: "2025-03-11T14:21:28.915Z",
          updatedAt: "2025-03-11T14:27:18.295Z",
          question:
            "How effectively do you manage your time and prioritize tasks?",
          answers: ["Another response for questionnaire 93"],
          ratings: 4,
        },
      ],
    },
  };

  return <ReviewDetail reviewData={reviewData} />;
}
