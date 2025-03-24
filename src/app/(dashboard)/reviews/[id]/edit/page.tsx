"use client";
import { useParams } from "next/navigation";
import { useGetReviewDetails } from "@/hooks/reviews.hooks";
import UpdateQuestionnaire from "@/components/dashboards/reviews/forms/update-questionnaires";
import Loading from "@/app/loading";

const EditReviewPage = () => {
  const params = useParams();
  const reviewId = params.id as string;

  // Fetch review data using the hook
  const { data: reviewData, isLoading } = useGetReviewDetails(reviewId);

  if (isLoading) {
    return <Loading />;
  }

  if (!reviewData || !reviewData.data) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Review not found</h2>
          <p className="text-muted-foreground">
            {`The review you're looking for doesn't exist or you don't have
            permission to view it.`}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-8 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
        Edit Review: {reviewData.data.subject}
      </h1>

      {reviewData.data.reviewType === "PEER" ? (
        <UpdateQuestionnaire
          reviewId={reviewId}
          questionnaires={reviewData.data.questionnaires}
          peerReview={true}
        />
      ) : (
        <UpdateQuestionnaire
          reviewId={reviewId}
          questionnaires={reviewData.data.questionnaires}
        />
      )}
    </div>
  );
};

export default EditReviewPage;
