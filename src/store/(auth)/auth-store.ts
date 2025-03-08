/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "@/lib/api/services/auth.service";

// Import Interfaces
import { ISignInCredentials } from "@/interfaces/auth.interface";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  signIn: (credentials: ISignInCredentials) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (credentials: ISignInCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signIn(credentials);

          set({
            user: response.data.user,
            token: response.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store token in local storage or httpOnly cookie for API client
          localStorage.setItem("token", response.data.accessToken);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to sign in",
          });
        }
      },

      signOut: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
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
