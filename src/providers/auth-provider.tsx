/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Indicates that this is a Client Component in Next.js

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store"; // Zustand store for authentication state
import { IUser } from "@/interfaces/user.interface"; // Interface for user data
import apiClient from "@/lib/api/client"; // API client for making HTTP requests

// Define the shape of the authentication context
type AuthContextType = {
  isAuthenticated: boolean; // Whether the user is authenticated
  user: IUser | null; // User data or null if not authenticated
  loading: boolean; // Loading state while fetching user data
};

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
});

// Custom hook to easily access the authentication context
export const useAuth = () => useContext(AuthContext);

import { useRef } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true); // Track initial mount

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  useEffect(() => {
    const fetchUser = async () => {
      const userRole =
        typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

      const endpoint =
        userRole === "ADMIN" ? "/hr-hub/auth/admin/me" : "/hr-hub/auth/user/me";

      try {
        const response = await apiClient.get(endpoint);
        const userData = response.data.data;

        setUser(userData);
        setIsAuthenticated(true);

        if (!useAuthStore.getState().token) {
          setToken(response.data.accessToken);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setToken("");
      } finally {
        setLoading(false);
      }
    };

    if (isInitialMount.current) {
      // Only run on initial mount
      if (isAuthenticated || localStorage.getItem("token")) {
        fetchUser();
      } else {
        setLoading(false);
      }
      isInitialMount.current = false; // Mark initial mount as complete
    }
  }, [isAuthenticated, setUser, setToken, setIsAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
