/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, SignInCredentials } from '@/lib/api/services/auth.service';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  signIn: (credentials: SignInCredentials) => Promise<void>;
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
      
      signIn: async (credentials: SignInCredentials) => {
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
          localStorage.setItem('token', response.data.accessToken);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to sign in',
          });
        }
      },
      
      signOut: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage', // name of the item in storage
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);