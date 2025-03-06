"use client";

// Core React and Next.js imports
import type React from "react";
import { useState } from "react";
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
  Shield,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";

// Toast Import
import { toast } from "sonner";

/**
 * SigninForm Component - Handles user login.
 */
export function LoginForm() {
  const router = useRouter();

  // Form state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state management
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handles form submission
   * @param e - React form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - in a real app, this would call your auth API
    setTimeout(() => {
      // For demo purposes, set role based on email
      let role = "employee";
      if (email.includes("admin")) {
        role = "admin";
      } else if (email.includes("manager")) {
        role = "manager";
      }

      localStorage.setItem("userRole", role);

      toast.success(`Login successful! Welcome back!`, {
        description: `You are logged in as ${role}.`,
      });

      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  /**
   * Gets icons based on the role
   * @returns Role Based Icon
   */
  const getRoleIcon = (emailInput: string) => {
    if (emailInput.includes("admin")) {
      return <Shield className="h-4 w-4 text-red-500" />;
    } else if (emailInput.includes("manager")) {
      return <Users className="h-4 w-4 text-blue-500" />;
    }
    return <User className="h-4 w-4 text-green-500" />;
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
                  {getRoleIcon(email)}
                </div>
              )}
            </div>
            {/* Demo Emails to login */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Demo: Use</span>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs font-medium text-primary"
                onClick={() => setEmail("admin@example.com")}
              >
                admin
              </Button>
              <span>,</span>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs font-medium text-primary"
                onClick={() => setEmail("manager@example.com")}
              >
                manager
              </Button>
              <span>, or</span>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs font-medium text-primary"
                onClick={() => setEmail("employee@example.com")}
              >
                employee
              </Button>
              <span>@example.com</span>
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
              <Button variant="link" className="h-auto p-0 text-xs">
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <p className="text-xs text-muted-foreground">
              Any password will work for the demo
            </p>
          </div>
        </CardContent>

        {/* Form Submission and Navigation */}
        <CardFooter className="flex-col gap-4 pb-8">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || email.length < 1 || password.length < 1}
          >
            {isLoading ? (
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

          {/* Sign-up Navigation Link */}
          <p className="text-center text-xs text-muted-foreground">
            {`Don't have an account? `}
            <Button
              variant="link"
              className="h-auto p-0 text-xs"
              onClick={() => router.push("/signup")}
              type="button"
            >
              Sign up
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
