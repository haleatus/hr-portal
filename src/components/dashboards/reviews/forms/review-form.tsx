"use client";

import { JSX, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateReviewForm from "./create-review-form";
import Questionnaire from "../questionnaires";

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
  const handleNext = (): void => {
    if (activeTab === "details") {
      setActiveTab("criteria");
    } else if (activeTab === "criteria") {
      setActiveTab("comments");
    } else if (activeTab === "comments") {
      setActiveTab("notifications");
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
                disabled={activeTab !== "details"}
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="criteria"
                className="cursor-pointer hover:bg-white hover:mx-1"
                disabled={activeTab !== "criteria"}
              >
                Criteria
              </TabsTrigger>
            </TabsList>

            {/* Details Tab Content */}
            <TabsContent value="details" className="space-y-4 pt-4">
              <CreateReviewForm handleNext={handleNext} />
            </TabsContent>

            {/* Criteria Tab Content */}
            <TabsContent value="criteria" className="space-y-4 pt-4">
              <Questionnaire />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
