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
