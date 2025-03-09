import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/api/client";

/**
 * Custom hook that fetches the current user's profile data
 *
 * @returns {Object} Query object containing data, loading state, and error information
 */
export const useGetCurrentUser = () => {
  return useQuery({
    // Unique query key for this data
    queryKey: ["currentUser"],

    // The actual fetch function that returns a promise
    queryFn: async () => {
      const response = await apiClient.get("/hr-hub/auth/user/me");
      return response.data;
    },

    // Additional options
    retry: 1, // Only retry once if the request fails
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

/**
 * Additional user-related queries and mutations can be added here
 * For example:
 *
 * export const useUpdateUserProfile = () => {
 *   return useMutation({
 *     mutationFn: async (userData) => {
 *       const response = await apiClient.put("/hr-hub/auth/user/profile", userData);
 *       return response.data;
 *     },
 *     // Add other options like onSuccess, onError, etc.
 *   });
 * }
 */
