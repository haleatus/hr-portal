import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/signin", "/admin-signin"];
// Define auth routes that should be inaccessible when logged in
const authRoutes = ["/", "/signin", "/admin-signin"];

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Check for authentication by looking for the token in cookies
  // Since we're using the Zustand store with localStorage persistence,
  // we need to also store this in cookies for middleware access
  const token = request.cookies.get("token")?.value;

  // Check if the user is authenticated
  const isAuthenticated = !!token;

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

  // Allow the request to continue normally for all other cases
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  // Match all routes except for assets, api routes, etc.
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /images (image files)
     * 5. /favicon.ico, /sitemap.xml (common static files)
     */
    "/((?!api|_next|static|images|favicon.ico|sitemap.xml).*)",
  ],
};
