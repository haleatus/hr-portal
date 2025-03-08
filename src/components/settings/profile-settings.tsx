"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUserStore } from "@/store/users/user-store";
import Image from "next/image";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  title: z.string().optional(),
  department: z.string().optional(),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, fetchMeUser, isLoading: isUserLoading } = useUserStore();

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    name: "",
    email: "",
    title: "",
    department: "",
    bio: "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  // Fetch user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Only force refresh if no user data is present
        await fetchMeUser(user === null);

        // Update form values with user data
        if (user) {
          form.reset({
            name: user.fullname || user.name || "",
            email: user.email || "",
            title: "",
            department: "",
            bio: "",
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to load user profile");
      }
    };

    loadUserData();
    // Add form.reset as dependency to prevent warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMeUser, user?.id]);

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    console.log("profile-data", data);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Invalidate cache after successful update
      useUserStore.getState().invalidateCache();

      toast.success("Your profile has been updated successfully.");
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and how it appears across the
            platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 w-full mb-6">
            {isUserLoading ? (
              <div className="flex items-center justify-center w-full p-6 min-h-[120px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading user data...
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative bg-card rounded-lg shadow-sm p-4 border w-full">
                <div className="flex">
                  <div className="flex items-center gap-3">
                    <div className="relative overflow-hidden h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt="User"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">
                        {user?.fullname || user?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.role} | {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 flex gap-2 text-sm">
                    <span className="text-muted-foreground">Joined:</span>
                    <span>
                      {new Date(user?.createdAt ?? "").toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt="Profile"
              />
              <AvatarFallback>
                {user?.fullname?.[0] || user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button size="sm">Change Avatar</Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This email will be used for notifications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description for your profile. Max 500 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Update Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Label component for the password section
function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}
