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

// hooks imports
import { useDeleteDepartment } from "@/hooks/department.hooks";
import { useRouter } from "next/navigation";

// Sonner toast import
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";

/**
 * DepartmentDeletionDialog component
 * @returns {JSX.Element} JSX Element - Confirmation dialog for department deletion
 */
const DepartmentDeletionDialog = ({
  departmentId,
}: {
  departmentId: string;
}) => {
  // Router instance
  const router = useRouter();
  // State variables
  const [isConfirmDeletionDepartmentOpen, setIsComfirmDeletionDepartmentOpen] =
    useState(false);

  // Mutation hooks for deleting department
  const deleteDepartmentMutation = useDeleteDepartment();
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Delete button */}
            <button
              className="p-1 rounded-md hover:bg-destructive/10 text-destructive hover:text-destructive/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the card click event from firing
                setIsComfirmDeletionDepartmentOpen(true);
              }}
              aria-label="Delete department"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Department</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Delete department dialog */}
      <Dialog
        open={isConfirmDeletionDepartmentOpen}
        onOpenChange={setIsComfirmDeletionDepartmentOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsComfirmDeletionDepartmentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (departmentId) {
                  deleteDepartmentMutation.mutate(departmentId, {
                    onSuccess: () => {
                      setIsComfirmDeletionDepartmentOpen(false);
                      router.push("/departments");
                      toast.success("Department deleted successfully.");
                    },
                    onError: (error) => {
                      toast.error(
                        error.message || "Failed to delete department."
                      );
                    },
                  });
                }
              }}
              disabled={deleteDepartmentMutation.isPending}
              className="text-white"
            >
              {deleteDepartmentMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentDeletionDialog;
