"use client"

import { useState } from "react"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/basic/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { extendedPalette } from "@/lib/colors"
import { useRouter } from "next/navigation"
import { UserCircle, Lock, AlertCircle } from "lucide-react"

export function LoginForm() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Basic validation
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call with slight delay
    setTimeout(() => {
      // In a real app, you would validate against a backend
      if (isAdmin) {
        if (username === "admin" && password === "admin123") {
          router.push("/admin/dashboard")
        } else {
          setError("Invalid admin credentials")
          setIsLoading(false)
        }
      } else {
        if (username === "student" && password === "student123") {
          router.push("/applicant/dashboard")
        } else {
          setError("Invalid student credentials")
          setIsLoading(false)
        }
      }
    }, 600)
  }

  return (
    <Card className="w-full shadow-md border-0 bg-white/95 backdrop-blur-sm transition-all">
      <CardHeader className="space-y-1 text-center pb-2 pt-4">
        <CardTitle className="text-xl font-bold">
          {isAdmin ? "Admin Portal" : "Student Portal"}
        </CardTitle>
        <CardDescription className="text-sm">
          Sign in to access your Launchpad dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="username" className="text-sm font-medium">Username</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <UserCircle size={16} />
              </div>
              <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isAdmin ? "admin" : "student"}
                className="pl-9 py-4 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <a href="#" className="text-xs hover:underline" style={{ color: extendedPalette.primaryBlue }}>
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="pl-9 py-4 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Fixed height error container to prevent layout shift */}
          <div className="h-5 min-h-5">
            {error && (
              <div className="flex items-center text-xs text-red-500 font-medium animate-fadeIn">
                <AlertCircle size={12} className="inline-block mr-1 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-4 transition-all"
            style={{ 
              background: `linear-gradient(to right, ${extendedPalette.primaryBlue}, ${extendedPalette.teal})` 
            }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <div className="relative flex items-center justify-center w-full mb-2">
            <div className="border-t border-gray-200 w-full absolute"></div>
            <span className="bg-white px-3 text-xs text-gray-500 relative">or</span>
          </div>
          
          <div className="text-xs">
            <span className="text-gray-500">
              {isAdmin 
                ? "Need student access?" 
                : "Administrator access?"}
            </span>{" "}
            <button
              type="button"
              className="font-medium hover:underline"
              style={{ color: extendedPalette.primaryBlue }}
              onClick={() => {
                setIsAdmin(!isAdmin)
                setUsername("")
                setPassword("")
                setError("")
              }}
              disabled={isLoading}
            >
              {isAdmin ? "Student Login" : "Admin Login"}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center border-t pt-3 pb-3 bg-gray-50/50">
        <p className="text-[10px] text-gray-500">
          <span className="font-medium">Demo:</span> 
          Student: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[10px]">student</span> / 
          <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[10px]">student123</span>
          <span className="mx-1">|</span>
          Admin: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[10px]">admin</span> / 
          <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[10px]">admin123</span>
        </p>
      </CardFooter>
    </Card>
  )
} 