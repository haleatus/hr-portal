/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import {
  useManagerReviewStore,
  usePeerReviewNominationStore,
  useSelfReviewStore,
} from "@/store/review-store";
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
 * Get my team manager reviews (Employee)
 * @param options - Additional options for the query
 * @returns Query result with team manger reviews on employee data
 */
export const useGetMyTeamManagerReviewsOnMe = (options: HookOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isEmployee = false } = options;

  // Fetch my team self reviews
  return useQuery({
    queryKey: ["myTeamManagerReviewsOnMe"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/my/manager/get-all"
      );
      return response.data;
    },
    // Only fetch data if the user is authenticated AND is a manager
    enabled: isAuthenticated && isEmployee,

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

/**
 * useCreateManagerReview hook
 */
export const useCreateManagerReview = () => {
  const setError = useManagerReviewStore((state) => state.setError);
  const setIsLoading = useManagerReviewStore((state) => state.setIsLoading);
  const setReviewee = useManagerReviewStore((state) => state.setReviewee);
  const setDueDate = useManagerReviewStore((state) => state.setDueDate);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: { reviewee: number; dueDate: string }) => {
      const response = await apiClient.post(
        "/hr-hub/user/review/manager/create",
        reviewData
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setReviewee(response.data.reviewee);
      setDueDate(response.data.dueDate);

      // Invalidate query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ["myTeamManagerReviews"],
      });
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || "Failed to create a manager review"
      );
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

/**
 * useSubmitQuestionnaire hook
 */
export const useSubmitQuestionnaire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      questionnaireData,
    }: {
      id: string;
      questionnaireData: any;
    }) => {
      const response = await apiClient.patch(
        `/hr-hub/user/review/submit/${id}`,
        questionnaireData
      );
      return response.data;
    },
    onSuccess: () => {
      // If we don't have an ID in the response, invalidate all review details queries
      queryClient.invalidateQueries({
        queryKey: ["reviewDetails"],
      });
    },
  });
};

/**
 * useUpdateQuestionnaire hook
 */
export const useUpdateQuestionnaire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionnaireData }: { questionnaireData: any }) => {
      const response = await apiClient.patch(
        `/hr-hub/user/review/questionnaire/update`,
        questionnaireData
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Check if we have a valid ID before invalidating queries
      // This assumes you have access to the reviewId from somewhere
      // If not, you might need to pass it as part of the variables
      if (data?.data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["reviewDetails", data.data.id.toString()],
        });
      } else {
        // If we don't have an ID in the response, invalidate all review details queries
        queryClient.invalidateQueries({
          queryKey: ["reviewDetails"],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["myTeamPeerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myPeerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mySelfReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamSelfReviews"],
      });
    },
  });
};

/**
 * useMarkReviewAsComplete hook
 */
