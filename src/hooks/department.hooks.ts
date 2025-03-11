import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

/**
 * useGetAllManagers hook
 */
export const useGetDepartmentDetails = (id: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    // Include the id in the query key to make it unique per department
    queryKey: ["departmentDetails", id],
    queryFn: async () => {
      const response = await apiClient.get(`/hr-hub/team/get/${id}`);
      return response.data;
    },
    // Don't run this query if the user isn't authenticated
    enabled: isAuthenticated,
    // Only retry once if the request fails
    retry: 1,
    // Consider data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};
