"use client";

import { useState, useCallback, useMemo } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/interfaces/user.interface";
import { useUpdateReviewRequestStatus } from "@/hooks/reviews.hooks";
import { toast } from "sonner";

type TCreatePeerNominations = {
  createdAt: string;
  id: number;
  nominationStatus: string;
  nominator: IUser;
  nominee: IUser;
  reviewee: IUser;
  updatedAt: string;
};

type TCreatePeer = {
  data: TCreatePeerNominations | TCreatePeerNominations[]; // Could be single object or array
  error?: object;
  message: string;
  statusCode: number;
  timestamp: string;
};

export function PeerReviewsRequestLists({
  requests,
  userRole,
}: {
  requests: TCreatePeer;
  userRole: string;
}) {
  // States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [nominatorFilter, setNominatorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Hooks
  const updateReviewRequestStatus = useUpdateReviewRequestStatus();

  // Process and memoize the data
  const reviewData = useMemo(() => {
    if (!requests || !requests.data) return [];

    // Handle both single object and array cases
    return Array.isArray(requests.data) ? requests.data : [requests.data];
  }, [requests]);

  // Handle status update
  const handleStatusUpdate = useCallback(
    (id: number, status: string) => {
      updateReviewRequestStatus.mutate(
        { id: id.toString(), status },
        {
          onSuccess: () => {
            if (status !== "PENDING") {
              toast.success(`Review request status updated to ${status}`);
            }
          },
          onError: () => {
            toast.error("Failed to update review request status");
          },
        }
      );
    },
    [updateReviewRequestStatus]
  );

  // Define columns using useMemo to prevent recreation
  const columns = useMemo<ColumnDef<TCreatePeerNominations>[]>(
    () => [
      {
        accessorKey: "nominationStatus",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("nominationStatus") as string;
          return (
            <Badge
              variant={
                status === "COMPLETED"
                  ? "default"
                  : status === "PENDING"
                  ? "pending"
                  : status === "ACCEPTED"
                  ? "approved"
                  : "destructive"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "nominator",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Nominator
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.nominator?.fullname || "N/A"}
          </div>
        ),
        accessorFn: (row) => row.nominator?.fullname || "N/A",
      },
      {
        accessorKey: "nominee",
        header: "Nominee",
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.nominee?.fullname || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "reviewee",
        header: "Reviewee",
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.reviewee?.fullname || "N/A"}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const reviewId = row.original.id;
          const status = row.original.nominationStatus;
          const isPending = status === "PENDING";

          return (
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {isPending && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(reviewId, "ACCEPTED")}
                      >
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(reviewId, "DECLINED")}
                      >
                        Decline
                      </DropdownMenuItem>
                    </>
                  )}
                  {(userRole === "ADMIN" ||
                    userRole === "SUPER_ADMIN" ||
                    userRole === "MANAGER") && (
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [handleStatusUpdate, userRole]
  );

  // Filter the data manually instead of relying on the table's filtering
  const filteredData = useMemo(() => {
    return reviewData.filter((row) => {
      // Status filter
      if (statusFilter !== "all" && row.nominationStatus !== statusFilter) {
        return false;
      }

      // Nominator filter
      if (nominatorFilter && nominatorFilter.trim() !== "") {
        const nominatorName = row.nominator?.fullname || "";
        if (
          !nominatorName.toLowerCase().includes(nominatorFilter.toLowerCase())
        ) {
          return false;
        }
      }

      return true;
    });
  }, [reviewData, statusFilter, nominatorFilter]);

  // Initialize the table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true, // We're handling filtering manually
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter nominators..."
          value={nominatorFilter}
          onChange={(e) => setNominatorFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} results
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
