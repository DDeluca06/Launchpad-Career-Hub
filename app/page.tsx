import Link from "next/link"
<<<<<<< HEAD
import { Button } from "@/components/ui/basic/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
=======
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/login-form"
import { extendedPalette } from "@/lib/colors"
<<<<<<< HEAD
>>>>>>> ff472e9 (Draft 2 of Admin/Applicant Pages)
=======
>>>>>>> refs/remotes/origin/Bryan

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto py-4 px-4 flex justify-center items-center">
          <h1 className="text-2xl font-bold" style={{ color: extendedPalette.primaryBlue }}>Launchpad Career Hub</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4 flex flex-col items-center justify-center">
        <LoginForm />
        
        {/* Development navigation - to be removed in production */}
        <div className="mt-8 p-4 border rounded-md bg-white w-full max-w-md">
          <div className="text-sm text-center mb-2 font-medium text-slate-500">
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
                Applicant Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Launchpad Career Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

