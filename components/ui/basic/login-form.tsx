"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/basic/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { extendedPalette } from "@/lib/colors";
import { UserCircle, Lock } from "lucide-react";
import { toast } from "@/components/ui/feedback/use-toast";

/**
 * Renders a login form component for both admin and student users.
 *
 * This React component provides an interface for users to enter their credentials, validates the input,
 * simulates an API call with a brief delay, and redirects authenticated users to their respective dashboards.
 * An error message is displayed for invalid or missing credentials. Additionally, users can toggle between
 * admin and student login modes, which clears any existing input or error state.
 */
export function LoginForm() {
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full shadow-md border-0 bg-white/95 backdrop-blur-sm transition-all">
      <CardHeader className="space-y-1 text-center pb-2 pt-4">
        <CardTitle className="text-xl font-bold">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-sm">
          Sign in to access your Launchpad dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <UserCircle size={16} />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="pl-9 py-4 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <a
                href="#"
                className="text-xs hover:underline"
                style={{ color: extendedPalette.primaryBlue }}
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="pl-9 py-4 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 transition-all"
            style={{
              background: `linear-gradient(to right, ${extendedPalette.primaryBlue}, ${extendedPalette.teal})`,
            }}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center">
          <div className="relative flex items-center justify-center w-full mb-2">
            <div className="border-t border-gray-200 w-full absolute"></div>
            <span className="bg-white px-3 text-xs text-gray-500 relative">
              or
            </span>
          </div>

          <div className="text-xs">
            <span className="text-gray-500">
              Need student access?
            </span>{" "}
            <button
              type="button"
              className="font-medium hover:underline"
              style={{ color: extendedPalette.primaryBlue }}
              onClick={() => {
                // Implement student login logic here
              }}
            >
              Student Login
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center border-t pt-3 pb-3 bg-gray-50/50">
        <p className="text-[10px] text-gray-500">
          <span className="font-medium">Demo:</span>
          Student:{" "}
          <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[10px]">
            user@example.com
          </span>{" "}
          /
          <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[10px]">
            password123
          </span>
          <span className="mx-1">|</span>
          Admin:{" "}
          <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[10px]">
            admin@example.com
          </span>{" "}
          /
          <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[10px]">
            password123
          </span>
        </p>
      </CardFooter>
    </Card>
  );
}
