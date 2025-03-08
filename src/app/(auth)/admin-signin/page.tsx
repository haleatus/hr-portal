import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export default function AdminSignInPage() {
  // In a real app, check if user is authenticated and redirect to their dashboard
  // For demo purposes, we'll just show the login form
  const isAuthenticated = false;

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on user role
    // This would be determined from the auth state
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <AdminLoginForm />
    </div>
  );
}
