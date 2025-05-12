"use client";

// Core React and Next.js imports
import React from "react";
import Link from "next/link";

// UI components imports
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icon imports
import { Moon, Shield, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Header component - Header of the Landing page
 * Includes the app logo, nav links and auth links
 */
const Header = () => {
  const { setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur md:px-5 lg:px-8">
      <div className="container flex h-16 items-center justify-between">
        {/* Branding section */}
        <div className="flex items-center gap-2 font-bold">
          <Shield className="h-6 w-6 text-primary" />
          <span>HRHub</span>
        </div>
        {/* Main navigation links */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#roles"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            User Roles
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Testimonials
          </Link>
        </nav>
        {/* Authentication buttons */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={"/signin"}>
            <Button variant="outline" size="sm" className="cursor-pointer">
              Log in
            </Button>
          </Link>
          <Link href={"/signup"}>
            <Button size="sm" className="cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
