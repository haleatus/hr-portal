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
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * MobileSidebar Component
 *
 * A dedicated sidebar component for mobile devices that appears as a slide-out drawer.
 */
function MobileSidebar({
  navItems,
  userRole,
  pathname,
  handleLogout,
}: {
  navItems: Array<{
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    roles: string[];
    title: string;
  }>;
  userRole: string;
  pathname: string;
  handleLogout: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SheetTitle className="hidden">Sidebar</SheetTitle>
        <div className="flex h-full flex-col">
          {/* Mobile Sidebar Header */}
          <div className="flex h-14 items-center px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1">
                <ClipboardList className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold">HR Portal</span>
            </Link>
          </div>

          <Separator />

          {/* Mobile Navigation Items */}
          <div className="flex-1 overflow-auto p-4">
            <nav className="space-y-2">
              {navItems
                .filter((item) => !userRole || item.roles.includes(userRole))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
            </nav>
          </div>

          {/* Mobile User Section */}
          <div className="border-t p-4">
            <div className="mb-2 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {userRole === "admin"
                  ? "Admin User"
                  : userRole === "manager"
                  ? "Manager User"
                  : "Employee User"}
              </span>
            </div>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link href="/settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
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
  const { state, toggleSidebar } = useSidebar();

  // Track the user's role to show appropriate navigation items
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check if sidebar is in collapsed state
  const isCollapsed = state === "collapsed";

  // Load user role from localStorage on component mount
  useEffect(() => {
    const role = localStorage.getItem("userRole") || "employee";
    setUserRole(role);
  }, []);

  /**
   * Handles user logout by clearing storage and redirecting
   */
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    toast.success("Logged out, You have been successfully logged out.");
    window.location.href = "/";
  };

  // Navigation items with their respective roles, icons and paths
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

  // Don't render the sidebar on authentication pages
  if (pathname === "/" || pathname === "/signin" || pathname === "/signup")
    return null;

  return (
    <>
      {/* Mobile Hamburger Menu - Only visible on small screens */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <MobileSidebar
          navItems={navItems}
          userRole={userRole || ""}
          pathname={pathname}
          handleLogout={handleLogout}
        />
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <Sidebar className="bg-white border-r hidden md:flex">
        {/* Sidebar Header - Contains logo and collapse toggle */}
        <SidebarHeader className="flex items-center justify-between p-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2",
              isCollapsed && "justify-center"
            )}
          >
            <div className="rounded-md bg-primary p-1">
              <ClipboardList className="h-6 w-6 text-primary-foreground" />
            </div>
            {/* Only show the title when expanded */}
            {!isCollapsed && <span className="font-bold">HR Portal</span>}
          </Link>

          {/* Toggle button for desktop view */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </SidebarHeader>

        <Separator />

        {/* Sidebar Content - Contains navigation items */}
        <SidebarContent className="p-2 flex-1">
          <nav className="space-y-1">
            {navItems
              .filter((item) => !userRole || item.roles.includes(userRole))
              .map((item) => {
                // Create navigation link with appropriate styling
                const NavLink = (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                );

                // Use tooltip to show navigation item name when sidebar is collapsed
                return isCollapsed ? (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  NavLink
                );
              })}
          </nav>
        </SidebarContent>

        {/* Sidebar Footer - Contains user profile and dropdown */}
        <SidebarFooter className={cn("p-4", isCollapsed && "px-2")}>
          <DropdownMenu>
            {/* Use a button with avatar that adjusts based on sidebar state */}
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full",
                  isCollapsed ? "justify-center p-1" : "justify-start px-2"
                )}
              >
                <Avatar
                  className={cn("h-8 w-8", !isCollapsed && "mr-2 h-6 w-6")}
                >
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {/* Only display username when sidebar is expanded */}
                {!isCollapsed && (
                  <span className="text-sm">
                    {userRole === "admin"
                      ? "Admin User"
                      : userRole === "manager"
                      ? "Manager User"
                      : "Employee User"}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            {/* Dropdown menu positioned to appear in the right place regardless of sidebar state */}
            <DropdownMenuContent
              align={isCollapsed ? "end" : "start"}
              side={isCollapsed ? "right" : "bottom"}
              className="w-56"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
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
    </>
  );
}
