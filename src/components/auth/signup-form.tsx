"use client";

// Core React and Next.js imports
import type React from "react";
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
import { Progress } from "@/components/ui/progress";

// Icon imports
import {
  ClipboardList,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  X,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

// Toast Import
import { toast } from "sonner";
import { useSignupStore } from "@/store/(auth)/auth-store";

/**
 * SignupForm Component - Handles user registration with password strength validation
 * and confirmation checks using Zustand for state management.
 */
export function SignupForm() {
  const router = useRouter();

  // Form state management
  const name = useSignupStore((state) => state.name);
  const email = useSignupStore((state) => state.email);
  const password = useSignupStore((state) => state.password);
  const confirmPassword = useSignupStore((state) => state.confirmPassword);

  // Password strength indicators
  const passwordStrength = useSignupStore((state) => state.passwordStrength);
  const passwordChecks = useSignupStore((state) => state.passwordChecks);

  // UI state management
  const isLoading = useSignupStore((state) => state.isLoading);
  const showPassword = useSignupStore((state) => state.showPassword);
  const showConfirmPassword = useSignupStore((state) => state.showConfirmPassword);

  /**
   * Handles form submission with validation checks
   * @param e - React form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match",
      });
      return;
    }

    // Validate minimum password strength
    if (passwordStrength < 60) {
      toast.error("Password is too weak", {
        description: "Please create a stronger password",
      });
      return;
    }

    useSignupStore.getState().setIsLoading(true);

    // Simulate API call for registration
    setTimeout(() => {
      toast.success("Account created successfully!", {
        description: "You can now log in with your credentials",
      });

      useSignupStore.getState().setIsLoading(false);
      useSignupStore.getState().resetForm();
      router.push("/signin");
    }, 1500);
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
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-sm">
              Join the HR Performance Portal
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pb-6">
          {/* Name Input Field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => useSignupStore.getState().setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => useSignupStore.getState().setEmail(e.target.value
              )}
              required
            />
          </div>

          {/* Password Input Field with Strength Indicator */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Lock className="h-4 w-4 text-muted-foreground" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => useSignupStore.getState().setPassword(e.target.value)}
                className="pr-10"
                required
              />
              {/* Toggle Password Visibility Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => useSignupStore.getState().toggleShowPassword()}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1 rounded-md bg-muted/50 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    Password Strength:
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength < 30
                        ? "text-destructive"
                        : passwordStrength < 60
                        ? "text-amber-500"
                        : passwordStrength < 80
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  >
                    {useSignupStore.getState().getStrengthText()}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className="h-1.5 w-full bg-muted"
                >
                  <div
                    className={`h-full ${useSignupStore.getState().getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </Progress>

                {/* Password Requirement Checklist */}
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="flex items-center gap-1.5">
                    {passwordChecks.length ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className="text-xs">At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordChecks.lowercase ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className="text-xs">Lowercase letter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordChecks.uppercase ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className="text-xs">Uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordChecks.number ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className="text-xs">Number</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordChecks.special ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className="text-xs">Special character</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input Field */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Lock className="h-4 w-4 text-muted-foreground" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => useSignupStore.getState().setConfirmPassword(e.target.value)}
                className={`pr-10 ${
                  confirmPassword &&
                  password !== confirmPassword
                    ? "border-destructive focus:ring-destructive/50"
                    : ""
                }`}
                required
              />
              {/* Toggle Confirm Password Visibility Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => useSignupStore.getState().toggleShowConfirmPassword()}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="flex items-center gap-1.5 text-xs">
                {password === confirmPassword ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-destructive">
                      Passwords don&apos;t match
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>

        {/* Form Submission and Navigation */}
        <CardFooter className="flex-col gap-4 pb-8">
          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              passwordStrength < 60 ||
              password !== confirmPassword
            }
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                <span className="ml-2">Creating Account...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>

          {/* TODO: OAuth Google */}
          <Button>
            Google TODO
          </Button>

          
          {/* Sign-in Navigation Link */}
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-xs"
              onClick={() => router.push("/signin")}
              type="button"
            >
              Sign in
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
