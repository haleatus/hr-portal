import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/providers/sidebar.provider";
import { AppSidebar } from "@/components/base/app-sidebar";
import { Toaster } from "sonner";

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
        <SidebarProvider defaultOpen={true}>
          {/* Main layout container with group styling to respond to sidebar state */}
          <div className="flex min-h-screen w-full">
            {/* Sidebar component */}
            <AppSidebar />

            {/* 
              Main content area that adjusts based on sidebar state
              - Utilizes group styling from SidebarProvider to adjust width
              - Transitions smoothly between states
            */}
            <main
              className="
              flex-1 p-4
              md:transition-all md:duration-300
              md:pl-[calc(var(--sidebar-width-collapsed)+1rem)]
              group-data-[state=expanded]/sidebar-wrapper:md:pl-[calc(var(--sidebar-width)+1rem)]
            "
            >
              {children}
            </main>
          </div>

          {/* Toast notifications */}
          <Toaster richColors position="bottom-left" />
        </SidebarProvider>
      </body>
    </html>
  );
}
