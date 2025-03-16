"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ReviewsList } from "./reviews-list";
import {
  useGetMySelfReviews,
  useGetMyTeamManagerReviews,
  useGetMyTeamSelfReviews,
} from "@/hooks/reviews.hooks";
import Link from "next/link";
import { JSX } from "react";

// Define types for the API response
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
  reviewType: "SELF" | "PEER" | "MANAGER";
  subject: string;
  description: string;
  progressStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  questionnaires: Questionnaire[];
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: ReviewData[];
  meta: {
    limit: number;
    total: number;
    page_total: number;
    total_pages: number;
    next: number | null;
    page: number;
    previous: number | null;
  };
}

// Define the expected format for the ReviewsList component
interface ReviewListItem {
  id: string;
  type: string;
  subject: string;
  status: string;
  dueDate: string;
  description?: string;
}

interface ReviewsDashboardProps {
  userRole: string | null;
}

export function ReviewsDashboard({
  userRole,
}: ReviewsDashboardProps): JSX.Element {
  // Check if the user is a manager
  const isManager = userRole === "MANAGER";
  const isEmployee = userRole === "EMPLOYEE";

  const { data: selfReviews, isLoading: isSelfReviewsLoading } =
    useGetMySelfReviews({ isEmployee });

  // You would need to implement these hooks
  const { data: peerReviews, isLoading: isPeerReviewsLoading } = {
    data: undefined,
    isLoading: false,
  }; // Placeholder
  const { data: managerReviews, isLoading: isManagerReviewsLoading } = {
    data: undefined,
    isLoading: false,
  }; // Placeholder

  // Get my team self reviews (Manager only)
  // Pass isManager flag to conditionally enable these manager-specific queries
  const { data: myTeamSelfReviews, isLoading: isMyTeamSelfReviewsLoading } =
    useGetMyTeamSelfReviews({ isManager });

  // Get my team manager reviews (Manager only)
  const {
    data: myTeamManagerReviews,
    isLoading: isMyTeamManagerReviewsLoading,
  } = useGetMyTeamManagerReviews({ isManager });

  // Transform API data to match the format expected by ReviewsList
  const formatReviewsData = (
    reviews: ApiResponse | undefined
  ): ReviewListItem[] => {
    if (!reviews || !reviews.data) return [];

    return reviews.data.map((review) => ({
      id: review.id.toString(),
      type: review.reviewType,
      subject: review.subject,
      status: mapProgressStatus(review.progressStatus),
      dueDate: review.dueDate,
      description: review.description,
    }));
  };

  // Map API status values to UI-friendly status values
  const mapProgressStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      PENDING: "Pending",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
    };
    return statusMap[status] || status;
  };

  const formattedSelfReviews = formatReviewsData(selfReviews);
  const formattedPeerReviews = formatReviewsData(peerReviews);
  const formattedManagerReviews = formatReviewsData(managerReviews);
  const formattedMyTeamSelfReviews = formatReviewsData(myTeamSelfReviews);
  const formattedMyTeamManagerReviews = formatReviewsData(myTeamManagerReviews);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Performance Reviews</h1>
        <div className="flex gap-2">
          {(userRole === "EMPLOYEE" || userRole === "MANAGER") && (
            <Button asChild>
              <Link href="/reviews/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Review
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue={userRole === "EMPLOYEE" ? "self" : "team-manager-reviews"}
      >
        <TabsList className="mb-4">
          {userRole === "EMPLOYEE" && (
            <>
              <TabsTrigger value="self">Self Reviews</TabsTrigger>
              <TabsTrigger value="peer">Peer Reviews</TabsTrigger>
              <TabsTrigger value="manager">Manager Reviews</TabsTrigger>
            </>
          )}
          {userRole === "MANAGER" && (
            <>
              <TabsTrigger value="team-manager-reviews">
                My Team Manager Reviews
              </TabsTrigger>
              <TabsTrigger value="team-self">Team Self Reviews</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="self">
          {isSelfReviewsLoading ? (
            <div className="flex justify-center p-8">
              Loading self reviews...
            </div>
          ) : (
            <ReviewsList reviews={formattedSelfReviews} userRole={userRole} />
          )}
        </TabsContent>

        <TabsContent value="peer">
          {isPeerReviewsLoading ? (
            <div className="flex justify-center p-8">
              Loading peer reviews...
            </div>
          ) : (
            <ReviewsList reviews={formattedPeerReviews} userRole={userRole} />
          )}
        </TabsContent>

        {userRole === "EMPLOYEE" && (
          <TabsContent value="manager">
            {isManagerReviewsLoading ? (
              <div className="flex justify-center p-8">
                Loading manager reviews...
              </div>
            ) : (
              <ReviewsList
                reviews={formattedManagerReviews}
                userRole={userRole}
              />
            )}
          </TabsContent>
        )}
        {userRole === "MANAGER" && (
          <TabsContent value="team-manager-reviews">
            {isMyTeamManagerReviewsLoading ? (
              <div className="flex justify-center p-8">
                Loading team members manager reviews...
              </div>
            ) : (
              <ReviewsList
                reviews={formattedMyTeamManagerReviews}
                userRole={userRole}
              />
            )}
          </TabsContent>
        )}
        {userRole === "MANAGER" && (
          <TabsContent value="team-self">
            {isMyTeamSelfReviewsLoading ? (
              <div className="flex justify-center p-8">
                Loading team members self reviews...
              </div>
            ) : (
              <ReviewsList
                reviews={formattedMyTeamSelfReviews}
                userRole={userRole}
              />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
