import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/base/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR Performance Review Portal",
  description: "A portal for managing employee performance reviews",
};

/**
 * RootLayout Component
 *
 * The main layout component that wraps all pages in the application.
 * Provides the sidebar context and manages the responsive layout.
 *
 * @param children - The content to render inside the layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          {/* Sidebar component */}
          <AppSidebar />

          {/* 
              Main content area that adjusts based on sidebar state
              - Properly responds to sidebar expansion/collapse
              - Takes full available width
              - Maintains consistent padding
            */}
          <main className="relative flex-1 w-full ">{children}</main>

          {/* Toast notifications */}
          <Toaster richColors position="bottom-left" />
        </SidebarProvider>
      </body>
    </html>
  );
}
