"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Cog,
  Home,
  LogOut,
  User,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/providers/sidebar.provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/seperator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export function AppSidebar() {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, toggleSidebar } = useSidebar();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching user role
    const role = localStorage.getItem("userRole") || "employee";
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    // In a real app, this would call your logout function
    localStorage.removeItem("userRole");

    toast.success("You have been successfully logged out.");

    // Redirect to login page
    window.location.href = "/";
  };

  const handleRoleChange = (role: string) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);

    toast.success(`You are now viewing as ${role}.`);

    // Refresh the page to update the UI
    window.location.reload();
  };

  // Define navigation items based on user role
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "manager", "employee"],
    },
    {
      title: "Reviews",
      href: "/reviews",
      icon: ClipboardList,
      roles: ["admin", "manager", "employee"],
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
      roles: ["admin", "manager"],
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Cog,
      roles: ["admin", "manager", "employee"],
    },
  ];

  return (
    <TooltipProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <ClipboardList className="h-6 w-6 text-primary-foreground" />
            </div>
            <span
              className={`font-bold transition-all duration-300 ${
                state === "collapsed" ? "md:opacity-0" : "md:opacity-100"
              }`}
            >
              HR Portal
            </span>
          </Link>
          <SidebarTrigger />
        </SidebarHeader>

        <Separator />

        <SidebarContent className="flex flex-col justify-between flex-1">
          <nav className="space-y-1 p-2">
            {navItems
              .filter((item) => !userRole || item.roles.includes(userRole))
              .map((item) => (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        pathname === item.href
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span
                        className={`transition-all duration-300 ${
                          state === "collapsed" ? "md:hidden" : "md:inline"
                        }`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="md:hidden">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ))}
          </nav>

          <SidebarFooter className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span
                    className={`text-sm transition-all duration-300 ${
                      state === "collapsed" ? "md:hidden" : "md:inline"
                    }`}
                  >
                    {userRole === "admin"
                      ? "Admin User"
                      : userRole === "manager"
                      ? "Manager User"
                      : "Employee User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleRoleChange("admin")}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange("manager")}>
                  Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange("employee")}>
                  Employee
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
