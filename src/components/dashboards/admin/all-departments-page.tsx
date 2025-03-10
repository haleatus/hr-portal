"use client";

// Core React imports
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Hook imports
import { useGetAllDepartments } from "@/hooks/admin.hooks";

// UI imports
import { Search, UserCog, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Interface imports
import { IDepartment } from "@/interfaces/department.interface";

/**
 * DepartmentsComponents component
 * @returns JSX.Element - List for all departments
 */
const DepartmentsComponents = () => {
  // Get router and search params
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for page and search query
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 6;

  // Sync page state with URL query parameter
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(Number(pageParam));
    }
  }, [searchParams]);

  // Get departments data from the hook
  const {
    data: departmentsData,
    isError,
    isLoading,
  } = useGetAllDepartments(page, limit);

  // Error state
  if (isError) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <div className="text-xl font-semibold text-destructive">
          Error loading departments data
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // If data is still loading or not available, return null (loading.tsx will handle the loading state)
  if (isLoading || !departmentsData) {
    return null;
  }

  // Destructure departments data
  const { data: departments, meta } = departmentsData;

  // Filter departments based on search query
  const filteredDepartments = departments.filter((department: IDepartment) =>
    department.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update URL when page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`/departments?page=${newPage}`);
  };

  // Function to handle next page
  const handleNextPage = () => {
    if (page < meta.total_pages) {
      handlePageChange(page + 1);
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  // Function to generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (meta.total_pages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= meta.total_pages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={i === page}
              className="cursor-pointer select-none"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={1 === page}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is more than 3
      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(meta.total_pages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={i === page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is less than total_pages - 2
      if (page < meta.total_pages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (meta.total_pages > 1) {
        items.push(
          <PaginationItem key={meta.total_pages}>
            <PaginationLink
              onClick={() => handlePageChange(meta.total_pages)}
              isActive={meta.total_pages === page}
            >
              {meta.total_pages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">
          View all the departments in the organization
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search departments..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            router.push("/create-departments");
          }}
          className="w-full sm:w-auto cursor-pointer"
        >
          <UserCog className="mr-2 h-4 w-4" />
          Add New Department
        </Button>
      </div>

      {filteredDepartments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <UserCog className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No departments found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((department: IDepartment) => (
            <Card
              key={department.id}
              className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
              onClick={() => router.push(`/departments/${department.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="mt-2 text-xl">
                  {department.department}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>
                    Created{" "}
                    {new Date(department.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {meta.total_pages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer select-none"
                  }
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={
                    page === meta.total_pages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer select-none"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Showing {filteredDepartments.length} of {meta.total} departments
      </div>
    </div>
  );
};

export default DepartmentsComponents;
