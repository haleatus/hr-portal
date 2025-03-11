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

interface DepartmentManagerChangeState {
  error: string | null;

  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useDepartmentManagerChangeStore =
  create<DepartmentManagerChangeState>((set) => ({
    error: null,

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  }));

interface AddDepartmentMembersState {
  error: string | null;
  isLoading: boolean;
  members: number[];

  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setMembers: (members: number[]) => void;
  clearError: () => void;
}

export const useAddDepartmentMembersStore = create<AddDepartmentMembersState>(
  (set) => ({
    error: null,
    isLoading: false,
    members: [],

    setError: (error) => set({ error }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setMembers: (members) => set({ members }),
    clearError: () => set({ error: null }),
  })
);
