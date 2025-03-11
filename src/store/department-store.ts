import { create } from "zustand";

interface DepartmentNameUpdateState {
  error: string | null;

  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useDepartmentNameUpdateStore = create<DepartmentNameUpdateState>(
  (set) => ({
    error: null,

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  })
);
