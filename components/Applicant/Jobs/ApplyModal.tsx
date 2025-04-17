"use client";

import { useState, useEffect, useContext } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlay/dialog";
import { Button } from "@/components/ui/basic/button";
import { Label } from "@/components/ui/basic/label";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { UIJob } from "./JobsList";
import { toast } from "sonner";
import { AuthContext } from "@/app/providers";

export interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface Resume {
  resume_id: number;
  user_id: number;
  file_path: string;
  file_name: string;
  is_default: boolean;
  created_at?: string | Date;
}

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  job: UIJob | null;
  currentUser: UserProfile | null;
  userResumes: Resume[];
  isLoadingResumes: boolean;
  onSubmit: (resumeId: number, coverLetter: string, idealCandidate: string) => void;
}

export default function ApplyModal({ 
  open, 
  onClose, 
  job, 
  currentUser, 
  userResumes: initialResumes, 
  isLoadingResumes: initialLoading, 
  onSubmit 
}: ApplyModalProps) {
  // Get session from AuthContext
  const { session } = useContext(AuthContext);
  
  // Add this to the top of your component
const [debugInfo, setDebugInfo] = useState({
  calledFetch: false,
  user_id: null,
  apiResponse: null,
  error: null
});
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [userResumes, setUserResumes] = useState<Resume[]>(initialResumes);
  const [isLoadingResumes, setIsLoadingResumes] = useState(initialLoading);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
    idealCandidate: ""
  });

  // Fetch user data and resumes when modal opens
  // Modify your useEffect
useEffect(() => {
  console.log("useEffect triggered. Open:", open, "CurrentUser:", currentUser);
  console.log("Initial resumes:", initialResumes);
  
  if (open && currentUser) {
    // Set user data from currentUser if available
    setUserData(currentUser);
    setApplicationData({
      firstName: currentUser.first_name || "",
      lastName: currentUser.last_name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      coverLetter: "",
      idealCandidate: ""
    });
    
    // If we have initial resumes, use them, otherwise fetch from database
    if (initialResumes.length > 0) {
      console.log("Using initial resumes:", initialResumes);
      setUserResumes(initialResumes);
      const defaultResume = initialResumes.find(resume => resume.is_default);
      setSelectedResumeId(defaultResume?.resume_id || initialResumes[0].resume_id);
    } else if (session?.user?.id) {
      console.log("No initial resumes, fetching from database using session user ID:", session.user.id);
      setDebugInfo(prev => ({ ...prev, calledFetch: true, user_id: session.user.id }));
      fetchUserResumes(currentUser.user_id); // userId param will be ignored, using session
    } else {
      console.error("No session user ID available for fetching resumes");
      toast.error("Authentication error. Please try again.");
    }
  }
}, [open, currentUser, initialResumes, session]);


  // Fetch user resumes from database
  // Enhance the fetchUserResumes function with more debugging
const fetchUserResumes = async (userId: number) => {
  console.log("fetchUserResumes called with userId:", userId);
  try {
    setIsLoadingResumes(true);
    const apiUrl = `/api/resumes?userId=${session?.user?.id}`;
    console.log("Fetching from URL:", apiUrl);
    
    const response = await fetch(apiUrl);
    console.log("API Response status:", response.status);
    
    const data = await response.json();
    console.log("API Response data:", data);
    setDebugInfo(prev => ({ ...prev, apiResponse: data }));
    
    if (data.success) {
      console.log("Resume data retrieved successfully. Count:", data.resumes?.length || 0);
      setUserResumes(data.resumes);
      
      // Auto-select default resume if available
      if (data.resumes.length > 0) {
        const defaultResume = data.resumes.find((resume: Resume) => resume.is_default);
        setSelectedResumeId(defaultResume?.resume_id || data.resumes[0].resume_id);
      }
    } else {
      console.error("Error loading resumes:", data.error);
      setDebugInfo(prev => ({ ...prev, error: data.error }));
      toast.error("Failed to load your resumes");
    }
  } catch (error) {
    console.error("Error fetching resumes:", error);
    setDebugInfo(prev => ({ ...prev, error: error.message }));
    toast.error("Failed to load your resumes");
  } finally {
    setIsLoadingResumes(false);
  }
};

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume");
      return;
    }
    
    if (!applicationData.email) {
      toast.error("Email is required");
      return;
    }
    
    onSubmit(
      selectedResumeId, 
      applicationData.coverLetter,
      applicationData.idealCandidate
    );
  };

  // Redirect to resume upload page if no resumes
  const handleAddResume = () => {
    // Close the current modal
    onClose();
    
    // Navigate to the resume upload page
    window.location.href = "/applicant/resume-page";
  };

  if (!job) return null;

  // Add this right before the return statement
console.log("Component render state:", {
  open,
  job: job?.title,
  currentUser: currentUser?.user_id,
  sessionUser: session?.user?.id,
  userResumes: userResumes.length,
  isLoadingResumes,
  selectedResumeId,
  debugInfo
});

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-3 text-xs border rounded mb-4 sticky top-0 z-10">
            <div>Debug Info:</div>
            <div>Called Fetch: {debugInfo.calledFetch ? 'Yes' : 'No'}</div>
            <div>User ID from props: {currentUser?.user_id}</div>
            <div>User ID from session: {session?.user?.id}</div>
            <div>API Response: {debugInfo.apiResponse ? 'Received' : 'None'}</div>
            <div>Error: {debugInfo.error || 'None'}</div>
            <div>Resumes Count: {userResumes.length}</div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Complete the application for {job.company}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input 
                id="first-name" 
                placeholder="John"
                value={applicationData.firstName}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input 
                id="last-name" 
                placeholder="Doe"
                value={applicationData.lastName}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="john.doe@example.com"
              value={applicationData.email}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email from your account profile</p>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="(123) 456-7890"
              value={applicationData.phone}
              onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="resume" className="flex justify-between">
              <span>Resume</span>
              {userResumes.length === 0 && !isLoadingResumes && (
                <Button 
                  variant="link" 
                  onClick={handleAddResume} 
                  className="text-xs p-0 h-auto"
                >
                  Upload a Resume
                </Button>
              )}
            </Label>
            {isLoadingResumes ? (
              <div className="w-full h-10 rounded-md bg-gray-100 animate-pulse flex items-center justify-center">
                <span className="text-sm text-gray-500">Loading your resumes...</span>
              </div>
            ) : userResumes.length > 0 ? (
              <select
                id="resume"
                value={selectedResumeId || ""}
                onChange={(e) => setSelectedResumeId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="">Select a resume</option>
                {userResumes.map((resume) => (
                  <option key={resume.resume_id} value={resume.resume_id}>
                    {resume.file_name} {resume.is_default ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-red-500 border border-red-200 rounded-md p-2 bg-red-50">
                No resumes found. Please upload a resume to apply for jobs.
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
            <Textarea 
              id="cover-letter" 
              placeholder="Write your cover letter here..."
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
              className="min-h-[150px]"
            />
            <p className="text-xs text-gray-500 mt-1">Explain why you're interested in this position</p>
          </div>
          
          <div>
            <Label htmlFor="ideal-candidate">Why are you the ideal candidate for this role?</Label>
            <Textarea 
              id="ideal-candidate" 
              placeholder="Describe why you are the perfect fit for this position..."
              value={applicationData.idealCandidate}
              onChange={(e) => setApplicationData({...applicationData, idealCandidate: e.target.value})}
            />
          </div>
        </div>
        
        <DialogFooter className="sticky bottom-0 bg-background pt-2 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!selectedResumeId || userResumes.length === 0}
          >
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}