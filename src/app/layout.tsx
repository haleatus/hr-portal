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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 w-full">{children}</main>
          </div>
          <Toaster richColors position="bottom-left" />
        </SidebarProvider>
      </body>
    </html>
  );
}
