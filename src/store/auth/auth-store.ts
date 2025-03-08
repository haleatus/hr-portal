/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "@/lib/axios/api/services/auth.service";

// Import Interfaces
import {
  ICreateAdminRequest,
  ICreateUserRequest,
  ISignInCredentials,
} from "@/interfaces/auth.interface";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  userSignIn: (credentials: ISignInCredentials) => Promise<void>;
  adminSignIn: (credentials: ISignInCredentials) => Promise<void>;
  signOut: () => void;
  createAdmin: (adminData: ICreateAdminRequest) => Promise<any>;
  createUser: (userData: ICreateUserRequest) => Promise<any>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      userSignIn: async (credentials: ISignInCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.userSignIn(credentials);

          set({
            user: response.data.user,
            token: response.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store token in local storage or httpOnly cookie for API client
          localStorage.setItem("token", response.data.accessToken); // Add this after setting localStorage
          document.cookie = `token=${
            response.data.accessToken
          }; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days expiry
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to sign in",
          });
          // throw error;
        }
      },

      adminSignIn: async (credentials: ISignInCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.adminSignIn(credentials);

          set({
            user: response.data.user,
            token: response.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store token in local storage or httpOnly cookie for API client
          localStorage.setItem("token", response.data.accessToken); // Add this after setting localStorage
          document.cookie = `token=${
            response.data.accessToken
          }; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days expiry
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to sign in",
          });
          // throw error;
        }
      },

      signOut: () => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0"; // Clear the cookie
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      createAdmin: async (adminData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.createAdmin(adminData);
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to create admin",
          });
          throw error; // Propagate the original error with response data
        }
      },

      createUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.createUser(userData);
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to create user",
          });
          throw error; // Propagate the original error with response data
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage),
      // Only persist these specific properties
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
