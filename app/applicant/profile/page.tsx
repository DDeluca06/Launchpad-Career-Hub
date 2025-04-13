"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/basic/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { Check, Save, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/app/providers"

type ProgramType = "FOUNDATIONS" | "ONE_ZERO_ONE" | "LIFTOFF" | "ALUMNI";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    isAdmin: boolean;
    program?: ProgramType;
  }

  interface Session {
    user: User;
  }
}

export default function ApplicantSettingsPage() {
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const { session, loading } = useContext(AuthContext);

  // User settings state
  const [userSettings, setUserSettings] = useState({
    email: "",
    status: "active", // enum: active, inactive
    program: "foundations", // enum based on available programs
    password: "", // For password change
    confirmPassword: "",
    last_name: "" // Changed from lastName to last_name to match schema
  })

  useEffect(() => {
    if (loading) return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    // Pre-fill form with user data
    setUserSettings(prev => ({
      ...prev,
      email: session.user!.email || "",
      program: session.user!.isAdmin ? "ALUMNI" : "FOUNDATIONS", // Fallback for missing program
      last_name: session.user!.lastName || ""
    }));
  }, [session, loading, router]);

  // Handle setting change
  const handleSettingChange = (key: string, value: string | boolean) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }

  const handleSave = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userSettings.email,
          firstName: session.user!.firstName,
          lastName: userSettings.last_name,
          program: userSettings.program,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Show saved indicator
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  // Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous object URL if it exists
    if (profileImage && profileImage.startsWith('blob:')) {
      URL.revokeObjectURL(profileImage);
    }
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  }

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (profileImage && profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  // Click handler for profile image upload button
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-500 mt-1">Manage your profile information</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-1"
            >
              {savedIndicator ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <div className="p-6 border-t">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-32 w-32 cursor-pointer" onClick={handleProfileImageClick}>
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-gray-100 text-gray-400 text-2xl">
                      {session?.user?.email?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleProfileImageClick}
                  className="flex items-center gap-1"
                >
                  <Camera className="h-4 w-4" />
                  Change Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={userSettings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userSettings.last_name}
                      onChange={(e) => handleSettingChange('last_name', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <select
                      id="program"
                      className="w-full p-2 border rounded-md"
                      value={userSettings.program}
                      onChange={(e) => handleSettingChange('program', e.target.value)}
                    >
                      <option value="FOUNDATIONS">Foundations</option>
                      <option value="ONE_ZERO_ONE">101</option>
                      <option value="LIFTOFF">Liftoff</option>
                      <option value="ALUMNI">Alumni</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Password Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <div className="p-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userSettings.password}
                  onChange={(e) => handleSettingChange('password', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={userSettings.confirmPassword}
                  onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button size="sm" variant="outline">Change Password</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
