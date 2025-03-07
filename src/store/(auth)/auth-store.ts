import { create } from 'zustand'

type loginStore = {
    email: string
    password: string
    showPassword: boolean
    isLoading: boolean
    changeEmail: (email: string) => void
    changePassword: (password: string) => void
    toggleShowPassword: () => void
    toggleLoading: () => void
}

export const useLoginStore = create<loginStore>((set) => ({
  email: '',
    password: '',
    showPassword: false,
    isLoading: false,
    changeEmail: (email: string) => set({ email }),
    changePassword: (password: string) => set({ password }),
    toggleShowPassword: () => set((state) => ({ showPassword: !state.showPassword })),
    toggleLoading: () => set((state) => ({ isLoading: !state.isLoading })),
}))