export const useMarkReviewAsComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(
        `/hr-hub/user/review/mark-as-complete/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      // If we don't have an ID in the response, invalidate all review details queries
      queryClient.invalidateQueries({
        queryKey: ["reviewDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamPeerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myPeerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamManagerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamManagerReviewsOnMe"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mySelfReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamSelfReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamAcknowledgedReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamUnAcknowledgedReviews"],
      });
    },
  });
};

// Peer Review

/**
 * Get my team peer reviews (Manager only)
 * @param options - Additional options for the query
 * @returns Query result with team peer reviews data
 */
export const useGetMyTeamPeerReviews = (options: HookOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isManager = false } = options;

  // Fetch my team manager reviews
  return useQuery({
    queryKey: ["myTeamPeerReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/my-team/peer/get-all"
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
 * Get my peer reviews (Employee only | Nomeniee)
 * @param options - Additional options for the query
 * @returns Query result with employee peer reviews data
 */
export const useGetMyPeerReviews = (options: HookOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isEmployee = false } = options;

  // Fetch my team manager reviews
  return useQuery({
    queryKey: ["myPeerReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/my/peer/get-all"
      );
      return response.data;
    },
    // Only fetch data if the user is authenticated AND is a manager
    enabled: isAuthenticated && isEmployee,

    // Only retry once if the request fails
    retry: 1,
    // Consider data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * useCreatePeerNomination hook (Manager only)
 */
export const useCreatePeerNomination = () => {
  const setError = usePeerReviewNominationStore((state) => state.setError);
  const setIsLoading = usePeerReviewNominationStore(
    (state) => state.setIsLoading
  );
  const setNominee = usePeerReviewNominationStore((state) => state.setNominee);
  const setReviewee = usePeerReviewNominationStore(
    (state) => state.setReviewee
  );

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: { nominee: number; reviewee: number }) => {
      const response = await apiClient.post(
        "/hr-hub/user/peer-nomination/create",
        reviewData
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setNominee(response.data.nominee);
      setReviewee(response.data.reviewee);

      // Invalidate query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ["myTeamPeerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myPeerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myCreatedPeerNominations"],
      });
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || "Failed to create a peer review"
      );
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

/**
 * Get created peer nominations (Manager only)
 * @param options - Additional options for the query
 * @returns Query result with nominee and reviewee data for that peer review
 */
export const useGetCreatedPeerNominations = (options: HookOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isManager = false } = options;

  // Fetch my team manager reviews
  return useQuery({
    queryKey: ["myCreatedPeerNominations"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/peer-nomination/created/get-all"
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
 * Get my peer nominations requests (Employee only)
 * @param options - Additional options for the query
 * @returns Query result with peer review requests data
 */
export const useGetMyPeerReviewsRequests = (options: HookOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isEmployee = false } = options;

  // Fetch my team manager reviews
  return useQuery({
    queryKey: ["myPeerReviewsRequests"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/peer-nomination/assigned/get"
      );
      return response.data;
    },
    // Only fetch data if the user is authenticated AND is a manager
    enabled: isAuthenticated && isEmployee,

    // Only retry once if the request fails
    retry: 1,
    // Consider data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * useUpdateReviewRequestStatus hook
 */
export const useUpdateReviewRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(
        `/hr-hub/user/peer-nomination/update/${id}`,
        { nominationStatus: status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myPeerReviewsRequests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myPeerReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamPeerReviews"],
      });
    },
  });
};

// -------------- Summary of Review --------------

/**
 * Get my team reviews that are acknowledged (Manager only)
 * @param options - Additional options for the query
 * @returns Query result with team peer reviews data
 */
export const useGetMyTeamAcknowledgedReviewsSummary = (
  options: HookOptions = {}
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isManager = false } = options;

  // Fetch my team manager reviews
  return useQuery({
    queryKey: ["myTeamAcknowledgedReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/summary/my/team/acknowledged/get-all"
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
 * Get my team reviews that are not yet acknowledged (Manager only)
 * @param options - Additional options for the query
 * @returns Query result with team peer reviews data
 */
export const useGetMyTeamUnAcknowledgedReviewsSummary = (
  options: HookOptions = {}
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isManager = false } = options;

  // Fetch my team manager reviews
  return useQuery({
    queryKey: ["myTeamUnAcknowledgedReviews"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/summary/my/team/unacknowledged/get-all"
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
 * Get my recent reviews
 * @param options - Additional options for the query
 * @returns Query result with latest reviews summary data
 */
export const useGetLatestReviewsSummary = (options: HookOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isEmployee = false } = options;

  // Fetch my team manager reviews
  return useQuery({
    queryKey: ["myRecentReviewsSummary"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/hr-hub/user/review/summary/my/get"
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
 * useGetReviewSummaryDetails hook
 */
export const useGetReviewSummaryDetails = (id: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    // Include the id in the query key to make it unique per department
    queryKey: ["reviewSummaryDetails", id],
    queryFn: async () => {
      const response = await apiClient.get(`/hr-hub/review-summary/get/${id}`);
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
 * useAcknowledgeReviewSummary hook
 */
export const useAcknowledgeReviewSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await apiClient.patch(
        `/hr-hub/user/review/summary/acknowledge/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviewSummaryDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myRecentReviewsSummary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamUnAcknowledgedReviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myTeamAcknowledgedReviews"],
      });
    },
  });
};
