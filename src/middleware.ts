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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - static (your static folder, if applicable - adjust if needed)
     * - images (your images folder, if applicable - adjust if needed)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - firebase-messaging-sw.js (Firebase service worker) <--- ADDED EXCLUSION
     */
    "/((?!api|_next/static|_next/image|static|images|favicon.ico|sitemap.xml|firebase-messaging-sw.js).*)",
  ],
};
