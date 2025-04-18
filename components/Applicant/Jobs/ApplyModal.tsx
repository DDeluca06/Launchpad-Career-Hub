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
    phone: "",
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
        phone: currentUser.phone || "",
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
                onChange={(e) => setApplicationData({...applicationData, lastName: e.target.value})}
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
              onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
            />
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
              <Link 
                href="/applicant/resume-page" 
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                target="_blank"
              >
                <span>Manage Resumes</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Label>
            {isLoadingResumes ? (
              <div className="flex items-center space-x-2 h-10">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">Loading your resumes...</span>
              </div>
            ) : userResumes.length > 0 ? (
              <div className="space-y-2">
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
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-1 text-gray-400" />
                  <span>
                    {selectedResumeId 
                      ? userResumes.find(r => r.resume_id === selectedResumeId)?.file_name 
                      : "No resume selected"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="border border-yellow-200 bg-yellow-50 p-3 rounded-md">
                <p className="text-sm text-yellow-700 mb-2">
                  No resumes found. Please upload a resume to apply for jobs.
                </p>
                <Link href="/applicant/resume-page">
                  <Button size="sm" variant="outline" className="text-xs">
                    Upload Resume
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
            <Input 
              id="cover-letter" 
              type="file"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-xs text-gray-500 mt-1">Upload your cover letter (PDF, DOC, or DOCX)</p>
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedResumeId || userResumes.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
