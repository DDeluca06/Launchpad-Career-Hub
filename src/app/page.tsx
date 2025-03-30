import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowRight, LayoutDashboard, Search, Users, Mail, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl font-bold">Launchpad Job Portal</div>
            <nav className="ml-8 hidden md:block">
              <ul className="flex space-x-6">
                <li className="font-medium">
                  <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
                </li>
                <li className="font-medium">
                  <Link href="/jobs" className="text-foreground hover:text-primary transition-colors">Jobs</Link>
                </li>
                <li className="font-medium">
                  <Link href="/community" className="text-foreground hover:text-primary transition-colors">Community</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <Link href="/login" className="mr-4 text-primary hover:text-primary/90">
              Login
            </Link>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Next Opportunity</h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Track your job applications, discover new opportunities, and connect with your community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/jobs">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Discover Jobs</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Browse through our curated list of job opportunities from top companies.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutDashboard className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Track Applications</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Keep track of all your job applications in one place with our dashboard.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Connect with fellow job seekers and build your professional network.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12 text-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold mb-4">Launchpad Job Portal</h2>
              <p className="text-muted-foreground max-w-md">
                Helping connect talent with opportunities in Philadelphia and beyond.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Navigation</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
                  <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
                  <li><Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">Jobs</Link></li>
                  <li><Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Resume Tips</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Interview Prep</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Career Advice</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Contact</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Launchpad Philly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}