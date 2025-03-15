/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { useSelfReviewStore } from "@/store/review-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook options with isManager flag
 */
interface HookOptions {
  isManager?: boolean;
  isEmployee?: boolean;
}

/**
 * Get my self reviews (Employee and Manager only)
 * @param options - Additional options for the query
 * @returns Query result with self reviews data
 */
export const useGetMySelfReviews = (options: HookOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isEmployee = false } = options;

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
    enabled: isAuthenticated && isEmployee,
    // Only retry once if the request fails
    retry: 1,
    // Consider data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get my team self reviews (Manager only)
 * @param options - Additional options for the query
 * @returns Query result with team self reviews data
 */
export const useGetMyTeamSelfReviews = (options: HookOptions = {}) => {
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
export const useGetMyTeamManagerReviews = (options: HookOptions = {}) => {
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

/**
 * useCreateSelfReview hook
 */
export const useCreateSelfReview = () => {
  const setError = useSelfReviewStore((state) => state.setError);
  const setIsLoading = useSelfReviewStore((state) => state.setIsLoading);
  const setSubject = useSelfReviewStore((state) => state.setSubject);
  const setDescription = useSelfReviewStore((state) => state.setDescription);
  const setDueDate = useSelfReviewStore((state) => state.setDueDate);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: any) => {
      const response = await apiClient.post(
        "/hr-hub/user/review/self/create",
        reviewData
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setSubject(response.data.subject);
      setDescription(response.data.description);
      setDueDate(response.data.dueDate);

      // Invalidate query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ["myTeamManagerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamSelfReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mySelfReviews"],
      });
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || "Failed to create a self review"
      );
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};
