"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { IUser } from "@/interfaces/user.interface";

type AuthContextType = {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  // Get values from Zustand store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Allow hydration to complete and check auth status
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
