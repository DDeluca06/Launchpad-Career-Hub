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

  // Handle session state changes
  useEffect(() => {
    // Only proceed if loading is complete
    if (loading) {
      return;
    }

    // Check if we have a valid session with user information
    if (session?.user?.id) {
      // Determine the correct dashboard based on user role
      const dashboardUrl = session.user.isAdmin ? "/admin/dashboard" : "/applicant/dashboard";
      
      // Use the router for client-side navigation
      router.push(dashboardUrl);
    }
  }, [session, loading, router]);

  // Handle timestamp parameter for session refreshing
  useEffect(() => {
    if (timestamp && !loading) {
      // This is just for logging, no need to take action here
      // The session refresh is handled in the providers component
    }
  }, [timestamp, loading]);

  // Show loading spinner while checking authentication
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


        </div>
      </main>

      {/* Footer - fixed at bottom */}
      <footer className="py-3 px-4 relative z-10 mt-auto border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="text-center text-xs text-gray-500">
          <p>&#169; 2025 Launchpad. All rights reserved.</p>
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
