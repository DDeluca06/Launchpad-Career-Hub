"use client";

import { useEffect, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/basic/button";
import { LoginForm } from "@/components/ui/basic/login-form";
import { AuthContext } from "./providers";

// Client component that uses the useSearchParams hook
function HomeContent() {
  const { session, loading } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const timestamp = searchParams.get('t');

  useEffect(() => {
    if (loading) {
      console.error('Session loading...');
      return;
    }

    console.error('Session loaded:', session);

    // Check if we have a valid session with user information
    if (session?.user?.id) {
      console.error('User found in session, redirecting to dashboard. User ID:', session.user.id);
      console.error('Is admin?', session.user.isAdmin);
      
      // Force a hard redirect using window.location to ensure a fresh page load
      const dashboardUrl = session.user.isAdmin ? "/admin/dashboard" : "/applicant/dashboard";
      console.error('Redirecting to:', dashboardUrl);
      
      // Use the router for client-side navigation
      router.push(dashboardUrl);
    } else {
      console.error('No valid user in session, showing login form');
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (timestamp) {
      console.error('Page loaded with timestamp param, triggering fresh session check');
      // This could trigger a reload of the auth state if needed
    }
  }, [timestamp]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-50">
      {/* Subtle background pattern - covers entire viewport */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-[0.2] bg-[length:20px_20px] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <LoginForm />

          {/* Development navigation - to be removed in production */}
          <div className="mt-6 p-4 border rounded-md bg-white/80 backdrop-blur-sm w-full shadow-sm">
            <div className="text-xs text-center mb-2 font-medium text-slate-500">
              Development Navigation (will be removed)
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Admin Dashboard
                </Button>
              </Link>
              <Link href="/applicant/dashboard">
                <Button variant="outline" size="sm">
                  Student Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - fixed at bottom */}
      <footer className="py-3 px-4 relative z-10 mt-auto border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 Launchpad. All rights reserved.</p>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

/**
 * Main Home page component that wraps the content with Suspense
 * to handle the useSearchParams hook correctly
 */
export default function Home() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
