"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import Loading from "@/app/(dashboard)/loading";
import { useUpdateAdminDetails } from "@/hooks/admin.hooks";
import { toast } from "sonner";
import { useAdminDetailUpdateStore } from "@/store/admin-store";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CalendarClock, ShieldUser, User } from "lucide-react";
import { IAdminDetailsUpdate } from "@/interfaces/admin.interface";

const AdminProfileSettings = () => {
  const { user, loading: userLoading } = useAuth();
  const { mutate: updateAdmin, isPending } = useUpdateAdminDetails();
  const error = useAdminDetailUpdateStore((state) => state.error);
  const clearError = useAdminDetailUpdateStore((state) => state.clearError);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm<IAdminDetailsUpdate>({
    defaultValues: {
      name: "",
    },
  });

  // Watch the name field for the dynamic preview
  const watchedName = watch("name");

  // Set default values when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.fullname || user.name || "",
      });
    }
  }, [user, reset]);

  if (userLoading || !user) {
    return <Loading />;
  }

  const onSubmit = (data: IAdminDetailsUpdate) => {
    // Call the update mutation
    updateAdmin(
      {
        id: user.id,
        data: {
          name: data.name,
        },
      },
      {
        onSuccess: () => {
          toast.success("Your profile has been updated successfully.");
          clearError();
          // Reset the form's dirty state by setting new defaults
          reset(data, { keepValues: true });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(
            error?.message || "Failed to update profile. Please try again."
          );
        },
      }
    );
  };

  const handleCancel = () => {
    // Reset form to original values
    reset({
      name: user.fullname || user.name || "",
    });
    clearError();
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left side - User profile */}
              <div className="p-6 flex items-start gap-3">
                <div className="bg-primary/10 text-primary rounded-full p-3 shrink-0">
                  <ShieldUser className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {watchedName || user.fullname || user.name}
                  </h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Right side - Badges and description */}
              <div className="p-6 flex flex-col justify-between items-end">
                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="outline"
                    className="bg-background/80 flex items-center gap-1.5"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="capitalize">{user.role}</span>
                  </Badge>
                  {user.updatedAt && (
                    <Badge
                      variant="outline"
                      className="bg-background/80 flex items-center gap-1.5"
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      <span>Last updated: {formatDate(user.updatedAt)}</span>
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground mt-4">
                  <p>
                    Update your profile information below. Your changes will be
                    reflected across the system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Profile Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Updating your profile information below will be reflected across the
            system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="px-6 py-3 mx-6 mb-4 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    placeholder="Enter your name"
                    className="transition-all"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* You can add more fields here as needed */}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={!isDirty}
              className="transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isDirty}
              className="transition-all"
            >
              {isPending ? "Updating..." : "Update Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminProfileSettings;
