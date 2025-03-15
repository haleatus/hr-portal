import { create } from "zustand";

interface SelfReviewState {
  subject: string;
  description: string;
  dueDate: string;
  error: string | null;
  isLoading: boolean;

  setSubject: (subject: string) => void;
  setDescription: (description: string) => void;
  setDueDate: (dueDate: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useSelfReviewStore = create<SelfReviewState>((set) => ({
  subject: "",
  description: "",
  dueDate: "",
  error: null,
  isLoading: false,

  setSubject: (subject) => set({ subject }),
  setDescription: (description) => set({ description }),
  setDueDate: (dueDate) => set({ dueDate }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
