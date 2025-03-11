import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/signin", "/admin-signin"];
// Define auth routes that should be inaccessible when logged in
const authRoutes = ["/", "/signin", "/admin-signin"];
// Define admin-only routes
const adminRoutes = ["/admins", "/admins/create"];

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Check for authentication by looking for the token in cookies
  const token = request.cookies.get("token")?.value;

  // Try to get the user role from cookies (more reliable for middleware)
  const userRole = request.cookies.get("userRole")?.value;

  // Check if the user is authenticated
  const isAuthenticated = !!token;
  // Check if user is a super admin
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  // Clone the URL for potential redirects
  const url = request.nextUrl.clone();

  // If user is not authenticated and trying to access a non-public route
  if (!isAuthenticated && !publicRoutes.some((route) => pathname === route)) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access auth routes (signin, etc.)
  if (isAuthenticated && authRoutes.some((route) => pathname === route)) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If user is authenticated but not a SUPER_ADMIN and trying to access admin routes
  if (
    isAuthenticated &&
    !isSuperAdmin &&
    adminRoutes.some((route) => pathname.startsWith(route))
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow the request to continue normally for all other cases
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  // Match all routes except for assets, api routes, etc.
  matcher: ["/((?!api|_next|static|images|favicon.ico|sitemap.xml).*)"],
};
