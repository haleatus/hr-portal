import { create } from "zustand";

// Define the signup store type
type SignupStore = {
  // Form data
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Password strength indicators
  passwordStrength: number;
  passwordChecks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };

  // UI states
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;

  // Actions
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
  setIsLoading: (isLoading: boolean) => void;
  resetForm: () => void;

  // Computed values
  getStrengthColor: () => string;
  getStrengthText: () => string;
};

// Create the Zustand store
export const useSignupStore = create<SignupStore>((set, get) => ({
  // Initial form data
  name: "",
  email: "",
  password: "",
  confirmPassword: "",

  // Initial password strength indicators
  passwordStrength: 0,
  passwordChecks: {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  },

  // Initial UI states
  isLoading: false,
  showPassword: false,
  showConfirmPassword: false,

  // Actions
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => {
    // Update password
    set({ password });

    // Calculate password strength and checks
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    // Calculate strength percentage based on passed checks
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const strengthPercentage = (passedChecks / 5) * 100;

    set({
      passwordChecks: checks,
      passwordStrength: strengthPercentage,
    });
  },
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  toggleShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),
  toggleShowConfirmPassword: () =>
    set((state) => ({ showConfirmPassword: !state.showConfirmPassword })),
  setIsLoading: (isLoading) => set({ isLoading }),
  resetForm: () =>
    set({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isLoading: false,
      passwordStrength: 0,
      passwordChecks: {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      },
    }),

  // Computed values
  getStrengthColor: () => {
    const strength = get().passwordStrength;
    if (strength < 30) return "bg-destructive";
    if (strength < 60) return "bg-amber-500";
    if (strength < 80) return "bg-blue-500";
    return "bg-green-500";
  },
  getStrengthText: () => {
    const strength = get().passwordStrength;
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  },
}));
