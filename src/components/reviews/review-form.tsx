"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  // Comments
  strengths: z.string().optional(),
  improvements: z.string().optional(),
  additionalComments: z.string().optional(),

  // Notifications
  sendEmail: z.boolean().default(true),
  sendReminders: z.boolean().default(true),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReviewForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [activeTab, setActiveTab] = useState("details");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewType: "self",
      subject: "",
      dueDate: new Date().toISOString().split("T")[0],
      description: "",
      sendEmail: true,
      sendReminders: true,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNext = () => {
    if (activeTab === "details") {
      setActiveTab("criteria");
    } else if (activeTab === "criteria") {
      setActiveTab("comments");
    } else if (activeTab === "comments") {
      setActiveTab("notifications");
    } else {
      form.handleSubmit(handleSubmit)();
    }
  };

  const handlePrevious = () => {
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="criteria">Criteria</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

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

              <TabsContent value="criteria" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Performance Criteria</h3>
                  <p className="text-sm text-muted-foreground">
                    Rate the performance in each of the following areas on a
                    scale of 1-5.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="technicalSkills"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Technical Skills</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-2"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <FormItem
                              key={rating}
                              className="flex items-center space-x-1"
                            >
                              <FormControl>
                                <RadioGroupItem value={rating.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {rating}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Knowledge and application of technical skills required
                        for the role.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="communication"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Communication</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-2"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <FormItem
                              key={rating}
                              className="flex items-center space-x-1"
                            >
                              <FormControl>
                                <RadioGroupItem value={rating.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {rating}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Ability to communicate effectively with team members and
                        stakeholders.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teamwork"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Teamwork</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-2"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <FormItem
                              key={rating}
                              className="flex items-center space-x-1"
                            >
                              <FormControl>
                                <RadioGroupItem value={rating.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {rating}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Collaboration and contribution to team objectives.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="problemSolving"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Problem Solving</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-2"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <FormItem
                              key={rating}
                              className="flex items-center space-x-1"
                            >
                              <FormControl>
                                <RadioGroupItem value={rating.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {rating}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Ability to identify, analyze, and resolve problems
                        effectively.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leadership"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Leadership</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-2"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <FormItem
                              key={rating}
                              className="flex items-center space-x-1"
                            >
                              <FormControl>
                                <RadioGroupItem value={rating.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {rating}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Ability to guide, influence, and inspire others.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

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

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={activeTab === "details"}
              >
                Previous
              </Button>

              {activeTab === "notifications" ? (
                <Button type="submit">Submit Review</Button>
              ) : (
                <Button type="button" onClick={handleNext}>
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
