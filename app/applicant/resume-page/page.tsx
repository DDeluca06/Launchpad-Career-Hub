"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { FileText, Upload, Trash2 } from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { userService, resumeService, User, Resume } from "@/lib/local-storage"

export default function ResumePage() {
  const [user, setUser] = useState<User | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadUserData = async () => {
      // Get current user or default to user with ID 2 (a non-admin)
      const currentUser = userService.getCurrentUser() || userService.getById(2);

      if (currentUser) {
        setUser(currentUser);

        // Load user's resumes from local storage
        const userResumes = resumeService.getByUserId(currentUser.user_id);
        setResumes(userResumes);
      }
    }

    loadUserData();
  }, []);

  // Handle resume file upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewResumeFile(file);
  }

  // Upload resume
  const handleResumeUpload = () => {
    if (!newResumeFile || !user) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(newResumeFile.type)) {
      // Show error message to user
      console.error("Invalid file type. Please upload a PDF or Word document.");
      return;
    }

    try {
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
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  }

  // Set default resume
  const setDefaultResume = (resumeId: number) => {
    try {
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
    } catch (error) {
      console.error("Error setting default resume:", error);
    }
  }

  // Delete resume
  const deleteResume = (resumeId: number) => {
    try {
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
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  }

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-500 mt-1">Upload and manage your resumes</p>
          </div>
        </div>

        <div className="space-y-4">
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
        </div>
      </div>
    </DashboardLayout>
  )
}
