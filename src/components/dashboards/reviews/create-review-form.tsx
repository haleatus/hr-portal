/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Core react imports
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// UI component imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Loader2 } from "lucide-react";

// Hook imports
import {
  useCreateSelfReview,
  useCreateManagerReview,
  useCreatePeerNomination,
} from "@/hooks/reviews.hooks";
import { useGetMyDepartment } from "@/hooks/department.hooks";

// Other imports
import { toast } from "sonner";

// Provider imports
import { useAuth } from "@/providers/auth-provider";

// Store imports
import { useReviewIdStore } from "@/store/review-store";

/**
 * CreateReviewForm Component
 * @param handleNext - Function to move to the next tab
 * @returns JSX.Element
 */
const CreateReviewForm = ({ handleNext }: { handleNext: () => void }) => {
  // Get the router object
  const router = useRouter();

  // Get the review ID store
  const { setReviewId } = useReviewIdStore();

  // Get the user and loading status from the auth provider
  const { user, loading } = useAuth();

  // Check if the user is a manager
  const isManager = !loading && user?.role === "MANAGER";

  // Set minimum date to today for due date
  const today = new Date();
  const minDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Set default due date to 2 weeks from now
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);
  const defaultDueDate = twoWeeksFromNow.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // State for form values and errors
  const [formValues, setFormValues] = useState({
    reviewType: "",
    subject: "",
    description: "",
    reviewee: "",
    nominee: "",
    dueDate: defaultDueDate,
  });

  // State for form errors
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

  // Mutation hooks for creating reviews
  const createSelfReviewMutation = useCreateSelfReview();
  const createPeerNominationMutation = useCreatePeerNomination();
  const createManagerReviewMutation = useCreateManagerReview();

  // Get department data for manager reviews
  const { data: departmentData, isLoading: isLoadingDepartment } =
    useGetMyDepartment();

  // Get team members from department data
  const teamMembers = departmentData?.data?.members || [];

  // Handle form input changes
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

  // Handle select input changes
  const handleSelectChange = (value: string, name: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation function
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

    if (formValues.reviewType === "peer") {
      if (!formValues.nominee) {
        newErrors.nominee = "Please select a nominee";
      }

      if (!formValues.reviewee) {
        newErrors.reviewee = "Please select a reviewee";
      }

      if (formValues.nominee === formValues.reviewee && formValues.nominee) {
        newErrors.nominee = "Nominee and reviewee cannot be the same person";
      }
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

  // Handle form submission
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
        const nomineeId = Number(formValues.nominee);
        const revieweeId = Number(formValues.reviewee);

        if (isNaN(nomineeId) || isNaN(revieweeId)) {
          toast.error("Invalid nominee or reviewee ID");
          return;
        }

        await createPeerNominationMutation.mutateAsync({
          nominee: nomineeId,
          reviewee: revieweeId,
        });

        toast.success("Peer review nomination created successfully");
        router.push("/reviews");
      }

      // Reset form after successful submission
      setFormValues({
        reviewType: isManager ? "manager" : "self",
        subject: "",
        description: "",
        reviewee: "",
        nominee: "",
        dueDate: defaultDueDate,
      });
    } catch (error: any) {
      //   console.error("Review creation error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create review. Please try again."
      );
    }
  };

  // Check if any mutation is pending
  const isPending =
    createSelfReviewMutation.isPending ||
    createManagerReviewMutation.isPending ||
    createPeerNominationMutation.isPending;

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

          {/* Nominee and Reviewee (for peer review) */}
          {formValues.reviewType === "peer" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nominee (Who will do the review)
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(value, "nominee")
                  }
                  value={formValues.nominee}
                  disabled={isLoadingDepartment}
                >
                  <SelectTrigger
                    className={errors.nominee ? "border-red-500" : ""}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingDepartment
                          ? "Loading team members..."
                          : "Select nominee"
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
                      teamMembers
                        .filter(
                          (memberItem: any) =>
                            String(memberItem.member.id) !== formValues.reviewee
                        )
                        .map((memberItem: any) => (
                          <SelectItem
                            key={memberItem.member.id}
                            value={String(memberItem.member.id)}
                          >
                            {memberItem.member.fullname} (
                            {memberItem.member.email})
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {errors.nominee && (
                  <p className="text-red-500 text-xs mt-1">{errors.nominee}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Reviewee (Who will be reviewed)
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(value, "reviewee")
                  }
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
                          : "Select reviewee"
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
                      teamMembers
                        .filter(
                          (memberItem: any) =>
                            String(memberItem.member.id) !== formValues.nominee
                        )
                        .map((memberItem: any) => (
                          <SelectItem
                            key={memberItem.member.id}
                            value={String(memberItem.member.id)}
                          >
                            {memberItem.member.fullname} (
                            {memberItem.member.email})
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {errors.reviewee && (
                  <p className="text-red-500 text-xs mt-1">{errors.reviewee}</p>
                )}
              </div>
            </>
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
