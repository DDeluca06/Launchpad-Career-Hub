import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/signup",
  "/api/auth/session",
];

// Paths that should be admin-only
const adminPaths = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public - allow access without session
  if (
    publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))
  ) {
    return NextResponse.next();
  }

  // Get session cookie
  const sessionCookie = request.cookies.get("session-id")?.value;

  if (!sessionCookie) {
    // No session cookie, redirect to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Decode session
    const decodedString = Buffer.from(sessionCookie, "base64").toString();
    const sessionData = JSON.parse(decodedString);

    // Check for admin access to admin routes
    if (
      adminPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
      ) &&
      !sessionData.isAdmin
    ) {
      // Not admin, redirect to applicant dashboard
      const applicantDashboard = new URL("/applicant/dashboard", request.url);
      return NextResponse.redirect(applicantDashboard);
    }

    // Continue with valid session
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Invalid session format, redirect to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public image files)
     * - public files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|public).*)",
  ],
}; 