import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/tanstack-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { NotificationInitializer } from "@/components/notifications/notification-initilizer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR Performance Review Portal",
  description: "A portal for managing employee performance reviews",
};

/**
 * RootLayout Component
 *
 * The main layout component that wraps all pages in the application.
 *
 * @param children - The content to render inside the layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {/* 
              Main content area that adjusts based on sidebar state
              - Properly responds to sidebar expansion/collapse
              - Takes full available width
              - Maintains consistent padding
              */}
              <main className="relative flex-1 w-full md:pt-0 pt-8">
                {/* Client-only initializer */}
                <NotificationInitializer />
                {children}
              </main>

              {/* Toast notifications */}
              <Toaster richColors position="bottom-right" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
