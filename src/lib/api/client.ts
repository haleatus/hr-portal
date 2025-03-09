import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Get token from Zustand store
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth state on 401
      useAuthStore.getState().signOut();

      // Only redirect to login if we're in a browser environment
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
