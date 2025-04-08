"use client"

import Link from "next/link"
import { Button } from "@/components/ui/basic/button"
import { LoginForm } from "@/components/ui/basic/login-form"

/**
 * Renders the Home page with a centered login form, development navigation, and footer.
 *
 * The component displays a login form over a fixed, subtle background pattern. It includes a development-only
 * navigation section with links to the Admin Dashboard and Student Dashboard, as well as a fixed footer. Global
 * styles for fade-in animations are applied throughout the page.
 *
 * @returns The rendered Home page component.
 *
 * @remark The development navigation section is intended for non-production use and will be removed in production builds.
 */
export default function Home() {
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
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}
