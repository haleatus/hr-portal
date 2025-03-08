import apiClient from "../client";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export const authService = {
  signIn: async (credentials: SignInCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post(
      "/hr-hub/auth/admin/signin",
      credentials
    );
    return response.data;
  },

  // Add other auth-related endpoints (signup, logout, etc.)
};
