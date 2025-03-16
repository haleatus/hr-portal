/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
import {
  useCreateSelfReview,
  useCreateManagerReview,
} from "@/hooks/reviews.hooks";
import { useGetMyDepartment } from "@/hooks/department.hooks";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

// Form validation schema
const validateForm = (values: any) => {
  const errors: any = {};

  if (!values.reviewType) {
    errors.reviewType = "Review type is required";
  }

  if (values.reviewType === "self") {
    if (!values.subject) {
      errors.subject = "Subject is required";
    }
  }

  if (values.reviewType === "manager") {
    if (!values.reviewee) {
      errors.reviewee = "Please select an employee to review";
    }
  }

  if (!values.dueDate) {
    errors.dueDate = "Due date is required";
  }

  return errors;
};

const CreateReviewForm = ({ handleNext }: { handleNext: () => void }) => {
  const { user, loading } = useAuth();
  const [formValues, setFormValues] = useState({
    reviewType: "self",
    subject: "",
    description: "",
    reviewee: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createSelfReviewMutation = useCreateSelfReview();
  const createManagerReviewMutation = useCreateManagerReview();

  const { data: departmentData, isLoading: isLoadingDepartment } =
    useGetMyDepartment();

  const teamMembers = departmentData?.data?.members || [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      if (formValues.reviewType === "self") {
        await createSelfReviewMutation.mutateAsync({
          subject: formValues.subject,
          description: formValues.description,
          dueDate: formValues.dueDate,
        });
        toast.success("Self review created successfully");
        handleNext();
      } else if (formValues.reviewType === "manager") {
        const revieweeId = Number(formValues.reviewee);
        if (isNaN(revieweeId)) {
          toast.error("Invalid reviewee ID");
          return;
        }

        await createManagerReviewMutation.mutateAsync({
          reviewee: revieweeId,
          dueDate: formValues.dueDate,
        });
        toast.success("Manager review created successfully");
        handleNext();
      } else if (formValues.reviewType === "peer") {
        toast.info("Peer review functionality is not yet available");
        return;
      }

      // Reset form
      setFormValues({
        reviewType: "self",
        subject: "",
        description: "",
        reviewee: "",
        dueDate: "",
      });
    } catch (error: any) {
      console.error("Review creation error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create review. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Review Type */}
      <div>
        <label>Review Type</label>
        <Select
          onValueChange={(value) => handleSelectChange(value, "reviewType")}
          value={formValues.reviewType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select review type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="self">Self Assessment</SelectItem>
            <SelectItem value="peer">Peer Review</SelectItem>
            {!loading && user?.role === "MANAGER" && (
              <SelectItem value="manager">Manager Review</SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.reviewType && (
          <p className="text-red-500 text-xs">{errors.reviewType}</p>
        )}
      </div>

      {/* Subject and Description (for self review) */}
      {formValues.reviewType === "self" && (
        <>
          <div>
            <label>Subject</label>
            <Input
              name="subject"
              value={formValues.subject}
              onChange={handleChange}
              className={`${errors.subject ? "border-red-500" : ""}`}
              placeholder="Q1 Performance Review"
            />
            {errors.subject && (
              <p className="text-red-500 text-xs">{errors.subject}</p>
            )}
          </div>

          <div>
            <label>Description</label>
            <Textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Provide additional context for this review..."
              className="min-h-[100px]"
            />
          </div>
        </>
      )}

      {/* Reviewee (for manager review) */}
      {formValues.reviewType === "manager" && (
        <div>
          <label>Reviewee</label>
          <Select
            onValueChange={(value) => handleSelectChange(value, "reviewee")}
            value={formValues.reviewee}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee to review" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingDepartment ? (
                <SelectItem value="" disabled>
                  Loading team members...
                </SelectItem>
              ) : teamMembers.length === 0 ? (
                <SelectItem value="" disabled>
                  No team members found
                </SelectItem>
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
            <p className="text-red-500 text-xs">{errors.reviewee}</p>
          )}
        </div>
      )}

      {/* Due Date */}
      <div>
        <label>Due Date</label>
        <Input
          type="date"
          name="dueDate"
          value={formValues.dueDate}
          className={`${errors.dueDate ? "border-red-500" : ""}`}
          onChange={handleChange}
        />
        {errors.dueDate && (
          <p className="text-red-500 text-xs">{errors.dueDate}</p>
        )}
      </div>

      <div className="flex justify-end items-center">
        {/* Submit Button */}
        <Button
          type="submit"
          disabled={
            createSelfReviewMutation.isPending ||
            createManagerReviewMutation.isPending
          }
          className="cursor-pointer"
        >
          {createSelfReviewMutation.isPending ||
          createManagerReviewMutation.isPending
            ? "Creating..."
            : "Create Review"}
        </Button>
      </div>
    </form>
  );
};

export default CreateReviewForm;
