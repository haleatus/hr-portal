"use client";

// Core React imports
import { useState } from "react";

// Core TanStack imports
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Interfaces imports
import { IUser } from "@/interfaces/user.interface";

// Types
type TCreatePeerNominations = {
  createdAt: string;
  id: string;
  nominationStatus: string;
  nominator: IUser;
  nominee: IUser;
  reviewee: IUser;
  updatedAt: string;
};

type TCreatePeer = {
  data: TCreatePeerNominations[];
  error?: object;
  message: string;
  statusCode: number;
  timestamp: string;
};

/**
 * CreatedNominationsList component
 * @param {TCreatePeer} nominations
 * @param {string} userRole
 * @returns {JSX.Element}
 */
export function CreatedNominationsList({
  nominations,
  userRole,
}: {
  nominations: TCreatePeer;
  userRole: string;
}) {
  // State variables
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Columns definition
  const columns: ColumnDef<TCreatePeerNominations>[] = [
    {
      accessorKey: "nominationStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("nominationStatus") as string;
        return (
          <Badge
            variant={
              status === "ACCEPTED"
                ? "approved"
                : status === "PENDING"
                ? "pending"
                : status === "COMPLETED"
                ? "outline"
                : "red"
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
        <div className="font-medium">{row.original.nominator.fullname}</div>
      ),
    },
    {
      accessorKey: "nominee",
      header: "Nominee",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.nominee.fullname}</div>
      ),
    },
    {
      accessorKey: "reviewee",
      header: "Reviewee",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.reviewee.fullname}</div>
      ),
    },
    {
      id: "actions",
      cell: () => {
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
              {(userRole === "ADMIN" ||
                userRole === "SUPER_ADMIN" ||
                userRole === "MANAGER") && (
                <DropdownMenuItem>Delete</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);

    if (value === "all") {
      table.getColumn("nominationStatus")?.setFilterValue(undefined);
    } else {
      table.getColumn("nominationStatus")?.setFilterValue(value);
    }
  };

  // React Table instance
  const table = useReactTable({
    data: nominations.data,
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
    },
  });

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
        <Select
          value={statusFilter || "all"}
          onValueChange={handleStatusChange}
        >
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
