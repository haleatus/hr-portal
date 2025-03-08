import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/base/app-sidebar";
import AuthGuard from "@/components/auth/auth-guard";

/**
 * DashboardLayout Component
 *
 * The layout component that wraps all dashboard pages in the application.
 * Provides the sidebar context and manages the responsive layout.
 *
 * @param children - The content to render inside the layout
 */
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AuthGuard>
      {/* Sidebar component */}
      <AppSidebar />
      {/* 
          Main content area that adjusts based on sidebar state
          - Properly responds to sidebar expansion/collapse
          - Takes full available width
          - Maintains consistent padding
        */}
      <main className="relative flex-1 w-full ">{children}</main>
      </AuthGuard>
    </SidebarProvider>
  );
}
