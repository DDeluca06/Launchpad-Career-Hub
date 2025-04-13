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
  "/support",
];

// Paths that should be admin-only
const adminPaths = ["/admin"];

// Paths that should be student-only
const studentPaths = ["/applicant"];

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
    // No session cookie, redirect to root
    const rootUrl = new URL("/", request.url);
    return NextResponse.redirect(rootUrl);
  }

  try {
    // Decode session
    const decodedString = Buffer.from(sessionCookie, "base64").toString();
    const sessionData = JSON.parse(decodedString);

    // Admins can only access admin routes
    if (sessionData.isAdmin) {
      // Admin trying to access student routes, redirect to admin dashboard
      if (studentPaths.some((path: string) => pathname === path || pathname.startsWith(path + "/"))) {
        const adminDashboard = new URL("/admin/dashboard", request.url);
        return NextResponse.redirect(adminDashboard);
      }
    } 
    // Students can only access student routes
    else {
      // Student trying to access admin routes, redirect to student dashboard
      if (adminPaths.some((path: string) => pathname === path || pathname.startsWith(path + "/"))) {
        const studentDashboard = new URL("/applicant/dashboard", request.url);
        return NextResponse.redirect(studentDashboard);
      }
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
