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
  User,
  Eye,
  EyeOff,
} from "lucide-react";

// Toast Import
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { useUserSignIn } from "@/hooks/auth.hooks";
import { generateToken } from "@/notifications/firebase";
import { getDeviceId, getDeviceType } from "@/lib/utils";

/**
 * SigninForm Component - Handles user login.
 */
export function UserLoginForm() {
  // Form state management
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // UI state management
  const [showPassword, setShowPassword] = React.useState(false);

  // Auth store state management
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  // TanStack Query mutation
  const { mutate: userSignIn, isPending } = useUserSignIn();

  const router = useRouter();

  /**
   * Handles form submission
   * @param e - React form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fcmToken = await generateToken(); // This will now hopefully work
    if (!fcmToken) {
      toast.error(
        "Failed to get notification token. Notifications might not work."
      );
      // Decide if login should proceed without a token. For now, let's assume it should.
      // return; // Uncomment if FCM token is strictly required for login
    }

    const deviceId = getDeviceId();
    const deviceType = getDeviceType();

    console.log("FCM Token from form:", fcmToken); // Log for debugging
    console.log("Device ID:", deviceId);
    console.log("Device Type:", deviceType);

    userSignIn(
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
              HR Performance Portal
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
            <div className="bg-red-100 border border-red-400 text-red-700 flex justify-center py-1 rounded mb-4">
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
                  <User className="h-4 w-4 text-blue-500" />
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

          {/* TODO: OAuth Google
          <Button
            variant="outline"
            className="flex items-center cursor-pointer gap-2 w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => {
              // TODO: Implement Google OAuth logic
              console.log("Google OAuth initiated");
            }}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button> */}
        </CardFooter>
      </form>
    </Card>
  );
}
