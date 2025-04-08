import Link from "next/link"
import { Button } from "@/components/ui/basic/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Launchpad Job Portal</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Launch Your Career</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Discover job opportunities, connect with employers, and take the next step in your career journey.
            </p>
            <div className="flex gap-4">
              <Link href="/admin/dashboard">
                <Button size="lg">Admin Dashboard</Button>
              </Link>
              <Link href="/applicant/dashboard">
                <Button size="lg" variant="outline">
                  Applicant Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>For Job Seekers</CardTitle>
                <CardDescription>Explore and apply for jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Track applications</li>
                  <li>Save interesting jobs</li>
                  <li>View upcoming events</li>
                  <li>Get personalized recommendations</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/applicant/dashboard" className="w-full">
                  <Button className="w-full">Applicant Portal</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>For Employers</CardTitle>
                <CardDescription>Post jobs and manage applicants</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Track applicants</li>
                  <li>View analytics</li>
                  <li>Manage job listings</li>
                  <li>Schedule events</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/admin/dashboard" className="w-full">
                  <Button className="w-full">Admin Portal</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Job Finder Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

