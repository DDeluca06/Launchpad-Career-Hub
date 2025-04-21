"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlay/dialog";
import { Button } from "@/components/ui/basic/button";
import { Label } from "@/components/ui/basic/label";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { UIJob } from "./JobsList";
import { toast } from "sonner";
import { CheckCircle2, Loader2, FileText, ExternalLink } from "lucide-react";
import { AuthContext } from "@/app/providers";
import Link from "next/link";

export interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
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
  onSubmit: (resumeId: number, coverLetter: string, idealCandidate: string) => void;
}

export default function ApplyModal({ 
  open, 
  onClose, 
  job, 
  currentUser, 
  onSubmit 
}: ApplyModalProps) {
  const { session } = useContext(AuthContext);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    coverLetter: "",
    idealCandidate: ""
  });

  // Initialize user data from currentUser
  useEffect(() => {
    if (currentUser) {
      setApplicationData({
        firstName: currentUser.first_name || "",
        lastName: currentUser.last_name || "",
        email: currentUser.email || "",
        coverLetter: "",
        idealCandidate: ""
      });
    }
  }, [currentUser]);

  // Fetch user resumes from the API
  const fetchUserResumes = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoadingResumes(true);
      const response = await fetch(`/api/resumes?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setUserResumes(data.resumes);
        
        // Auto-select default resume if available
        if (data.resumes.length > 0) {
          const defaultResume = data.resumes.find((resume: Resume) => resume.is_default);
          setSelectedResumeId(defaultResume?.resume_id || data.resumes[0].resume_id);
        }
      } else {
        console.error("Error loading resumes:", data.error);
        toast.error("Failed to load your resumes");
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast.error("Failed to load your resumes");
    } finally {
      setIsLoadingResumes(false);
    }
  }, [session?.user?.id]);

  // Fetch resumes when modal opens
  useEffect(() => {
    if (open && session?.user?.id) {
      // Reset states when modal opens
      setIsSubmitting(false);
      setIsSuccess(false);
      
      // Fetch resumes from the resume page API
      fetchUserResumes();
    }
  }, [open, session?.user?.id, fetchUserResumes]);

  const handleSubmit = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call the onSubmit function provided by parent
      await onSubmit(
        selectedResumeId, 
        applicationData.coverLetter,
        applicationData.idealCandidate
      );
      
      // Show success state
      setIsSuccess(true);
      
      // Close modal after a delay to show success message
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!job) return null;

  // If application was successful, show success message
  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md text-center">
          <div className="py-10 flex flex-col items-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-6">
              Your application for {job.title} at {job.company} has been successfully submitted.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Complete the application for {job.company}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input 
                id="first-name" 
                placeholder="John"
                value={applicationData.firstName}
                onChange={(e) => setApplicationData({...applicationData, firstName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input 
                id="last-name" 
                placeholder="Doe"
                value={applicationData.lastName}
                onChange={(e) => setApplicationData({...applicationData, lastName: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="you@example.com"
              value={applicationData.email}
              onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
            />
          </div>
          
          <div>
            <Label>Resume</Label>
            {isLoadingResumes ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading resumes...
              </div>
            ) : userResumes.length > 0 ? (
              <div className="space-y-2">
                {userResumes.map((resume) => (
                  <div key={resume.resume_id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`resume-${resume.resume_id}`}
                      name="resume"
                      value={resume.resume_id}
                      checked={selectedResumeId === resume.resume_id}
                      onChange={() => setSelectedResumeId(resume.resume_id)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={`resume-${resume.resume_id}`} className="flex items-center gap-2 cursor-pointer">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {resume.file_name}
                      {resume.is_default && <span className="text-xs text-blue-600">(Default)</span>}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No resumes found. Please{" "}
                <Link href="/applicant/profile" className="text-blue-600 hover:underline">
                  upload a resume
                </Link>{" "}
                first.
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="cover-letter">Cover Letter</Label>
            <Textarea 
              id="cover-letter"
              placeholder="Write a brief cover letter explaining why you're a great fit for this role..."
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
              className="h-32"
            />
          </div>
          
          <div>
            <Label htmlFor="ideal-candidate">Why are you an ideal candidate?</Label>
            <Textarea 
              id="ideal-candidate"
              placeholder="Describe how your skills and experience match the job requirements..."
              value={applicationData.idealCandidate}
              onChange={(e) => setApplicationData({...applicationData, idealCandidate: e.target.value})}
              className="h-32"
            />
          </div>
        </div>
        
        <DialogFooter>
          {job.application_url ? (
            <Button 
              variant="outline" 
              onClick={() => window.open(job.application_url, '_blank')}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              Apply Externally <ExternalLink className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !selectedResumeId}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>Submit Application</>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
