"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/basic/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { AlertCircle, Check, Eye, EyeOff, Save, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/app/providers"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"

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
  
  // Password specific states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // User settings state
  const [userSettings, setUserSettings] = useState({
    email: "",
    status: "active", // enum: active, inactive
    program: "foundations", // enum based on available programs
    currentPassword: "", // For current password verification
    password: "", // For new password
    confirmPassword: "",
    first_name: "", // Added first_name field to match schema
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
      program: session.user!.program || "FOUNDATIONS", // Fallback for missing program
      first_name: session.user!.first_name || "",
      last_name: session.user!.last_name || ""
    }));
  }, [session, loading, router]);

  // Handle setting change
  const handleSettingChange = (key: string, value: string | boolean) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear any password errors when user starts typing again
    if (['currentPassword', 'password', 'confirmPassword'].includes(key)) {
      setPasswordError(null);
    }
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
          // Only sending editable fields, not email, names, or program
          // Other fields that are editable would go here
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

  // Handle password change
  const handlePasswordChange = async () => {
    // Reset states
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validate inputs
    if (!userSettings.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    
    if (!userSettings.password) {
      setPasswordError("New password is required");
      return;
    }
    
    if (userSettings.password !== userSettings.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (userSettings.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: userSettings.currentPassword,
          newPassword: userSettings.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setPasswordError(data.error || "Failed to change password");
        return;
      }
      
      // Reset password fields
      setUserSettings(prev => ({
        ...prev,
        currentPassword: "",
        password: "",
        confirmPassword: ""
      }));
      
      // Show success message
      setPasswordSuccess(true);
      toast.success("Password changed successfully");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setIsChangingPassword(false);
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
                <Avatar className="h-32 w-32">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-gray-100 text-gray-400 text-2xl">
                      {session?.user?.email?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="text-xs text-gray-500 mt-1">Profile photo cannot be changed</p>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={userSettings.email}
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userSettings.first_name}
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">First name cannot be changed</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userSettings.last_name}
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Last name cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Input
                      id="program"
                      value={userSettings.program}
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Program cannot be changed</p>
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
            {passwordError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertDescription>Password updated successfully</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={userSettings.currentPassword}
                    onChange={(e) => handleSettingChange('currentPassword', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showNewPassword ? "text" : "password"}
                    value={userSettings.password}
                    onChange={(e) => handleSettingChange('password', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={userSettings.confirmPassword}
                    onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
