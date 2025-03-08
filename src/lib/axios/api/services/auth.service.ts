import apiClient from "../client";

// Import Interfaces
import {
  IAuthResponse,
  ICreateAdminRequest,
  ICreateAdminResponse,
  ICreateUserRequest,
  ICreateUserResponse,
  ISignInCredentials,
} from "@/interfaces/auth.interface";

export const authService = {
  signIn: async (credentials: ISignInCredentials): Promise<IAuthResponse> => {
    const response = await apiClient.post(
      "/hr-hub/auth/admin/signin",
      credentials
    );
    return response.data;
  },

  createAdmin: async (
    adminData: ICreateAdminRequest
  ): Promise<ICreateAdminResponse> => {
    const response = await apiClient.post("/hr-hub/admin/create", adminData);
    return response.data;
  },

  createUser: async (
    userData: ICreateUserRequest
  ): Promise<ICreateUserResponse> => {
    const response = await apiClient.post(
      "/hr-hub/auth/admin/user/signup",
      userData
    );
    return response.data;
  },
};
