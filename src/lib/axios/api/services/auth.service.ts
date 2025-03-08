import apiClient from "../client";

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

export const authService = {
  adminSignIn: async (
    credentials: ISignInCredentials
  ): Promise<IAdminAuthResponse> => {
    const response = await apiClient.post(
      "/hr-hub/auth/admin/signin",
      credentials
    );
    return response.data;
  },

  userSignIn: async (
    credentials: ISignInCredentials
  ): Promise<IUserAuthResponse> => {
    const response = await apiClient.post(
      "/hr-hub/auth/user/signin",
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
