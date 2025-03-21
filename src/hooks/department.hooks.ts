/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IDepartmentManagerChange,
  IDepartmentNameUpdate,
  IDepartmentUpdateResponse,
} from "@/interfaces/department.interface";
import apiClient from "@/lib/api/client";
import { useCreateDepartmentStore } from "@/store/admin-store";
import { useAuthStore } from "@/store/auth-store";
import {
  useAddDepartmentMembersStore,
  useDepartmentManagerChangeStore,
  useDepartmentNameUpdateStore,
} from "@/store/department-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
 * useUpdateDepartmentName hook
 */
export const useUpdateDepartmentName = () => {
  const setDepartment = useCreateDepartmentStore(
    (state) => state.setDepartment
  );
  const setError = useDepartmentNameUpdateStore((state) => state.setError);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number; // Admin ID
      data: IDepartmentNameUpdate;
    }): Promise<IDepartmentUpdateResponse> => {
      const response = await apiClient.patch(
        `/hr-hub/admin/team/update/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Update the auth store with the new user data
      setDepartment(response.data.department);

      queryClient.invalidateQueries({
        queryKey: ["departmentDetails", variables.id.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["allDepartments"],
      });

      // Update cached admin data directly to prevent UI flicker
      queryClient.setQueryData(
        ["departmentDetails", variables.id],
        (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              ...response.data,
            };
          }
          return undefined;
        }
      );
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || "Failed to update admin details"
      );
    },
  });
};

/**
 * useUpdateDepartmentName hook
 */
export const useChangeDepartmentManager = () => {
  const setLeader = useCreateDepartmentStore((state) => state.setLeader);
  const setError = useDepartmentManagerChangeStore((state) => state.setError);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number; // Admin ID
      data: IDepartmentManagerChange;
    }): Promise<IDepartmentUpdateResponse> => {
      const response = await apiClient.patch(
        `/hr-hub/admin/team/update/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Update the auth store with the new user data
      setLeader(response.data.leader.id);

      queryClient.invalidateQueries({
        queryKey: ["departmentDetails", variables.id.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["allDepartments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allNonTeamManagersViaAdmin"],
      });

      // Update cached admin data directly to prevent UI flicker
      queryClient.setQueryData(
        ["departmentDetails", variables.id],
        (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              ...response.data,
            };
          }
          return undefined;
        }
      );
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || "Failed to update admin details"
      );
    },
  });
};

/**
 * useDeleteDepartmentMember hook
 */
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(
        `/hr-hub/admin/team/delete/${id}`
      );
      return response.data;
    },
    onSuccess: (id) => {
      // // This will invalidate ALL departmentDetails queries regardless of their ID
      // queryClient.invalidateQueries({
      //   queryKey: ["departmentDetails"],
      //   exact: false,
      // });
      queryClient.invalidateQueries({
        queryKey: ["departmentDetails", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["allDepartments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allNonTeamManagersViaAdmin"],
      });
    },
  });
};

/**
 * useDeleteDepartmentMember hook
 */
export const useDeleteDepartmentMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(
        `/hr-hub/admin/team/member/delete/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      // // This will invalidate ALL departmentDetails queries regardless of their ID
      queryClient.invalidateQueries({
        queryKey: ["departmentDetails"],
        exact: false,
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["departmentDetails", id],
      // });
      queryClient.invalidateQueries({
        queryKey: ["allDepartments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allNonTeamEmployeesViaAdmin"],
      });
    },
  });
};

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

/**
 * useAddDepartmentMembers hook
 */
export const useAddDepartmentMembers = () => {
  const setError = useAddDepartmentMembersStore((state) => state.setError);
  const setIsLoading = useAddDepartmentMembersStore(
    (state) => state.setIsLoading
  );

  const setMembers = useAddDepartmentMembersStore((state) => state.setMembers);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addedMembersData: any) => {
      const response = await apiClient.post(
        "/hr-hub/admin/team/member/create",
        addedMembersData
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setMembers(response.data.members);

      // Invalidate allDepartments query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ["allDepartments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["departmentDetails"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["allNonTeamEmployeesViaAdmin"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allNonTeamManagersViaAdmin"],
      });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to add members");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

/**
 * useGetMyDepartment hook
 */
export const useGetMyDepartment = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    // Include the id in the query key to make it unique per department
    queryKey: ["myDepartment"],
    queryFn: async () => {
      const response = await apiClient.get(`/hr-hub/user/team/get-my-team`);
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
