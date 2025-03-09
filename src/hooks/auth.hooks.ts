/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

// Import Interfaces
import {
  IAdminAuthResponse,
  ICreateAdminRequest,
  ICreateAdminResponse,
  ICreateUserRequest,
  ICreateUserResponse,
  ISignInCredentials,
  IUserAuthResponse,
} from "@/interfaces/auth.interface";

/**
 * Hook for user sign in
 */
export const useUserSignIn = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setError = useAuthStore((state) => state.setError);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: ISignInCredentials
    ): Promise<IUserAuthResponse> => {
      const response = await apiClient.post(
        "/hr-hub/auth/user/signin",
        credentials
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setUser(response.data.user);
      setToken(response.data.accessToken);
      setIsAuthenticated(true);

      // Set token in localStorage for persistence
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("userRole", response.data.user.role);

      // Also set secure HTTP only cookie (if your backend sets cookies, this isn't needed)
      document.cookie = `token=${response.data.accessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Strict`; // 7 days

      // Invalidate any user-related queries to force a refetch
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to sign in");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

/**
 * Hook for admin sign in
 */
export const useAdminSignIn = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setError = useAuthStore((state) => state.setError);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: ISignInCredentials
    ): Promise<IAdminAuthResponse> => {
      const response = await apiClient.post(
        "/hr-hub/auth/admin/signin",
        credentials
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setUser(response.data.user);
      setToken(response.data.accessToken);
      setIsAuthenticated(true);

      // Store token in local storage or httpOnly cookie for API client
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("userRole", response.data.user.role);

      document.cookie = `token=${response.data.accessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`; // 7 days expiry

      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to sign in");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

/**
 * Hook for admin user creation
 */
export const useCreateAdmin = () => {
  const setError = useAuthStore((state) => state.setError);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      adminData: ICreateAdminRequest
    ): Promise<ICreateAdminResponse> => {
      const response = await apiClient.post("/hr-hub/admin/create", adminData);
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: () => {
      // Invalidate relevant queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to create admin");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

/**
 * Hook for user creation
 */
export const useCreateUser = () => {
  const setError = useAuthStore((state) => state.setError);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      userData: ICreateUserRequest
    ): Promise<ICreateUserResponse> => {
      const response = await apiClient.post(
        "/hr-hub/auth/admin/user/signup",
        userData
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to create user");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

/**
 * Hook for signing out
 */
export const useSignOut = () => {
  const signOut = useAuthStore((state) => state.signOut);
  const queryClient = useQueryClient();

  return () => {
    signOut();
    // Remove all cached queries when signing out
    queryClient.clear();
  };
};
