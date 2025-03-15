import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook options with isManager flag
 */
interface ManagerHookOptions {
  isManager?: boolean;
}

/**
 * Get my self reviews
 */
export const useGetMySelfReviews = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch my self reviews
  return useQuery({
    queryKey: ["mySelfReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/my/self/get-all"
      );
      return response.data;
    },
    // Only fetch data if the user is authenticated
    enabled: isAuthenticated,
    // Only retry once if the request fails
    retry: 1,
    // Consider data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook options with isManager flag
 */
interface ManagerHookOptions {
  isManager?: boolean;
}

/**
 * Get my team self reviews (Manager only)
 * @param options - Additional options for the query
 * @returns Query result with team self reviews data
 */
export const useGetMyTeamSelfReviews = (options: ManagerHookOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isManager = false } = options;

  // Fetch my team self reviews
  return useQuery({
    queryKey: ["myTeamSelfReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/my-team/self/get-all"
      );
      return response.data;
    },
    // Only fetch data if the user is authenticated AND is a manager
    enabled: isAuthenticated && isManager,

    // Only retry once if the request fails
    retry: 1,
    // Consider data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get my team manager reviews (Manager only)
 * @param options - Additional options for the query
 * @returns Query result with team manager reviews data
 */
export const useGetMyTeamManagerReviews = (
  options: ManagerHookOptions = {}
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isManager = false } = options;

  // Fetch my team manager reviews
  return useQuery({
    queryKey: ["myTeamManagerReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/my-team/manager/get-all"
      );
      return response.data;
    },
    // Only fetch data if the user is authenticated AND is a manager
    enabled: isAuthenticated && isManager,

    // Only retry once if the request fails
    retry: 1,
    // Consider data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * useGetReviewDetails hook
 */
export const useGetReviewDetails = (id: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    // Include the id in the query key to make it unique per department
    queryKey: ["reviewDetails", id],
    queryFn: async () => {
      const response = await apiClient.get(`/hr-hub/review/get/${id}`);
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
