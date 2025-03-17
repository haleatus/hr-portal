"use client";

import { useState, useEffect } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Check, X } from "lucide-react";
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
  data: TCreatePeerNominations; // Single object, not an array
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
  // Handle single object data instead of an array
  const hasValidData = requests && requests.data;

  // Convert single object to array if it exists
  const reviewData = hasValidData ? [requests.data] : [];

  const updateReviewRequestStatus = useUpdateReviewRequestStatus();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleStatusUpdate = (id: number, status: string) => {
    updateReviewRequestStatus.mutate(
      { id: id.toString(), status },
      {
        onSuccess: () => {
          toast.success(`Review request status updated to ${status}`);
        },
        onError: () => {
          toast.error("Failed to update review request status");
        },
      }
    );
  };

  const columns: ColumnDef<TCreatePeerNominations>[] = [
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
                ? "secondary"
                : status === "ACCEPTED"
                ? "outline"
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            {isPending && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-green-500"
                  onClick={() => handleStatusUpdate(reviewId, "ACCEPTED")}
                  title="Accept"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500"
                  onClick={() => handleStatusUpdate(reviewId, "DECLINED")}
                  title="Decline"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
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
  ];

  const table = useReactTable({
    data: reviewData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
  });

  // Use useEffect to apply the status filter when the table or statusFilter changes
  useEffect(() => {
    if (statusFilter === "all") {
      table.getColumn("nominationStatus")?.setFilterValue(undefined);
    } else {
      table.getColumn("nominationStatus")?.setFilterValue(statusFilter);
    }
  }, [table, statusFilter]);

  // Move this function after table is defined
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter nominators..."
          value={
            (table.getColumn("nominator")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("nominator")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
          Showing {table.getFilteredRowModel().rows.length} results
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
