"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Cog,
  Home,
  Menu,
  Network,
  ShieldEllipsis,
  ShieldPlus,
  ShieldUser,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import LogoutButton from "../auth/logout-button";
import { useAuth } from "@/providers/auth-provider";

// Define the navigation item type for better type safety
type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
};

/**
 * Main Sidebar Provider Component
 *
 * Wraps the application with the sidebar context and renders
 * the appropriate sidebar based on the current route
 */
export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't render the sidebar on authentication pages
  if (pathname === "/" || pathname === "/signin" || pathname === "/signup") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}

/**
 * AppSidebar Component
 *
 * A responsive sidebar component that adapts to different screen sizes and
 * can be collapsed to a minimal view. Features role-based navigation and
 * user account management.
 */
export function AppSidebar() {
  // Get the current pathname to highlight active navigation item
  const pathname = usePathname();

  // Access sidebar context to manage collapsible state and mobile responsiveness
  const { setOpenMobile, isMobile, state } = useSidebar();

  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  // Navigation items with their respective roles, icons and paths
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      title: "My Teams",
      href: "/my-teams",
      icon: ShieldEllipsis,
      roles: ["MANAGER", "EMPLOYEE"],
    },
    {
      title: "Reviews",
      href: "/reviews",
      icon: ClipboardList,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      title: "Admins",
      href: "/admins",
      icon: ShieldUser,
      roles: ["ADMIN"],
    },
    {
      title: "Departments",
      href: "/departments",
      icon: Network,
      roles: ["ADMIN"],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Cog,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      title: "Create User",
      href: "/create-user",
      icon: UserPlus,
      roles: ["ADMIN"],
    },
    {
      title: "Create Admin",
      href: "/create-admin",
      icon: ShieldPlus,
      roles: ["ADMIN"],
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      roles: ["MANAGER", "EMPLOYEE"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile Sidebar Trigger - Only visible on mobile */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenMobile(true)}
          className="rounded-full shadow-md"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      {/* Main Sidebar */}
      <Sidebar collapsible="icon" className="border-r">
        {/* Sidebar Header - Contains logo and collapse toggle */}
        <SidebarHeader className="flex items-center justify-between p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div
                    className={`flex aspect-square  items-center justify-center rounded-lg bg-primary text-primary-foreground ${
                      state === "collapsed" ? "size-5" : "size-8"
                    }`}
                  >
                    <ClipboardList className="size-4" />
                  </div>
                  <div
                    className={`gap-0.5 leading-none  ${
                      state === "collapsed" ? "hidden" : "flex flex-col"
                    }`}
                  >
                    <span className="font-semibold">HR Portal</span>
                    <span className="text-xs text-muted-foreground">
                      {user.name || user.fullname} | {user.role}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <Separator />

        {/* Sidebar Content - Contains navigation items */}
        <SidebarContent className="p-2">
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        {/* Sidebar Footer - Contains user profile and dropdown */}
        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                  >
                    <Avatar
                      className={`${
                        state === "collapsed" ? "size-4" : "size-8"
                      }`}
                    >
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div
                      className={`text-left text-sm leading-tight ${
                        state === "collapsed" ? "hidden" : "grid flex-1"
                      }`}
                    >
                      <span className="truncate font-semibold">
                        {user.name || user.fullname}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  sideOffset={4}
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Cog className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-0.5">
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        {/* Sidebar Rail - Allows resizing/collapsing the sidebar */}
        <SidebarRail />
      </Sidebar>
    </>
  );
}
