"use client";

// Core React imports
import React, { useState } from "react";

// UI components imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Custom hooks imports
import { useUpdateDepartmentName } from "@/hooks/department.hooks";

// Third party libraries imports
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Lucide icons imports
import { Edit } from "lucide-react";
import DepartmentDeletionDialog from "./department-deletion-dialog";
import { Input } from "@/components/ui/input";

// Form schema for department name update
const departmentUpdateSchema = z.object({
  department: z.string().min(1, "Department name is required"),
});

/**
 * DepartmentNameUpdateForm component
 * @returns {JSX.Element} JSX Element - Update dialog for department name
 */
const DepartmentNameUpdateForm = ({
  departmentDetailsData,
  departmentId,
  members,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  departmentDetailsData: any;
  departmentId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: any[];
}) => {
  // Dialog state for department name update
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  // Mutation for updating department name
  const updateDepartmentMutation = useUpdateDepartmentName();

  // Update form submit handler
  const updateForm = useForm({
    resolver: zodResolver(departmentUpdateSchema),
    defaultValues: {
      department: "",
    },
  });

  // Handle when edit icon is clicked
  const handleEditClick = () => {
    if (departmentDetailsData) {
      updateForm.reset({
        department: departmentDetailsData.data.department,
      });
      setIsUpdateFormOpen(true);
    }
  };

  // Handle form submission
  const onUpdateSubmit = (values: z.infer<typeof departmentUpdateSchema>) => {
    updateDepartmentMutation.mutate(
      {
        id: Number(departmentId),
        data: {
          department: values.department,
        },
      },
      {
        onSuccess: () => {
          setIsUpdateFormOpen(false);
          toast.success("Department name has been updated successfully.");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update department name.");
        },
      }
    );
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleEditClick}
              className="p-1 rounded-md hover:bg-muted/80 transition-colors cursor-pointer text-muted-foreground hover:text-blue-500"
              aria-label="Edit department name"
            >
              <Edit className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change Department Name</p>
          </TooltipContent>
        </Tooltip>
        {members.length === 0 && (
          <DepartmentDeletionDialog departmentId={departmentDetailsData} />
        )}
      </TooltipProvider>

      {/* Department Name Update Dialog */}
      <Dialog open={isUpdateFormOpen} onOpenChange={setIsUpdateFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Department Name</DialogTitle>
            <DialogDescription>
              Change the name of the department.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={updateForm.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter department name"
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateDepartmentMutation.isPending}
                >
                  {updateDepartmentMutation.isPending
                    ? "Updating..."
                    : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentNameUpdateForm;
