"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/basic/button";
import { LoginForm } from "@/components/ui/basic/login-form";

/**
 * Renders the main home page with a centered login form and development navigation.
 *
 * This component displays a fixed full-screen layout with a subtle grid-patterned background, a centered login
 * form, and temporary navigation links to the Admin Dashboard and Student Dashboard. It also includes a fixed footer
 * with copyright information and global fade-in animations. Note that the development navigation is intended solely
 * for testing and will be removed in production.
 */
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      if (session.user.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/applicant/dashboard");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
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
