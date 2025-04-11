"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/basic/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { Check, Save, Camera } from "lucide-react"
import { userService, User } from "@/lib/local-storage"


export default function ApplicantSettingsPage() {
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // User settings state
  const [userSettings, setUserSettings] = useState({
    username: "",
    status: "active", // enum: active, inactive
    program: "foundations", // enum based on available programs
    password: "", // For password change
    confirmPassword: ""
  })

  useEffect(() => {
    const loadUserData = async () => {
      // Get current user or default to user with ID 2 (a non-admin)
      const currentUser = userService.getCurrentUser() || userService.getById(2);

      if (currentUser) {
        setUser(currentUser);

        // Pre-fill form with user data
        setUserSettings(prev => ({
          ...prev,
          username: currentUser.username || "",
          status: currentUser.status || "active",
          program: currentUser.program || "foundations"
        }));
      }
    }

    loadUserData();
  }, []);

  // Handle setting change
  const handleSettingChange = (key: string, value: string | boolean) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }

  const handleSave = () => {
    // Save to localStorage
    if (user) {
      const updatedUser = {
        ...user,
        username: userSettings.username,
        status: userSettings.status,
        program: userSettings.program
      };

      // Update user in local storage
      const result = userService.update(updatedUser);

      if (result) {
        setUser(updatedUser);

        // If this is the current logged-in user, update the current user in local storage
        const currentUser = userService.getCurrentUser();
        if (currentUser && currentUser.user_id === user.user_id) {
          userService.logout(); // Clear current user
          userService.login(updatedUser.username, updatedUser.password); // Log back in with updated user
        }

        // Show saved indicator
        setSavedIndicator(true);
        setTimeout(() => setSavedIndicator(false), 2000);
      }
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
                      {user?.username?.substring(0, 2).toUpperCase() || "U"}
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
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={userSettings.username}
                      onChange={(e) => handleSettingChange('username', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <select
                      id="program"
                      className="w-full p-2 border rounded-md"
                      value={userSettings.program}
                      onChange={(e) => handleSettingChange('program', e.target.value)}
                    >
                      <option value="foundations">Foundations</option>
                      <option value="101">101</option>
                      <option value="liftoff">Liftoff</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <div className="p-6 border-t">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={userSettings.password}
                    onChange={(e) => handleSettingChange('password', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={userSettings.confirmPassword}
                    onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <CardFooter className="bg-gray-50 border-t">
            <Button variant="outline" size="sm">Update Password</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
