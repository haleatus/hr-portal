/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userRole: string | null;

  setUser: (user: any) => void;
  setToken: (token: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  signOut: () => void;
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
      userRole: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      signOut: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        document.cookie = "token=; path=/; max-age=0"; // Clear the cookie
        set({
          token: null,
          userRole: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage),
      // Only persist these specific properties
      partialize: (state) => ({
        token: state.token,
        userRole: state.user?.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
