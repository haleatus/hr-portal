/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import {
  IAdminDetailsUpdate,
  IAdminUpdateResponse,
} from "@/interfaces/admin.interface";
import {
  useAdminDetailUpdateStore,
  useCreateDepartmentStore,
} from "@/store/admin-store";

/**
 * Custom hook that fetches all admins with pagination
 */
export const useGetAllAdmins = (page: number, limit: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["allAdmins", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/hr-hub/admin/get-all?page=${page}&limit=${limit}`
      );
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
 * Custom hook that fetches all users in admin section with pagination
 */
export const useGetAllUsersViaAdmin = (page: number, limit: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["allUsersViaAdmin", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/hr-hub/admin/user/get-all?page=${page}&limit=${limit}`
      );
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

export const useUpdateAdminDetails = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setError = useAdminDetailUpdateStore((state) => state.setError);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number; // Admin ID
      data: IAdminDetailsUpdate;
    }): Promise<IAdminUpdateResponse> => {
      const response = await apiClient.patch(
        `/hr-hub/admin/update/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Update the auth store with the new user data
      setUser(response.data);

      // Invalidate specific admin query to refetch that admin's data
      queryClient.invalidateQueries({
        queryKey: ["admin", variables.id],
      });

      // Invalidate the allAdmins query to refresh the admin list
      queryClient.invalidateQueries({
        queryKey: ["allAdmins"],
      });

      // Update cached admin data directly to prevent UI flicker
      queryClient.setQueryData(["admin", variables.id], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            ...response.data,
          };
        }
        return undefined;
      });
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || "Failed to update admin details"
      );
    },
  });
};

/**
 * useGetAllDepartments hook
 */
export const useGetAllDepartments = (page: number, limit: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["allDepartments", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/hr-hub/admin/team/get-all?page=${page}&limit=${limit}`
      );
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
 * useCreateDepartment hook
 */
export const useCreateDepartment = () => {
  const setError = useCreateDepartmentStore((state) => state.setError);
  const setIsLoading = useCreateDepartmentStore((state) => state.setIsLoading);
  const setDepartment = useCreateDepartmentStore(
    (state) => state.setDepartment
  );
  const setLeader = useCreateDepartmentStore((state) => state.setLeader);
  const setMembers = useCreateDepartmentStore((state) => state.setMembers);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (departmentData: any) => {
      const response = await apiClient.post(
        "/hr-hub/admin/team/create",
        departmentData
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setDepartment(response.data.department);
      setLeader(response.data.leader);
      setMembers(response.data.members);

      // Invalidate allDepartments query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ["allDepartments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allNonTeamEmployeesViaAdmin"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allNonTeamManagersViaAdmin"],
      });
      // // This will invalidate ALL departmentDetails queries regardless of their ID
      // queryClient.invalidateQueries({
      //   queryKey: ["departmentDetails"],
      //   exact: false,
      // });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to create department");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

/**
 * useGetAllEmployees hook
 */
export const useGetAllEmployees = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["allEmployeesViaAdmin"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/hr-hub/admin/user/employee/get-all`
      );
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
 * useGetAllEmployees hook
 */
export const useGetAllNonTeamEmployees = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["allNonTeamEmployeesViaAdmin"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/hr-hub/admin/user/employee/non-team/get-all`
      );
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
 * useGetAllManagers hook
 */
export const useGetAllManagers = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["allManagersViaAdmin"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/hr-hub/admin/user/manager/get-all`
      );
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
 * useGetAllManagers hook
 */
export const useGetAllNonTeamManagers = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["allNonTeamManagersViaAdmin"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/hr-hub/admin/user/manager/non-team/get-all`
      );
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
