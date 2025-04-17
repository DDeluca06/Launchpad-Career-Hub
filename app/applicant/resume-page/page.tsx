"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { FileText, Upload, Trash2 } from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { AuthContext } from "@/app/providers"
import { toast } from "sonner"

// Define Resume interface to match database schema
interface Resume {
  resume_id: number;
  user_id: number;
  file_path: string;
  file_name: string;
  is_default: boolean;
  created_at?: string | Date;
}

// Define user interface to match schema
interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export default function ResumePage() {
  const { session, loading: isAuthLoading } = useContext(AuthContext);
  const [resumes, setResumes] = useState<Resume[]>([])
  const [userData, setUserData] = useState<User | null>(null)
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Fetch user data and resumes
  useEffect(() => {
    if (isAuthLoading || !session?.user?.id) return;

    const loadUserData = async () => {
      try {
        setIsLoading(true);

        // First fetch user data
        const userResponse = await fetch(`/api/user?userId=${session.user?.id}`);
        const userData = await userResponse.json();

        if (userData.success && userData.user) {
          setUserData(userData.user);
        } else {
          console.error("Error loading user data:", userData.error);
          toast.error("Failed to load user profile");
        }

        // Then fetch resumes
        const resumesResponse = await fetch(`/api/resumes?userId=${session.user?.id}`);
        const resumesData = await resumesResponse.json();

        if (resumesData.success) {
          setResumes(resumesData.resumes);
        } else {
          console.error("Error loading resumes:", resumesData.error);
          toast.error("Failed to load resumes");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [session?.user?.id, isAuthLoading]);

  // Handle resume file upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewResumeFile(file);
  }

  // Upload resume
  const handleResumeUpload = async () => {
    if (!newResumeFile || !session?.user?.id) {
      toast.error("Please select a file to upload");
      return;
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(newResumeFile.type)) {
      toast.error("Invalid file type. Please upload a PDF or Word document.");
      return;
    }

    try {
      setIsLoading(true);

      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('file', newResumeFile);
      formData.append('userId', session.user?.id || '');
      formData.append('isDefault', resumes.length === 0 ? 'true' : 'false');

      // Upload the file and create resume record
      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update the UI
        setResumes(prev => [...prev, data.resume]);
        setNewResumeFile(null);
        toast.success("Resume uploaded successfully");

        // Clear the file input
        if (resumeInputRef.current) {
          resumeInputRef.current.value = '';
        }
      } else {
        toast.error(data.error || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
    } finally {
      setIsLoading(false);
    }
  }

  // Set default resume
  const setDefaultResume = async (resumeId: number) => {
    try {
      setIsLoading(true);

      // Update resume in the database
      const response = await fetch('/api/resumes/default', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resumeId,
          user_id: session?.user?.id ? parseInt(session.user.id) : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update UI
        setResumes(prev => prev.map(resume => ({
          ...resume,
          is_default: resume.resume_id === resumeId
        })));
        toast.success("Default resume updated");
      } else {
        toast.error(data.error || "Failed to update default resume");
      }
    } catch (error) {
      console.error("Error setting default resume:", error);
      toast.error("Failed to update default resume");
    } finally {
      setIsLoading(false);
    }
  }

  // Delete resume
  const deleteResume = async (resumeId: number) => {
    try {
      setIsLoading(true);

      // Delete from database
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Update UI
        setResumes(prev => {
          const updatedResumes = prev.filter(resume => resume.resume_id !== resumeId);

          // If we deleted the default resume and have other resumes, set the first one as default
          if (updatedResumes.length > 0 && !updatedResumes.some(r => r.is_default)) {
            updatedResumes[0].is_default = true;
          }

          return updatedResumes;
        });
        toast.success("Resume deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    } finally {
      setIsLoading(false);
    }
  }

  // Render loading state or empty component if no session
  if (!session) {
    return (
      <DashboardLayout>
        <div className="container py-6 px-4 mx-auto">
          <div className="text-center py-8">
            <div className="animate-pulse flex space-x-4 justify-center">
              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1 max-w-xs">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Determine the content to display for resumes list
  let resumesContent;
  if (isLoading && resumes.length === 0) {
    resumesContent = (
      <div className="text-center py-8">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1 max-w-xs">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (resumes.length === 0) {
    resumesContent = (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-gray-600 mb-1">No resumes uploaded yet</h3>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          You don&apos;t have any resumes uploaded. Add a resume to apply for jobs more quickly.
        </p>
      </div>
    );
  } else {
    resumesContent = (
      <div className="divide-y">
        {resumes.map((resume) => (
          <div key={resume.resume_id} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-gray-400" />
              <div>
                <p className="font-medium">{resume.file_name}</p>
                <p className="text-xs text-gray-500">
                  Uploaded on {new Date(resume.created_at || '').toLocaleDateString()}
                </p>
              </div>
              {resume.is_default && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!resume.is_default && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDefaultResume(resume.resume_id)}
                  disabled={isLoading}
                >
                  Set as Default
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteResume(resume.resume_id)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-500 mt-1">
              {userData ? `${userData.first_name} ${userData.last_name} (${userData.email})` : 'Loading user profile...'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Resumes</CardTitle>
              <CardDescription>Upload and manage your resumes for job applications</CardDescription>
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
                        disabled={isLoading}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resumeInputRef.current?.click()}
                        disabled={isLoading}
                      >
                        Browse Files
                      </Button>
                      {newResumeFile && (
                        <Button
                          size="sm"
                          onClick={handleResumeUpload}
                          style={{ backgroundColor: extendedPalette.primaryBlue }}
                          disabled={isLoading}
                        >
                          {isLoading ? "Uploading..." : "Upload Resume"}
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
                  {resumesContent}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}