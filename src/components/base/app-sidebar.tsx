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
import { toast } from "sonner";

export function AppSidebar() {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toggleSidebar } = useSidebar();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "employee";
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    toast.success("Logged out, You have been successfully logged out.");
    window.location.href = "/";
  };

  const handleRoleChange = (role: string) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
    toast.success(`Role Changed, You are now viewing as ${role}.`);
    window.location.reload(); // Refresh the page to update UI
  };

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
    <Sidebar className={`${pathname === "/" ? "hidden" : "block"}`}>
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-1">
            <ClipboardList className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold">HR Portal</span>
        </Link>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>

      <Separator />

      <SidebarContent className="p-2 flex-1">
        <nav className="space-y-1">
          {navItems
            .filter((item) => !userRole || item.roles.includes(userRole))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2">
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="text-sm">
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
    </Sidebar>
  );
}
