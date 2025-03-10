/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

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
  Mail,
  Lock,
  User,
  Check,
  X,
  Eye,
  EyeOff,
  UserPlus,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useCreateUser } from "@/hooks/auth.hooks";
import type { ICreateUserResponse } from "@/interfaces/auth.interface";
import { useRouter } from "next/navigation";

// Define the form input types
type FormInputs = {
  fullname: string;
  email: string;
  password: string;
  role: "MANAGER" | "EMPLOYEE";
};

export default function CreateUserForm() {
  const router = useRouter();

  // UI state management
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Use our improved mutation hook
  const createUserMutation = useCreateUser();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
    },
  });

  // Watch password for strength calculation
  const password = watch("password");

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordChecks({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      });
      return;
    }

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

    setPasswordChecks(checks);
    setPasswordStrength(strengthPercentage);
  }, [password]);

  // Get strength color based on password strength
  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-destructive";
    if (passwordStrength < 60) return "bg-amber-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  // Get strength text based on password strength
  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Clear previous errors
    setGeneralError(null);

    createUserMutation.mutate(data, {
      onSuccess: (response) => {
        if (response && response.statusCode) {
          toast.success(response.message || "User created successfully");
          reset(); // Reset the form
          router.push("/users"); // Redirect to users page
        } else {
          setGeneralError("An unexpected error occurred");
          toast.error("Failed to create user");
        }
      },
      onError: (error: any) => {
        // Handle the specific error format from backend
        const errorResponse = error.response?.data as
          | ICreateUserResponse
          | undefined;

        if (errorResponse?.error) {
          // Also set errors in react-hook-form for each field
          Object.entries(errorResponse.error).forEach(([field, message]) => {
            if (field in data) {
              setError(field as keyof FormInputs, {
                type: "server",
                message: message,
              });
            }
          });

          toast.error(errorResponse.message || "Validation failed");
        } else {
          // General error message
          setGeneralError(error.message || "Failed to create user");
          toast.error(error.message || "Failed to create user");
        }
      },
    });
  };

  return (
    <Card className="w-full max-w-md border-2 shadow-xl">
      <CardHeader className="space-y-1 pb-4 pt-4">
        <div className="flex items-center justify-center gap-3">
          {/* Application Logo and Title */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary p-2 shadow-md">
            <UserPlus className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Create User</CardTitle>
            <CardDescription className="text-sm">
              Add a new user to the system
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 pb-6">
          {/* Display general error if any */}
          {generalError && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive flex items-center gap-2">
              <X className="h-4 w-4" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Full Name Input Field */}
          <div className="space-y-2">
            <Label
              htmlFor="fullname"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="fullname"
              placeholder="John Doe"
              {...register("fullname", { required: "Full name is required" })}
              className={cn(
                errors.fullname
                  ? "border-destructive focus:ring-destructive/50"
                  : ""
              )}
            />
            {errors.fullname && (
              <div className="flex items-center gap-1.5 text-xs text-destructive">
                <X className="h-3.5 w-3.5" />
                <span>{errors.fullname.message}</span>
              </div>
            )}
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
              placeholder="name@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address",
                },
              })}
              className={cn(
                errors.email
                  ? "border-destructive focus:ring-destructive/50"
                  : ""
              )}
            />
            {errors.email && (
              <div className="flex lowercase items-center gap-1.5 text-xs text-destructive">
                <X className="h-3.5 w-3.5" />
                <span>{errors.email.message}</span>
              </div>
            )}
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={cn(
                  "pr-10",
                  errors.password
                    ? "border-destructive focus:ring-destructive/50"
                    : ""
                )}
              />
              {/* Toggle Password Visibility Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 cursor-pointer top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-1.5 text-xs text-destructive">
                <X className="h-3.5 w-3.5" />
                <span>{errors.password.message}</span>
              </div>
            )}

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1 rounded-md bg-muted/50 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    Password Strength:
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      passwordStrength < 30
                        ? "text-destructive"
                        : passwordStrength < 60
                        ? "text-amber-500"
                        : passwordStrength < 80
                        ? "text-blue-500"
                        : "text-green-500"
                    )}
                  >
                    {getStrengthText()}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className={cn("h-1.5 w-full", getStrengthColor())}
                />
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

          {/* Role Selection Field */}
          <div className="space-y-2">
            <Label
              htmlFor="user-role"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              User Role
            </Label>
            <div className="flex gap-3" id="user-role">
              <Button
                type="button"
                variant={watch("role") === "EMPLOYEE" ? "default" : "outline"}
                className={cn(
                  "flex-1 gap-2 cursor-pointer",
                  watch("role") === "EMPLOYEE"
                    ? "bg-primary text-primary-foreground"
                    : ""
                )}
                onClick={() => {
                  const { onChange } = register("role");
                  onChange({ target: { value: "EMPLOYEE", name: "role" } });
                }}
              >
                <User className="h-4 w-4" />
                Employee
              </Button>
              <Button
                type="button"
                variant={watch("role") === "MANAGER" ? "default" : "outline"}
                className={cn(
                  "flex-1 gap-2 cursor-pointer",
                  watch("role") === "MANAGER"
                    ? "bg-primary text-primary-foreground"
                    : ""
                )}
                onClick={() => {
                  const { onChange } = register("role");
                  onChange({ target: { value: "MANAGER", name: "role" } });
                }}
              >
                <Users className="h-4 w-4" />
                Manager
              </Button>
            </div>
            {errors.role && (
              <div className="flex items-center gap-1.5 text-xs text-destructive">
                <X className="h-3.5 w-3.5" />
                <span>{errors.role.message}</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Form Submission */}
        <CardFooter className="flex-col gap-2 pb-4">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={createUserMutation.isPending || passwordStrength < 60}
          >
            {createUserMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                <span className="ml-2">Creating User...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create User
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
