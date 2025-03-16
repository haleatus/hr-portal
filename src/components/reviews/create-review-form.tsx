/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";
import {
  useCreateSelfReview,
  useCreateManagerReview,
} from "@/hooks/reviews.hooks";
import { useGetMyDepartment } from "@/hooks/department.hooks";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useReviewIdStore } from "@/store/review-store";

const CreateReviewForm = ({ handleNext }: { handleNext: () => void }) => {
  const { setReviewId } = useReviewIdStore(); // Use the store to set the review ID

  const { user, loading } = useAuth();
  const isManager = !loading && user?.role === "MANAGER";

  // Set minimum date to today for due date
  const today = new Date();
  const minDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Set default due date to 2 weeks from now
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);
  const defaultDueDate = twoWeeksFromNow.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const [formValues, setFormValues] = useState({
    reviewType: "",
    subject: "",
    description: "",
    reviewee: "",
    dueDate: defaultDueDate,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set initial review type based on user role
  useEffect(() => {
    if (!loading) {
      setFormValues((prev) => ({
        ...prev,
        reviewType: isManager ? "manager" : "self",
      }));
    }
  }, [loading, isManager]);

  const createSelfReviewMutation = useCreateSelfReview();
  const createManagerReviewMutation = useCreateManagerReview();

  const { data: departmentData, isLoading: isLoadingDepartment } =
    useGetMyDepartment();

  const teamMembers = departmentData?.data?.members || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formValues.reviewType) {
      newErrors.reviewType = "Review type is required";
    }

    if (formValues.reviewType === "self" && !formValues.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (formValues.reviewType === "self" && !formValues.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formValues.reviewType === "manager" && !formValues.reviewee) {
      newErrors.reviewee = "Please select an employee to review";
    }

    if (!formValues.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formValues.dueDate);
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      if (selectedDate < tomorrow) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      if (formValues.reviewType === "self") {
        const result = await createSelfReviewMutation.mutateAsync({
          subject: formValues.subject,
          description: formValues.description,
          dueDate: formValues.dueDate,
        });
        setReviewId(result.data.id);
        toast.success("Self review created successfully");
        handleNext();
      } else if (formValues.reviewType === "manager") {
        const revieweeId = Number(formValues.reviewee);
        if (isNaN(revieweeId)) {
          toast.error("Invalid reviewee ID");
          return;
        }

        const result = await createManagerReviewMutation.mutateAsync({
          reviewee: revieweeId,
          dueDate: formValues.dueDate,
        });
        setReviewId(result.data.id);
        toast.success("Manager review created successfully");
        handleNext();
      } else if (formValues.reviewType === "peer") {
        toast.info("Peer review functionality coming soon");
      }

      // Reset form after successful submission
      setFormValues({
        reviewType: isManager ? "manager" : "self",
        subject: "",
        description: "",
        reviewee: "",
        dueDate: defaultDueDate,
      });
    } catch (error: any) {
      console.error("Review creation error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create review. Please try again."
      );
    }
  };

  const isPending =
    createSelfReviewMutation.isPending || createManagerReviewMutation.isPending;

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Review Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Review Type</label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "reviewType")}
              value={formValues.reviewType}
              disabled={loading}
            >
              <SelectTrigger
                className={errors.reviewType ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select review type" />
              </SelectTrigger>
              <SelectContent>
                {!loading && user?.role !== "MANAGER" && (
                  <SelectItem value="self">Self Assessment</SelectItem>
                )}
                <SelectItem value="peer">Peer Review</SelectItem>
                {!loading && user?.role === "MANAGER" && (
                  <SelectItem value="manager">Manager Review</SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.reviewType && (
              <p className="text-red-500 text-xs mt-1">{errors.reviewType}</p>
            )}
          </div>

          {/* Subject and Description (for self review) */}
          {formValues.reviewType === "self" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  name="subject"
                  value={formValues.subject}
                  onChange={handleChange}
                  className={errors.subject ? "border-red-500" : ""}
                  placeholder="Q1 Performance Review"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  placeholder="Provide additional context for this review..."
                  className={`min-h-[100px] resize-y
                    ${errors.description ? "border-red-500" : ""}
                 `}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Reviewee (for manager review) */}
          {formValues.reviewType === "manager" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Reviewee</label>
              <Select
                onValueChange={(value) => handleSelectChange(value, "reviewee")}
                value={formValues.reviewee}
                disabled={isLoadingDepartment}
              >
                <SelectTrigger
                  className={errors.reviewee ? "border-red-500" : ""}
                >
                  <SelectValue
                    placeholder={
                      isLoadingDepartment
                        ? "Loading team members..."
                        : "Select employee to review"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingDepartment ? (
                    <div className="flex items-center justify-center py-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading team members...
                    </div>
                  ) : teamMembers.length === 0 ? (
                    <div className="py-2 text-sm text-center">
                      No team members found
                    </div>
                  ) : (
                    teamMembers.map((memberItem: any) => (
                      <SelectItem
                        key={memberItem.member.id}
                        value={String(memberItem.member.id)}
                      >
                        {memberItem.member.fullname} ({memberItem.member.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.reviewee && (
                <p className="text-red-500 text-xs mt-1">{errors.reviewee}</p>
              )}
            </div>
          )}

          {/* Due Date with standard input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              name="dueDate"
              value={formValues.dueDate}
              min={minDate}
              onChange={handleChange}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateReviewForm;
