import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Get token from Zustand store instead of localStorage
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
      useAuthStore.getState().signOut();
      // Redirect to login if needed
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
