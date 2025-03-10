/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useCreateDepartment,
  useGetAllEmployees,
  useGetAllManagers,
} from "@/hooks/admin.hooks";
import { IDepartmentCreateResponse } from "@/interfaces/department.interface";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Added for redirect functionality

// UI component imports
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
import { Label } from "@/components/ui/label";
import { ShieldPlus, UserCircle2, Users, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

/**
 * Form input interface for department creation
 * @interface FormInputs
 * @property {number} leader - ID of the department leader
 * @property {string} department - Name of the department
 * @property {number[]} members - Array of member IDs
 */
interface FormInputs {
  leader: number;
  department: string;
  members: number[];
}

/**
 * Interface for selected department members
 * @interface SelectedMember
 * @property {number} id - Employee ID
 * @property {string} name - Employee full name
 */
interface SelectedMember {
  id: number;
  name: string;
}

/**
 * CreateDepartmentForm component
 * Provides a form for creating new departments with leader and members
 * @returns {JSX.Element} The department creation form
 */
const CreateDepartmentForm = () => {
  // Initialize router for redirection
  const router = useRouter();

  // UI state management
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);

  // Fetch managers and employees data from API
  const managersQuery = useGetAllManagers();
  const employeesQuery = useGetAllEmployees();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      leader: 0,
      department: "",
      members: [],
    },
  });

  // Fetch the createDepartment mutation
  const createDepartmentMutation = useCreateDepartment();

  /**
   * Handles adding a member to the department
   * @param {string} employeeId - ID of the employee to add
   */
  const handleAddMember = (employeeId: string) => {
    const id = parseInt(employeeId);
    // Find employee details in the fetched data
    const employee = employeesQuery.data?.data.find(
      (emp: any) => emp.id === id
    );

    // Ensure employee exists and is not already added
    if (employee && !selectedMembers.some((member) => member.id === id)) {
      const newMember = {
        id,
        name: employee.fullname,
      };

      const newMembers = [...selectedMembers, newMember];
      setSelectedMembers(newMembers);

      // Update form value
      setValue(
        "members",
        newMembers.map((member) => member.id)
      );
    }
  };

  /**
   * Handles removing a member from the department
   * @param {number} id - ID of the member to remove
   */
  const handleRemoveMember = (id: number) => {
    const updatedMembers = selectedMembers.filter((member) => member.id !== id);
    setSelectedMembers(updatedMembers);

    // Update form value
    setValue(
      "members",
      updatedMembers.map((member) => member.id)
    );
  };

  /**
   * Form submission handler
   * Creates a new department, resets form, and redirects to departments page
   * @param {FormInputs} data - Form data to submit
   */
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Clear previous errors
    setGeneralError(null);

    createDepartmentMutation.mutate(data, {
      onSuccess: (response) => {
        if (response && response.statusCode) {
          // Show success message
          toast.success(response.message || "Department created successfully");

          // Reset the form
          reset();

          // Clear selected members
          setSelectedMembers([]);

          // Redirect to departments page
          router.push("/departments");
        } else {
          setGeneralError("An unexpected error occurred");
          toast.error("Failed to create department");
        }
      },
      onError: (error: any) => {
        // Handle the specific error format from backend
        const errorResponse = error.response?.data as
          | IDepartmentCreateResponse
          | undefined;

        if (errorResponse?.error) {
          // Set errors in react-hook-form for each field
          Object.entries(errorResponse.error).forEach(([field, message]) => {
            if (field in data) {
              setError(field as keyof FormInputs, {
                type: "server",
                message: message as string,
              });
            }
          });

          toast.error(errorResponse.message || "Validation failed");
        } else {
          // General error message
          setGeneralError(error.message || "Failed to create department");
          toast.error(error.message || "Failed to create department");
        }
      },
    });
  };

  // Determine loading states
  const isLoading = managersQuery.isLoading || employeesQuery.isLoading;

  // Format managers and employees for select components
  const managers = managersQuery.data?.data || [];
  const employees = employeesQuery.data?.data || [];

  return (
    <Card className="w-full max-w-md border-2 shadow-xl">
      <CardHeader className="space-y-1 pb-4 pt-4">
        <div className="flex items-center justify-center gap-3">
          {/* Application Logo and Title */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary p-2 shadow-md">
            <ShieldPlus className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Create Department
            </CardTitle>
            <CardDescription className="text-sm">
              Add a new department to the system
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Show loading state while fetching data */}
      {isLoading ? (
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 pb-6">
            {/* Display general error if any */}
            {generalError && (
              <div className="rounded-md bg-destructive/10 p-3 text-destructive flex items-center gap-2">
                <X className="h-4 w-4" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Department Name Input Field */}
            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <ShieldPlus className="h-4 w-4 text-muted-foreground" />
                Department Name
              </Label>
              <Input
                id="department"
                placeholder="Information Technology"
                {...register("department", {
                  required: "Department Name is required",
                })}
                className={
                  errors.department
                    ? "border-destructive focus:ring-destructive/50"
                    : ""
                }
              />
              {errors.department && (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <X className="h-3.5 w-3.5" />
                  <span>{errors.department.message}</span>
                </div>
              )}
            </div>

            {/* Leader Select Field */}
            <div className="space-y-2">
              <Label
                htmlFor="leader"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                Department Leader
              </Label>
              <Controller
                name="leader"
                control={control}
                rules={{ required: "Leader is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={
                      field.value ? field.value.toString() : undefined
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.leader
                          ? "border-destructive focus:ring-destructive/50"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager: any) => (
                        <SelectItem
                          key={manager.id}
                          value={manager.id.toString()}
                        >
                          {manager.fullname} | {manager.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.leader && (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <X className="h-3.5 w-3.5" />
                  <span>{errors.leader.message}</span>
                </div>
              )}
            </div>

            {/* Members Select Field */}
            <div className="space-y-2">
              <Label
                htmlFor="members"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Users className="h-4 w-4 text-muted-foreground" />
                Department Members
              </Label>

              {/* Display selected members with badges */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedMembers.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="px-2 py-0 text-xs font-normal"
                    >
                      {member.name}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Use standard Select to add members */}
              <Select onValueChange={handleAddMember}>
                <SelectTrigger
                  className={
                    errors.members
                      ? "border-destructive focus:ring-destructive/50"
                      : ""
                  }
                >
                  <SelectValue placeholder="Add employees" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee: any) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id.toString()}
                      disabled={selectedMembers.some(
                        (member) => member.id === employee.id
                      )}
                    >
                      {employee.fullname} | {employee.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Hidden input to keep track of members in form */}
              <input type="hidden" {...register("members")} />

              {errors.members && (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <X className="h-3.5 w-3.5" />
                  <span>{errors.members.message}</span>
                </div>
              )}
            </div>
          </CardContent>

          {/* Form Submission */}
          <CardFooter className="flex-col gap-2 pb-4">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={createDepartmentMutation.isPending}
            >
              {createDepartmentMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  <span className="ml-2">Creating Department...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldPlus className="h-4 w-4" />
                  Create Department
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
};

export default CreateDepartmentForm;
