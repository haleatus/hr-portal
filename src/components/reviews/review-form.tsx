"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateReviewForm from "./create-review-form";

/**
 * ReviewForm Component
 *
 * A multi-tab form for employee performance reviews with various criteria
 * and options.
 *
 * @param {ReviewFormProps} props - Component props
 * @returns {JSX.Element} The rendered form
 */
export function ReviewForm(): JSX.Element {
  // State for tracking the active tab
  const [activeTab, setActiveTab] = useState("details");

  /**
   * Handles tab changes
   * @param {string} value - The tab value to change to
   */
  const handleTabChange = (value: string): void => {
    setActiveTab(value);
  };

  /**
   * Moves to the next tab or submits the form if on the last tab
   * Uses preventDefault to avoid default form submission behavior
   */
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // Prevent default button behavior which might trigger form submission
    e.preventDefault();

    if (activeTab === "details") {
      setActiveTab("criteria");
    } else if (activeTab === "criteria") {
      setActiveTab("comments");
    } else if (activeTab === "comments") {
      setActiveTab("notifications");
    }
  };

  /**
   * Moves to the previous tab
   * Uses preventDefault to avoid default form submission behavior
   */
  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // Prevent default button behavior
    e.preventDefault();

    if (activeTab === "criteria") {
      setActiveTab("details");
    } else if (activeTab === "comments") {
      setActiveTab("criteria");
    } else if (activeTab === "notifications") {
      setActiveTab("comments");
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="details"
                className="cursor-pointer hover:bg-white hover:mx-1"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="criteria"
                className="cursor-pointer hover:bg-white hover:mx-1"
              >
                Criteria
              </TabsTrigger>
            </TabsList>

            {/* Details Tab Content */}
            <TabsContent value="details" className="space-y-4 pt-4">
              <CreateReviewForm />
            </TabsContent>

            {/* Criteria Tab Content */}
            <TabsContent value="criteria" className="space-y-4 pt-4">
              <div className="space-y-8 pt-4">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Performance Criteria</h3>
                  <p className="text-sm text-muted-foreground">
                    Rate the performance in each of the following areas on a
                    scale of 1-5.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {/* Criteria rating cards */}
                  <div className="space-y-6">nnn</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button" // Important: type="button" prevents form submission
              variant="outline"
              onClick={handlePrevious}
              disabled={activeTab === "details"}
              className="cursor-pointer"
            >
              Previous
            </Button>

            {activeTab === "notifications" ? (
              <Button type="submit" className="cursor-pointer">
                Submit Review
              </Button>
            ) : (
              <Button
                type="button" // Important: type="button" prevents form submission
                className="cursor-pointer"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
