/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

import { IUser, IUserResponse } from "@/interfaces/user.interface";
import { userService } from "@/lib/axios/api/services/user.service";

/**
 * User store state
 */
interface UserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;

  fetchMeUser: () => Promise<IUserResponse>;
}

/**
 * User store to manage user state
 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchMeUser: async (): Promise<IUserResponse> => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getMeUser();
      set({ user: response.data, isLoading: false });
      return response;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch users",
      });
      throw error;
    }
  },
}));
