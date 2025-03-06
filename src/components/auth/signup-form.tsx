"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const { password } = formData;

    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    setPasswordChecks(checks);

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const strengthPercentage = (passedChecks / 5) * 100;
    setPasswordStrength(strengthPercentage);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match",
      });
      return;
    }

    if (passwordStrength < 60) {
      toast.error("Password is too weak", {
        description: "Please create a stronger password",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast.success("Account created successfully!", {
        description: "You can now log in with your credentials",
      });

      setIsLoading(false);
      router.push("/signin");
    }, 1500);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-destructive";
    if (passwordStrength < 60) return "bg-amber-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  return (
    <Card className="w-full max-w-md border-2 shadow-xl">
      <CardHeader className="space-y-1 pb-4 pt-6">
        <div className="flex items-center justify-center gap-3">
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
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

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
                value={formData.password}
                onChange={handleChange}
                className="pr-10"
                required
              />
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

            {formData.password && (
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
                    {getStrengthText()}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className="h-1.5 w-full bg-muted"
                >
                  <div
                    className={`h-full ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </Progress>

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
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pr-10 ${
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "border-destructive focus:ring-destructive/50"
                    : ""
                }`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {formData.confirmPassword && (
              <div className="flex items-center gap-1.5 text-xs">
                {formData.password === formData.confirmPassword ? (
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

        <CardFooter className="flex-col gap-4 pb-8">
          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              passwordStrength < 60 ||
              formData.password !== formData.confirmPassword
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
