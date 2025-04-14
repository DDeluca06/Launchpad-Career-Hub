"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlay/dialog";
import { Button } from "@/components/ui/basic/button";
import { Label } from "@/components/ui/basic/label";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { UIJob } from "./JobsList";

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
  userResumes, 
  isLoadingResumes, 
  onSubmit 
}: ApplyModalProps) {
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
    idealCandidate: ""
  });

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

  useEffect(() => {
    if (open && userResumes.length > 0) {
      const defaultResume = userResumes.find(resume => resume.is_default);
      setSelectedResumeId(defaultResume?.resume_id || userResumes[0].resume_id);
    }
  }, [open, userResumes]);

  const handleSubmit = () => {
    if (!selectedResumeId) {
      return;
    }
    
    onSubmit(
      selectedResumeId, 
      applicationData.coverLetter,
      applicationData.idealCandidate
    );
  };

  if (!job) return null;

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
            <Label htmlFor="resume">Resume</Label>
            {isLoadingResumes ? (
              <span className="text-sm text-gray-500">Loading your resumes...</span>
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
              <div className="text-sm text-gray-500">
                No resumes found. Please upload a resume in your profile settings.
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 