"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "@/providers/auth-provider";
import Loading from "@/app/(dashboard)/loading";
import { useUpdateAdminDetails } from "@/hooks/admin.hooks";
import { toast } from "sonner";
import { useAdminDetailUpdateStore } from "@/store/admin-store";

const AdminProfileSettings = () => {
  const { user, loading: userLoading } = useAuth();
  const { mutate: updateAdmin, isPending } = useUpdateAdminDetails();
  const error = useAdminDetailUpdateStore((state) => state.error);
  const clearError = useAdminDetailUpdateStore((state) => state.clearError);

  // Local state for the form
  const [formData, setFormData] = useState({
    name: "",
  });

  // Initialize form data when user data is loaded
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullname || user.name || "",
      });
    }
  }, [user]);

  if (userLoading || !user) {
    return <Loading />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if form data hasn't changed
    if (formData.name === (user.fullname || user.name)) {
      toast.info(
        "No changes detected, Please make changes before updating your profile."
      );
      clearError();
      return;
    }

    // Call the update mutation
    updateAdmin(
      {
        id: user.id,
        data: {
          name: formData.name,
        },
      },
      {
        onSuccess: () => {
          toast.success("Your profile has been updated successfully.");
          clearError();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 bg-red-100 text-red-600 rounded-md mb-4">
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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
              </div>

              {/* You can add more fields here as needed */}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setFormData({
                name: user.fullname || user.name || "",
              })
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isPending || formData.name === (user.fullname || user.name)
            }
          >
            {isPending ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminProfileSettings;
