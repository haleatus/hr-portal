/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { IUser, IUserResponse } from "@/interfaces/user.interface";
import { userService } from "@/lib/axios/api/services/user.service";

/**
 * Time constants for cache invalidation (in milliseconds)
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * User store state with caching
 */
interface UserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchMeUser: (forceRefresh?: boolean) => Promise<IUserResponse>;
  invalidateCache: () => void;
}

/**
 * User store to manage user state with caching mechanism
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      lastFetched: null,

      fetchMeUser: async (forceRefresh = false): Promise<IUserResponse> => {
        const state = get();
        const now = Date.now();

        // Skip fetch if we have cached data that's still fresh and not forcing refresh
        if (
          !forceRefresh &&
          state.user &&
          state.lastFetched &&
          now - state.lastFetched < CACHE_DURATION
        ) {
          // Return the cached data without making an API call
          // We need to properly cast this to match IUserResponse
          return await Promise.resolve({
            data: state.user,
            statusCode: 200,
            message: "Data loaded from cache",
            timestamp: new Date().toISOString(),
          } as IUserResponse);
        }

        set({ isLoading: true, error: null });
        try {
          const response = await userService.getMeUser();
          set({
            user: response.data,
            isLoading: false,
            lastFetched: Date.now(),
          });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to fetch users",
          });
          throw error;
        }
      },

      invalidateCache: () => {
        set({ lastFetched: null });
      },
    }),
    {
      name: "user-storage", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        lastFetched: state.lastFetched,
      }), // only store these fields
    }
  )
);
