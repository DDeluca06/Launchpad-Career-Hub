"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/basic/label";
import { extendedPalette } from "@/lib/colors";
import { UserCircle, Lock } from "lucide-react";
import { toast } from "@/components/ui/feedback/use-toast";

type LoginMode = 'admin' | 'student';

/**
 * Renders a login form component for both admin and student users.
 *
 * This React component provides an interface for users to enter their credentials, validates the input,
 * simulates an API call with a brief delay, and redirects authenticated users to their respective dashboards.
 * An error message is displayed for invalid or missing credentials. Additionally, users can toggle between
 * admin and student login modes, which clears any existing input or error state.
 */
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use Better Auth login API directly
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          loginType: loginMode,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      if (data.user) {
        // Success - navigate to the correct dashboard
        toast({
          title: "Login successful",
          description: `Welcome, ${data.user.firstName || data.user.email}!`,
          variant: "default",
        });
        
        // Use window.location for a full page reload with timestamp
        const dashboardUrl = data.user.isAdmin ? '/admin/dashboard' : '/applicant/dashboard';
        const timestamp = Date.now();
        window.location.href = `${dashboardUrl}?t=${timestamp}`;
      }
    } catch (err: Error | unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const switchLoginMode = () => {
    const newMode = loginMode === 'admin' ? 'student' : 'admin';
    setLoginMode(newMode);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <Card className="w-full shadow-md border-0 bg-white/95 backdrop-blur-sm transition-all">
      <CardHeader className="space-y-1 text-center pb-2 pt-4">
        <CardTitle className="text-xl font-bold">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-sm">
          Sign in to access your {loginMode === 'admin' ? 'Admin' : 'Student'} dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
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
               {/* unfortunately, we don't have a password reset feature yet */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 transition-all"
            disabled={isLoading}
            style={{
              background: `linear-gradient(to right, ${extendedPalette.primaryBlue}, ${extendedPalette.teal})`,
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
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
              {loginMode === 'admin' ? 'Need student access?' : 'Need admin access?'}
            </span>{" "}
            <button
              type="button"
              className="font-medium hover:underline"
              style={{ color: extendedPalette.primaryBlue }}
              onClick={switchLoginMode}
            >
              {loginMode === 'admin' ? 'Student Login' : 'Admin Login'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
