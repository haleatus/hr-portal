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

interface CreateDepartmentState {
  leader: number;
  department: string;
  members: number[];
  isLoading: boolean;
  error: string | null;

  setLeader: (leader: number) => void;
  setDepartment: (department: string) => void;
  setMembers: (members: number[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCreateDepartmentStore = create<CreateDepartmentState>(
  (set) => ({
    leader: 0,
    department: "",
    members: [],
    isLoading: false,
    error: null,

    setLeader: (leader) => set({ leader }),
    setDepartment: (department) => set({ department }),
    setMembers: (members) => set({ members }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  })
);
