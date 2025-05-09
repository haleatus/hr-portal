import { ReviewForm } from "@/components/dashboards/reviews/forms/review-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateReviewPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/reviews">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reviews
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Review</h1>
        <p className="text-muted-foreground">Set up a new performance review</p>
      </div>

      <ReviewForm />
    </div>
  );
}
