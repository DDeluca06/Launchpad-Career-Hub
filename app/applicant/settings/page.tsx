"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Label } from "@/components/ui/basic/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { Check, Save, RefreshCw, UserCircle, FileText, Upload, Trash2, Camera } from "lucide-react"
import { extendedPalette } from "@/lib/colors"

// Define the User interface directly in this file
interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  status?: string;
  program?: string;
  created_at?: string;
}

// Simulate resume interface based on DB schema
interface Resume {
  resume_id: number;
  user_id: number;
  file_path: string;
  file_name: string;
  isDefault: boolean;
  created_at: string;
}

// Mock user service for demo purposes
const mockUserService = {
  getById: (id: number): User => {
    // Return mock user data
    return {
      user_id: id,
      username: "student1",
      first_name: "Jamie",
      last_name: "Rodriguez",
      email: "jamie.rodriguez@example.com",
      status: "active",
      program: "foundations",
      created_at: new Date().toISOString()
    };
  },
  update: (user: User): User => {
    // In a real app, this would update the database
    console.error("Updated user:", user);
    return user;
  }
};

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
      // For demo, we'll use user with ID 2 (a non-admin)
      const userData = mockUserService.getById(2)
      
      if (userData) {
        setUser(userData)
        
        // Pre-fill form with user data
        setUserSettings(prev => ({
          ...prev,
          username: userData.username || "",
          status: userData.status || "active",
          program: userData.program || "foundations"
        }))
        
        // Load mock resumes
        const mockResumes: Resume[] = [
          {
            resume_id: 1,
            user_id: userData.user_id,
            file_path: "/uploads/resumes/resume-2023.pdf",
            file_name: "my_resume_2023.pdf",
            isDefault: true,
            created_at: new Date().toISOString()
          },
          {
            resume_id: 2,
            user_id: userData.user_id,
            file_path: "/uploads/resumes/resume-for-tech.pdf",
            file_name: "resume_for_tech_roles.pdf",
            isDefault: false,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        
        setResumes(mockResumes)
      }
    }
    
    loadUserData()
  }, [])
  
  // Handle setting change
  const handleSettingChange = (key: string, value: string | boolean) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  const handleSave = () => {
    // In a real app, this would save to backend
    if (user) {
      const updatedUser = { 
        ...user, 
        username: userSettings.username,
        status: userSettings.status,
        program: userSettings.program
      }
      
      mockUserService.update(updatedUser)
      setUser(updatedUser)
      
      // Show saved indicator
      setSavedIndicator(true)
      setTimeout(() => setSavedIndicator(false), 2000)
    }
  }
  
  // Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // In a real app, you would upload to a server
    // For demo, we'll use a local URL
    const imageUrl = URL.createObjectURL(file)
    setProfileImage(imageUrl)
  }
  
  // Click handler for profile image upload button
  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }
  
  // Handle resume file upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setNewResumeFile(file)
  }
  
  // Upload resume
  const handleResumeUpload = () => {
    if (!newResumeFile || !user) return
    
    // In a real app, you would upload to a server
    // For demo, we'll add to the local state
    const newResume: Resume = {
      resume_id: resumes.length + 1,
      user_id: user.user_id,
      file_path: `/uploads/resumes/${newResumeFile.name}`,
      file_name: newResumeFile.name,
      isDefault: false,
      created_at: new Date().toISOString()
    }
    
    setResumes([...resumes, newResume])
    setNewResumeFile(null)
    
    // Clear the file input
    if (resumeInputRef.current) {
      resumeInputRef.current.value = ''
    }
  }
  
  // Set default resume
  const setDefaultResume = (resumeId: number) => {
    setResumes(resumes.map(resume => ({
      ...resume,
      isDefault: resume.resume_id === resumeId
    })))
  }
  
  // Delete resume
  const deleteResume = (resumeId: number) => {
    setResumes(resumes.filter(resume => resume.resume_id !== resumeId))
  }
  
  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-4">
            <CardHeader className="pb-3">
              <CardTitle>User Settings</CardTitle>
              <CardDescription>
                Manage your account information and resumes
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="w-full max-w-md">
                  <TabsTrigger value="profile" className="flex-1">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="resumes" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Resumes
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="profile" className="p-6 pt-3">
                <div className="space-y-6 max-w-3xl">
                  {/* Profile Image */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-2 border-gray-200">
                        <AvatarFallback className="text-xl bg-gray-100">
                          {user?.username.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                        {profileImage && <AvatarImage src={profileImage} alt={user?.username || 'User'} />}
                      </Avatar>
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={handleProfileImageClick}
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleProfileImageChange}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{user?.username || 'User'}</h3>
                      <p className="text-gray-500 text-sm">Update your profile picture</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={handleProfileImageClick}>
                        Change Photo
                      </Button>
                    </div>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Account Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={userSettings.username}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange("username", e.target.value)}
                          placeholder="Your username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Account Status</Label>
                        <div className="flex items-center h-10 space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="status-active"
                              name="status"
                              className="mr-2"
                              checked={userSettings.status === "active"}
                              onChange={() => handleSettingChange("status", "active")}
                            />
                            <Label htmlFor="status-active">Active</Label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="status-inactive"
                              name="status"
                              className="mr-2"
                              checked={userSettings.status === "inactive"}
                              onChange={() => handleSettingChange("status", "inactive")}
                            />
                            <Label htmlFor="status-inactive">Inactive</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="program">Program</Label>
                      <select 
                        id="program"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={userSettings.program}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSettingChange("program", e.target.value)}
                      >
                        <option value="foundations">Foundations</option>
                        <option value="101">101</option>
                        <option value="liftoff">Liftoff</option>
                        <option value="alumni">Alumni</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Password Change */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-base font-medium">Change Password</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={userSettings.password}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange("password", e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          value={userSettings.confirmPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange("confirmPassword", e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      disabled={!userSettings.password || userSettings.password !== userSettings.confirmPassword}
                    >
                      Update Password
                    </Button>
                    {userSettings.password && userSettings.password !== userSettings.confirmPassword && (
                      <p className="text-sm text-red-500">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resumes" className="p-6 pt-3">
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Your Resumes</h3>
                    <Button 
                      onClick={() => resumeInputRef.current?.click()}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-black"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Resume
                    </Button>
                    <input
                      type="file"
                      ref={resumeInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                    />
                  </div>
                  
                  {newResumeFile && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-medium mb-2">Ready to upload:</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-2" />
                          <span>{newResumeFile.name}</span>
                        </div>
                        <Button size="sm" onClick={handleResumeUpload}>
                          Upload
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {resumes.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No resumes uploaded</h3>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Upload your first resume to start applying for jobs
                      </p>
                      <Button 
                        onClick={() => resumeInputRef.current?.click()}
                        className="flex items-center mx-auto gap-2 bg-blue-500"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Resume
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-6">
                      {resumes.map(resume => (
                        <div 
                          key={resume.resume_id} 
                          className="border rounded-lg px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-gray-400" /> 
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">{resume.file_name}</h4>
                                {resume.isDefault && (
                                  <span className="ml-3 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Uploaded {new Date(resume.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!resume.isDefault && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-xs h-8"
                                onClick={() => setDefaultResume(resume.resume_id)}
                              >
                                Set as Default
                              </Button>
                            )}
                            <button 
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              onClick={() => deleteResume(resume.resume_id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-lg p-5 mt-8">
                    <h4 className="text-sm font-medium mb-2">Resume Tips</h4>
                    <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
                      <li>Keep your resume to one page for most positions</li>
                      <li>Highlight specific achievements rather than just responsibilities</li>
                      <li>Tailor your resume for different types of positions</li>
                      <li>Use keywords from the job descriptions</li>
                      <li>PDF format is recommended for most applications</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="border-t flex justify-between items-center p-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Changes
              </Button>
              
              <Button 
                size="sm"
                onClick={handleSave}
                style={{ backgroundColor: extendedPalette.primaryBlue }}
                className={savedIndicator ? "bg-green-500" : ""}
              >
                {savedIndicator ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
