"use client";

// Core React imports
import React, { useState } from "react";

// UI components imports
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Custom hooks imports
import { useGetAllNonTeamManagers } from "@/hooks/admin.hooks";
import { useChangeDepartmentManager } from "@/hooks/department.hooks";

// Third party imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Interface imports
import { IDepartmentMembers } from "./department-details";

// Icons imports
import { Edit } from "lucide-react";

// Zod schema for department manager change form
const departmentManagerChangeSchema = z.object({
  leader: z.number().min(1, "Leader ID is required"),
});

/**
 * DepartmentManagerChangeForm component
 * @param {IDepartmentMembers} departmentDetailsData
 * @param {string} id
 * @returns {JSX.Element} JSX Element - Change department manager form
 */
const DepartmentManagerChangeForm = ({
  departmentDetailsData,
  id,
}: {
  departmentDetailsData: IDepartmentMembers;
  id: string;
}) => {
  // State variables
  const [isChangeManagerOpen, setIsChangeManagerOpen] = useState(false);

  // Custom hooks
  const managersQuery = useGetAllNonTeamManagers();
  const changeDepartmentManagerMutation = useChangeDepartmentManager();

  // Form hook
  const changeManagerForm = useForm({
    resolver: zodResolver(departmentManagerChangeSchema),
    defaultValues: {
      leader: 0,
    },
  });

  // Handle when change manager icon is clicked
  const handleChangeManagerClick = () => {
    if (departmentDetailsData) {
      changeManagerForm.reset({
        leader: 0,
      });
      setIsChangeManagerOpen(true);
    }
  };

  // Handle change manager form submission
  const onChangeManagerSubmit = (
    values: z.infer<typeof departmentManagerChangeSchema>
  ) => {
    changeDepartmentManagerMutation.mutate(
      {
        id: Number(id),
        data: {
          leader: values.leader,
        },
      },
      {
        onSuccess: () => {
          setIsChangeManagerOpen(false);
          toast.success("Department manager has been updated successfully.");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update department manager.");
        },
      }
    );
  };

  return (
    <>
      {/* Change department manager icon */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleChangeManagerClick}
              className="p-1 rounded-md hover:bg-muted/80 transition-colors cursor-pointer text-muted-foreground hover:text-blue-500"
              aria-label="Change department manager"
            >
              <Edit className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-blue-500">Change Department Manager</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Change department manager dialog  */}
      <Dialog open={isChangeManagerOpen} onOpenChange={setIsChangeManagerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Department Manager</DialogTitle>
            <DialogDescription>
              Assign a new manager to lead this department.
            </DialogDescription>
          </DialogHeader>

          {/* Change department manager form */}
          <Form {...changeManagerForm}>
            <form
              onSubmit={changeManagerForm.handleSubmit(onChangeManagerSubmit)}
              className="space-y-4"
            >
              <FormField
                control={changeManagerForm.control}
                name="leader"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select New Manager</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={
                          field.value ? field.value.toString() : undefined
                        }
                      >
                        <SelectTrigger
                          className={
                            changeManagerForm.formState.errors.leader
                              ? "border-destructive focus:ring-destructive/50"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select a manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {managersQuery.isLoading ? (
                            <SelectItem disabled value="loading">
                              Loading managers...
                            </SelectItem>
                          ) : managersQuery.data?.data.length === 0 ? (
                            <SelectItem disabled value="no-managers">
                              No managers available
                            </SelectItem>
                          ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            managersQuery.data?.data.map((manager: any) => (
                              <SelectItem
                                key={manager.id}
                                value={manager.id.toString()}
                              >
                                {manager.fullname} | {manager.email}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                {/* Cancel and Change Manager buttons */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsChangeManagerOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={changeDepartmentManagerMutation.isPending}
                  className="cursor-pointer"
                >
                  {changeDepartmentManagerMutation.isPending
                    ? "Updating..."
                    : "Change Manager"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentManagerChangeForm;
