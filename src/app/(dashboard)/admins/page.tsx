"use client";

// Hooks
import { useState } from "react";
import { useGetAllAdmins } from "@/hooks/admin.hooks";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { IAdmin } from "@/interfaces/admin.interface";

export default function AdminsPage() {
  const [page, setPage] = useState(1);
  const limit = 5;

  // Get current user data from the hook
  const { data: adminsData, isLoading, isError } = useGetAllAdmins(page, limit);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-xl font-semibold text-destructive">
          Error loading profile
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const { data: admins, meta } = adminsData;

  const handleNextPage = () => {
    if (page < meta.total_pages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admins</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.map((admin: IAdmin) => (
          <Card key={admin.id}>
            <CardHeader>
              <CardTitle>{admin.name}</CardTitle>
              <CardDescription>{admin.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Role: {admin.role}</p>
              <p>
                Created At: {new Date(admin.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePreviousPage}>
              <Button disabled={page === 1}>Previous</Button>
            </PaginationPrevious>
          </PaginationItem>
          {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => setPage(pageNumber)}
                  isActive={pageNumber === page}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <Button
              onClick={handleNextPage}
              disabled={page === meta.total_pages}
            >
              <PaginationNext />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
