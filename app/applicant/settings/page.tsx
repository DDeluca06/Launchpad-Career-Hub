"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Label } from "@/components/ui/basic/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { Check, Save, UserCircle, FileText, Upload, Trash2, Camera } from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { userService, resumeService, User, Resume } from "@/lib/local-storage"


export default function ApplicantSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  
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
        
        // Load user's resumes from local storage
        const userResumes = resumeService.getByUserId(currentUser.user_id);
        setResumes(userResumes);
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
    
    // In a real app, you would upload to a server
    // For demo, we'll use a local URL
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  }
  
  // Click handler for profile image upload button
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  }
  
  // Handle resume file upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setNewResumeFile(file);
  }
  
  // Upload resume
  const handleResumeUpload = () => {
    if (!newResumeFile || !user) return;
    
    // Create a new resume in local storage
    const newResume = resumeService.create({
      user_id: user.user_id,
      file_path: `/uploads/resumes/${newResumeFile.name}`,
      file_name: newResumeFile.name,
      isDefault: resumes.length === 0 // Make default if it's the first resume
    });
    
    if (newResume) {
      // Update the UI
      setResumes(prev => [...prev, newResume]);
      setNewResumeFile(null);
      
      // Clear the file input
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
    }
  }
  
  // Set default resume
  const setDefaultResume = (resumeId: number) => {
    // Update all resumes in local storage
    resumes.forEach(resume => {
      const isDefault = resume.resume_id === resumeId;
      
      if (isDefault !== resume.isDefault) {
        const updatedResume = { ...resume, isDefault };
        resumeService.update(updatedResume);
      }
    });
    
    // Update UI
    setResumes(prev => prev.map(resume => ({
      ...resume,
      isDefault: resume.resume_id === resumeId
    })));
  }
  
  // Delete resume
  const deleteResume = (resumeId: number) => {
    // Delete from local storage
    resumeService.delete(resumeId);
    
    // Update UI
    const updatedResumes = resumes.filter(resume => resume.resume_id !== resumeId);
    setResumes(updatedResumes);
    
    // If we deleted the default resume and have other resumes, set a new default
    const deletedDefault = resumes.find(r => r.resume_id === resumeId)?.isDefault;
    if (deletedDefault && updatedResumes.length > 0) {
      const newDefault = updatedResumes[0];
      setDefaultResume(newDefault.resume_id);
    }
  }
  
  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-500 mt-1">Manage your profile information and resumes</p>
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
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="resumes" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Resumes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
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
                          <option value="web_development">Web Development</option>
                          <option value="data_science">Data Science</option>
                          <option value="ux_design">UX Design</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select 
                        id="status"
                        className="w-full p-2 border rounded-md"
                        value={userSettings.status}
                        onChange={(e) => handleSettingChange('status', e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card>
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
          </TabsContent>
          
          <TabsContent value="resumes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Resumes</CardTitle>
                <CardDescription>Upload and manage your resumes</CardDescription>
              </CardHeader>
              <div className="p-6 border-t">
                <div className="space-y-4">
                  {/* Upload new resume */}
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <h3 className="font-medium">Upload a new resume</h3>
                      <p className="text-sm text-gray-500 mb-2">Drag and drop or click to browse</p>
                      <div className="flex items-center gap-2">
                        <input 
                          type="file" 
                          ref={resumeInputRef} 
                          onChange={handleResumeChange} 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => resumeInputRef.current?.click()}
                        >
                          Browse Files
                        </Button>
                        {newResumeFile && (
                          <Button 
                            size="sm"
                            onClick={handleResumeUpload}
                            style={{ backgroundColor: extendedPalette.primaryBlue }}
                          >
                            Upload Resume
                          </Button>
                        )}
                      </div>
                      {newResumeFile && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {newResumeFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Existing resumes */}
                  <div className="space-y-3">
                    {resumes.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-sm font-medium text-gray-600 mb-1">No resumes uploaded yet</h3>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto">
                          You don&apos;t have any resumes uploaded. Add a resume to apply for jobs more quickly.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {resumes.map((resume) => (
                          <div key={resume.resume_id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-gray-400" />
                              <div>
                                <p className="font-medium">{resume.file_name}</p>
                                <p className="text-xs text-gray-500">
                                  Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {resume.isDefault && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!resume.isDefault && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setDefaultResume(resume.resume_id)}
                                >
                                  Set as Default
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteResume(resume.resume_id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
