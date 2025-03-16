/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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

// Form validation schema
const formSchema = z.object({
  reviewType: z.enum(["self", "peer", "manager"]),
  subject: z.string().min(1, "Subject is required").optional(),
  description: z.string().optional(),
  reviewee: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
});

const CreateReviewForm = () => {
  // Get the mutation hooks
  const createSelfReviewMutation = useCreateSelfReview();
  const createManagerReviewMutation = useCreateManagerReview();

  // Get department data for team members (for manager review)
  const { data: departmentData, isLoading: isLoadingDepartment } =
    useGetMyDepartment();

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewType: "self",
      subject: "",
      description: "",
      reviewee: "",
      dueDate: "",
    },
  });

  // Watch the review type to conditionally render fields
  const reviewType = form.watch("reviewType");

  // Reset form fields when review type changes
  useEffect(() => {
    if (reviewType === "self") {
      form.setValue("reviewee", "");
    } else if (reviewType === "manager") {
      form.setValue("subject", "");
      form.setValue("description", "");
    }
  }, [reviewType, form]);

  // Handle form submission
  const onSubmit = async (values: any) => {
    try {
      if (values.reviewType === "self") {
        // Submit self review
        await createSelfReviewMutation.mutateAsync({
          subject: values.subject,
          description: values.description,
          dueDate: values.dueDate,
        });
        toast.success("Self review created successfully");
      } else if (values.reviewType === "manager") {
        // Submit manager review
        await createManagerReviewMutation.mutateAsync({
          revieweeId: values.reviewee,
          dueDate: values.dueDate,
        });
        toast.success("Manager review created successfully");
      } else if (values.reviewType === "peer") {
        // API not ready yet
        toast.info("Peer review functionality is not yet available");
        return;
      }

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create review. Please try again.");
    }
  };

  // Get team members for reviewee selection
  const teamMembers = departmentData?.data?.members || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reviewType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select review type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="self">Self Assessment</SelectItem>
                  <SelectItem value="peer">Peer Review</SelectItem>
                  <SelectItem value="manager">Manager Review</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of review you want to create.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show subject and description only for self reviews */}
        {reviewType === "self" && (
          <>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Q1 Performance Review" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a descriptive title for this review.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide additional context for this review..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Show reviewee selection for manager reviews */}
        {reviewType === "manager" && (
          <FormField
            control={form.control}
            name="reviewee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reviewee</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee to review" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingDepartment ? (
                      <SelectItem value="" disabled>
                        Loading team members...
                      </SelectItem>
                    ) : (
                      teamMembers.map((memberItem: any) => (
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
                <FormDescription>
                  Select the employee to review.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Set the deadline for completing this review.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={
            createSelfReviewMutation.isPending ||
            createManagerReviewMutation.isPending ||
            (reviewType === "manager" && isLoadingDepartment)
          }
        >
          {createSelfReviewMutation.isPending ||
          createManagerReviewMutation.isPending
            ? "Creating..."
            : "Create Review"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateReviewForm;
