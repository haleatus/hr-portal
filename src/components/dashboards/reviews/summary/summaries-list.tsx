"use client";

// Core React imports
import { useState } from "react";

// Core TanStack imports
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Core Lucide imports
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// UI Components imports
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
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
interface IUser {
  id: number;
  createdAt: string;
  updatedAt: string;
  fullname: string;
  email: string;
  role: string;
}

interface Feedback {
  answers: string[];
  ratings: number;
}

interface SummaryQuestion {
  question: string;
  managerFeedback: Feedback;
  revieweeFeedback: Feedback;
}

type TReviewSummary = {
  id: number;
  createdAt: string;
  updatedAt: string;
  summaryQuestionnaire: SummaryQuestion[];
  averagePerformanceRating: string;
  isAcknowledged: boolean;
  reviewee: IUser;
};

type TReviewSummaryResponse = {
  data: TReviewSummary[];
  error?: object;
  message: string;
  statusCode: number;
  meta: {
    limit: number;
    total: number;
    page_total: number;
    total_pages: number;
    next: number | null;
    page: number;
    previous: number | null;
  };
};

/**
 * SummarriesList component
 * @param {TReviewSummaryResponse} summarries
 * @param {string} userRole
 * @returns {JSX.Element}
 */
export default function SummarriesList({
  summarries,
}: {
  summarries: TReviewSummaryResponse;
}) {
  const router = useRouter();

  // State variables
  const [sorting, setSorting] = useState<SortingState>([]);

  // Ensure summarries data exists
  const summariesData = summarries?.data || [];

  // Columns definition
  const columns: ColumnDef<TReviewSummary>[] = [
    {
      accessorKey: "reviewee",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Employee
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.original.reviewee.fullname}</div>
      ),
      filterFn: (row, id, value) => {
        return row.original.reviewee.fullname
          .toLowerCase()
          .includes(value.toLowerCase());
      },
    },
    {
      accessorKey: "averagePerformanceRating",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Average Performance Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const rating = parseFloat(row.original.averagePerformanceRating);
        return <div className="font-medium">{rating.toFixed(2)} / 5</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <div className="font-medium">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/reviews/summary/${row.original.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // React Table instance
  const table = useReactTable({
    data: summariesData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  // If summarries data is not provided or empty
  if (!summarries || !summarries.data) {
    return <div className="p-8 text-center">No summary data available.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by employee name..."
          value={
            (table.getColumn("reviewee")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("reviewee")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                  onClick={() => {
                    // Optional: Navigate to details page on row click
                    router.push(`/reviews/summary/${row.original.id}`);
                  }}
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
                  No review summaries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of{" "}
          {summariesData.length} results
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
