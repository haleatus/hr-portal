import { create } from "zustand";

interface AdminDetailUpdateState {
  error: string | null;

  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAdminDetailUpdateStore = create<AdminDetailUpdateState>(
  (set) => ({
    error: null,

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  })
);
