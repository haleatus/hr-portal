"use client";

import { JSX, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
/**
 * Type definitions for performance criteria and comment fields
 */
// Define as const objects instead of arrays to allow usage in both type and value contexts
const CRITERIA = {
  technicalSkills: "technicalSkills",
  communication: "communication",
  teamwork: "teamwork",
  problemSolving: "problemSolving",
  leadership: "leadership",
} as const;

const COMMENT_FIELDS = {
  technicalSkillsComments: "technicalSkillsComments",
  communicationComments: "communicationComments",
  teamworkComments: "teamworkComments",
  problemSolvingComments: "problemSolvingComments",
  leadershipComments: "leadershipComments",
} as const;

// Create types from those constants
type CriteriaName = (typeof CRITERIA)[keyof typeof CRITERIA];
type CommentFieldName = (typeof COMMENT_FIELDS)[keyof typeof COMMENT_FIELDS];

/**
 * Rating descriptions for better context
 */
const RATING_DESCRIPTIONS = {
  "1": "Needs significant improvement",
  "2": "Below expectations",
  "3": "Meets expectations",
  "4": "Exceeds expectations",
  "5": "Outstanding performance",
} as const;

/**
 * Form validation schema using Zod
 */
const formSchema = z.object({
  reviewType: z.string(),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  employee: z.string().optional(),
  dueDate: z.string(),
  description: z.string().optional(),

  // Performance criteria
  technicalSkills: z.string().optional(),
  communication: z.string().optional(),
  teamwork: z.string().optional(),
  problemSolving: z.string().optional(),
  leadership: z.string().optional(),

  // Criteria comments
  technicalSkillsComments: z.string().optional(),
  communicationComments: z.string().optional(),
  teamworkComments: z.string().optional(),
  problemSolvingComments: z.string().optional(),
  leadershipComments: z.string().optional(),

  // Summary comments
  strengths: z.string().optional(),
  improvements: z.string().optional(),
  additionalComments: z.string().optional(),

  // Notifications
  sendEmail: z.boolean().default(true),
  sendReminders: z.boolean().default(true),
});

// Type inference from the schema
type FormValues = z.infer<typeof formSchema>;

/**
 * Component props interface
 */
interface ReviewFormProps {
  onSubmit: (data: FormValues) => void;
}

/**
 * ReviewForm Component
 *
 * A multi-tab form for employee performance reviews with various criteria
 * and options.
 *
 * @param {ReviewFormProps} props - Component props
 * @returns {JSX.Element} The rendered form
 */
export function ReviewForm({ onSubmit }: ReviewFormProps): JSX.Element {
  // State for tracking the active tab
  const [activeTab, setActiveTab] = useState("details");

  // Initialize the form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewType: "self",
      subject: "",
      dueDate: new Date().toISOString().split("T")[0],
      description: "",

      // Initialize comment fields with empty strings
      technicalSkillsComments: "",
      communicationComments: "",
      teamworkComments: "",
      problemSolvingComments: "",
      leadershipComments: "",

      sendEmail: true,
      sendReminders: true,
    },
  });

  /**
   * Handles form submission
   * @param {FormValues} values - The form values
   */
  const handleSubmit = (values: FormValues): void => {
    onSubmit(values);
  };

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
    } else {
      // Only submit the form on the final tab when the submit button is clicked
      form.handleSubmit(handleSubmit)();
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

  /**
   * Criteria definitions with descriptions and related fields
   */
  const criteria = [
    {
      name: CRITERIA.technicalSkills as CriteriaName,
      label: "Technical Skills",
      description:
        "Knowledge and application of technical skills required for the role.",
      commentField: COMMENT_FIELDS.technicalSkillsComments as CommentFieldName,
    },
    {
      name: CRITERIA.communication as CriteriaName,
      label: "Communication",
      description:
        "Ability to communicate effectively with team members and stakeholders.",
      commentField: COMMENT_FIELDS.communicationComments as CommentFieldName,
    },
    {
      name: CRITERIA.teamwork as CriteriaName,
      label: "Teamwork",
      description: "Collaboration and contribution to team objectives.",
      commentField: COMMENT_FIELDS.teamworkComments as CommentFieldName,
    },
    {
      name: CRITERIA.problemSolving as CriteriaName,
      label: "Problem Solving",
      description:
        "Ability to identify, analyze, and resolve problems effectively.",
      commentField: COMMENT_FIELDS.problemSolvingComments as CommentFieldName,
    },
    {
      name: CRITERIA.leadership as CriteriaName,
      label: "Leadership",
      description: "Ability to guide, influence, and inspire others.",
      commentField: COMMENT_FIELDS.leadershipComments as CommentFieldName,
    },
  ];

  /**
   * RatingButtons Component
   *
   * Displays and handles the 1-5 rating buttons for each criterion
   *
   * @param {Object} props - Component props
   * @param {CriteriaName} props.fieldName - The form field name for this rating
   * @returns {JSX.Element} The rendered rating buttons
   */
  const RatingButtons = ({
    fieldName,
  }: {
    fieldName: CriteriaName;
  }): JSX.Element => {
    const fieldValue = form.watch(fieldName);

    return (
      <div className="grid grid-cols-5 gap-1 text-center">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div
            key={rating}
            className={`
              p-2 rounded-md cursor-pointer transition-all
              ${
                fieldValue === rating.toString()
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
              }
            `}
            onClick={() => form.setValue(fieldName, rating.toString())}
          >
            <div className="font-medium mb-1">{rating}</div>

            <div className="text-xs hidden md:block">
              {
                RATING_DESCRIPTIONS[
                  rating.toString() as keyof typeof RATING_DESCRIPTIONS
                ]
              }
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          {/* 
            Important: Use onSubmit={e => e.preventDefault()} to prevent accidental form submission
            when interacting with the form. The actual submission is handled by the submit button.
          */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Only proceed with submission if we're on the notifications tab
              if (activeTab === "notifications") {
                form.handleSubmit(handleSubmit)(e);
              }
            }}
            className="space-y-6"
          >
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              {/* Tab Navigation */}
              <TabsList className="grid w-full grid-cols-4">
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
                <TabsTrigger
                  value="comments"
                  className="cursor-pointer hover:bg-white hover:mx-1"
                >
                  Comments
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="cursor-pointer hover:bg-white hover:mx-1"
                >
                  Notifications
                </TabsTrigger>
              </TabsList>

              {/* Details Tab Content */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="reviewType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select review type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="self">Self Assessment</SelectItem>
                          <SelectItem value="peer">Peer Review</SelectItem>
                          <SelectItem value="manager">
                            Manager Review
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of review you want to create.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {/* Conditionally render employee selection for peer and manager reviews */}
                {form.watch("reviewType") !== "self" && (
                  <FormField
                    control={form.control}
                    name="employee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">John Smith</SelectItem>
                            <SelectItem value="2">Sarah Williams</SelectItem>
                            <SelectItem value="3">Michael Brown</SelectItem>
                            <SelectItem value="4">Emily Davis</SelectItem>
                            <SelectItem value="5">David Wilson</SelectItem>
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
              </TabsContent>

              {/* Criteria Tab Content */}
              <TabsContent value="criteria" className="space-y-4 pt-4">
                <div className="space-y-8 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">
                      Performance Criteria
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Rate the performance in each of the following areas on a
                      scale of 1-5.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {/* Rating scale legend */}
                    <div className="flex items-center justify-between mb-4 px-2">
                      <div className="w-1/4"></div>
                      <div className="w-3/4 grid grid-cols-5 gap-1 text-center text-xs font-medium">
                        {Object.entries(RATING_DESCRIPTIONS).map(
                          ([rating, desc]) => (
                            <div
                              key={rating}
                              className="flex flex-col items-center"
                            >
                              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mb-1">
                                {rating}
                              </span>
                              <span className="hidden md:inline text-gray-600">
                                {desc}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Criteria rating cards */}
                    <div className="space-y-6">
                      {criteria.map((criterion) => (
                        <div
                          key={criterion.name}
                          className="bg-white p-4 rounded-md border border-gray-100 shadow-sm"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center">
                              <div className="w-full md:w-1/4">
                                <FormLabel className="text-base font-medium">
                                  {criterion.label}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  {criterion.description}
                                </FormDescription>
                              </div>
                              <div className="w-full md:w-3/4 mt-2 md:mt-0">
                                <RatingButtons fieldName={criterion.name} />
                              </div>
                            </div>

                            {/* Comments section for each criterion */}
                            <FormField
                              control={form.control}
                              name={criterion.commentField}
                              render={({ field }) => (
                                <div className="mt-4">
                                  <FormControl>
                                    <Textarea
                                      placeholder={`Optional comments about ${criterion.label.toLowerCase()}...`}
                                      className="min-h-[80px] resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    Provide specific examples or context for
                                    your rating (optional)
                                  </FormDescription>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Comments Tab Content */}
              <TabsContent value="comments" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Qualitative Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide detailed feedback on performance strengths and areas
                    for improvement.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="strengths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Strengths</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the key strengths demonstrated..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Highlight specific examples of exceptional performance.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="improvements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Areas for Improvement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Identify areas where improvement is needed..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Suggest specific actions for development.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any other feedback or observations..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Notifications Tab Content */}
              <TabsContent value="notifications" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how participants will be notified about this
                    review.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="sendEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Send Email Notification</FormLabel>
                        <FormDescription>
                          Notify participants via email when the review is
                          assigned.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Send Reminder Notifications</FormLabel>
                        <FormDescription>
                          Send periodic reminders as the due date approaches.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
