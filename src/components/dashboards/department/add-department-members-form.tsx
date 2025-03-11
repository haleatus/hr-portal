/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAllNonTeamEmployees } from "@/hooks/admin.hooks";
import { useAddDepartmentMembers } from "@/hooks/department.hooks";
import { IDepartmentCreateResponse } from "@/interfaces/department.interface";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

// UI component imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldPlus, Users, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * Form input interface for department creation
 * @interface FormInputs
 * @property {number} leader - ID of the department leader
 * @property {string} department - Name of the department
 * @property {number[]} members - Array of member IDs
 */
interface FormInputs {
  team: number;
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
 * AddDepartmentMembersForm component
 * Provides a form for adding new departments members
 * @returns {JSX.Element}
 */
const AddDepartmentMembersForm = ({
  departmentId,
}: {
  departmentId: number;
}) => {
  // UI state management
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);

  // Dialog state
  const [isOpen, setIsOpen] = useState(false);

  // Fetch managers and employees data from API
  const employeesQuery = useGetAllNonTeamEmployees();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      team: departmentId,
      members: [],
    },
  });

  // Fetch the createDepartment mutation
  const addDepartmentMembersMutation = useAddDepartmentMembers();

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

    // Validate that at least one member is selected
    if (data.members.length === 0) {
      setError("members", {
        type: "manual",
        message: "At least one member must be selected",
      });
      return;
    }

    addDepartmentMembersMutation.mutate(data, {
      onSuccess: (response) => {
        if (response && response.statusCode) {
          // Show success message
          toast.success(
            response.message || "Department members added successfully"
          );

          // Reset the form
          reset();

          // Clear selected members
          setSelectedMembers([]);
        } else {
          setGeneralError("An unexpected error occurred");
          toast.error("Failed to add department members");
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
  const isLoading = employeesQuery.isLoading;

  // Format managers and employees for select components
  const employees = employeesQuery.data?.data || [];

  return (
    <>
      <Button
        variant="default"
        onClick={() => {
          setIsOpen(true);
        }}
        className="text-white cursor-pointer"
      >
        Add Member
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg p-0">
          <DialogTitle className="text-lg font-bold px-6 pt-4">
            Add Department Members
          </DialogTitle>
          <Card className="w-full shadow-none border-none">
            {/* Show loading state while fetching data */}
            {isLoading ? (
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">
                    Loading data...
                  </p>
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
                        {employees.length === 0 ? (
                          <SelectItem disabled value="No employees">
                            No employees available
                          </SelectItem>
                        ) : (
                          <>
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
                          </>
                        )}
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
                    disabled={addDepartmentMembersMutation.isPending}
                  >
                    {addDepartmentMembersMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        <span className="ml-2">Creating Department...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ShieldPlus className="h-4 w-4" />
                        Add Members
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDepartmentMembersForm;
