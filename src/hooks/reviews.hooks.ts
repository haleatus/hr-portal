import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

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
 * Get my team self reviews (Manager only)
 */
export const useGetMyTeamSelfReviews = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch my team self reviews
  return useQuery({
    queryKey: ["myTeamSelfReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/my-team/self/get-all"
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
 * Get my team manager reviews (Manager only)
 */
export const useGetMyTeamManagerReviews = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch my team self reviews
  return useQuery({
    queryKey: ["myTeamManagerReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/my-team/manager/get-all"
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
