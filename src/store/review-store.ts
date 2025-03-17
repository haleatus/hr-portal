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

interface ManagerReviewState {
  reviewee: number;
  dueDate: string;
  error: string | null;
  isLoading: boolean;

  setReviewee: (reviewee: number) => void;
  setDueDate: (dueDate: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useManagerReviewStore = create<ManagerReviewState>((set) => ({
  reviewee: 0,
  dueDate: "",
  error: null,
  isLoading: false,

  setReviewee: (reviewee) => set({ reviewee }),
  setDueDate: (dueDate) => set({ dueDate }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

interface ReviewIdState {
  reviewId: string;
  setReviewId: (reviewId: string) => void;
}

export const useReviewIdStore = create<ReviewIdState>((set) => ({
  reviewId: "",
  setReviewId: (reviewId) => set({ reviewId }),
}));

interface PeerReviewNominationState {
  nominee: number;
  reviewee: number;
  error: string | null;
  isLoading: boolean;

  setNominee: (nominee: number) => void;
  setReviewee: (reviewee: number) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const usePeerReviewNominationStore = create<PeerReviewNominationState>(
  (set) => ({
    nominee: 0,
    reviewee: 0,
    error: null,
    isLoading: false,

    setNominee: (nominee) => set({ nominee }),
    setReviewee: (reviewee) => set({ reviewee }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
    setIsLoading: (isLoading) => set({ isLoading }),
  })
);
