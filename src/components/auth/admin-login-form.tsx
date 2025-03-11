"use client";

// Core React and Next.js imports
import React from "react";
import { useRouter } from "next/navigation";

// UI component imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icon imports
import {
  ClipboardList,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

// Toast Import
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { useAdminSignIn } from "@/hooks/auth.hooks";

/**
 * SigninForm Component - Handles user login.
 */
export function AdminLoginForm() {
  // Form state management
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // UI state management
  const [showPassword, setShowPassword] = React.useState(false);

  // Auth store state management
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  // TanStack Query mutation
  const { mutate: adminSignIn, isPending } = useAdminSignIn();

  const router = useRouter();

  /**
   * Handles form submission
   * @param e - React form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    adminSignIn(
      { email, password },
      {
        onSuccess: () => {
          toast.success(`Login successful! Welcome back!`);
          clearError();
          router.push("/dashboard");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to sign in");
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md border-2 shadow-xl">
      <CardHeader className="space-y-1 pb-4 pt-6">
        <div className="flex items-center justify-center gap-3">
          {/* Application Logo and Title */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary p-2 shadow-md">
            <ClipboardList className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              HR Performance Admin Portal
            </CardTitle>
            <CardDescription className="text-sm">
              Your workplace management solution
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Email Input Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-3 pr-10"
                required
              />
              {email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                  <Shield className="h-4 w-4 text-red-500" />
                </div>
              )}
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </Label>
              {/* <Button variant="link" className="h-auto p-0 text-xs">
                Forgot password?
              </Button> */}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pr-10"
                required
              />
              {/* Toggle Password Visibility Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Form Submission and Navigation */}
        <CardFooter className="flex-col gap-4 pb-8">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending || email.length < 1 || password.length < 1}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign in <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
