/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../client";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth/auth-store";

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

// User Sign In Hook
export const useUserSignIn = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setError = useAuthStore((state) => state.setError);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

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

      // Store token in local storage or httpOnly cookie for API client
      localStorage.setItem("token", response.data.accessToken);
      document.cookie = `token=${response.data.accessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`; // 7 days expiry
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to sign in");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

// Admin Sign In Hook
export const useAdminSignIn = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setError = useAuthStore((state) => state.setError);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

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
      document.cookie = `token=${response.data.accessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`; // 7 days expiry
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to sign in");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

// Create Admin Hook
export const useCreateAdmin = () => {
  const setError = useAuthStore((state) => state.setError);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

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
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to create admin");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};

// Create User Hook
export const useCreateUser = () => {
  const setError = useAuthStore((state) => state.setError);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

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
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to create user");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
};
