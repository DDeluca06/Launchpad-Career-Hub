"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlay/dialog";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { ComboboxPopover } from "@/components/ui/form/combobox-popover";
import { Briefcase, Search, Building } from "lucide-react";
import { toast } from "@/components/ui/feedback/use-toast";
import { extendedPalette } from "@/lib/colors";

interface Job {
  job_id: number;
  title: string;
  company: string;
  location?: string;
  job_type?: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
}

interface JobRecommendationModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  adminId?: number;
}

export function JobRecommendationModal({ open, onClose, user, adminId }: JobRecommendationModalProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch jobs when modal opens
  useEffect(() => {
    if (open) {
      fetchJobs();
    }
  }, [open]);

  // Filter jobs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = jobs.filter(
      job => 
        job.title.toLowerCase().includes(lowerCaseSearch) ||
        job.company.toLowerCase().includes(lowerCaseSearch) ||
        (job.location && job.location.toLowerCase().includes(lowerCaseSearch))
    );
    
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs?archived=false');
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Transform the job data to match our interface
        const transformedJobs: Job[] = data.jobs.map((job: any) => ({
          job_id: job.job_id,
          title: job.title,
          company: job.company,
          location: job.location,
          job_type: job.job_type
        }));
        
        setJobs(transformedJobs);
        setFilteredJobs(transformedJobs);
      } else {
        throw new Error(data.error || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setSearchTerm(`${job.title} at ${job.company}`);
  };

  const handleRecommendJob = async () => {
    if (!selectedJob) {
      toast({
        title: "Error",
        description: "Please select a job to recommend.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          jobId: selectedJob.job_id,
          adminId: adminId,
          notes: notes
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create recommendation');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Job successfully recommended to ${user.firstName} ${user.lastName}.`,
        });
        onClose();
      } else {
        throw new Error(data.error || 'Failed to create recommendation');
      }
    } catch (error) {
      console.error('Error recommending job:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to recommend job.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatJobType = (type?: string) => {
    if (!type) return '';
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Recommend a Job</DialogTitle>
          <DialogDescription>
            Recommend a job to {user.firstName} {user.lastName}. This will appear in their referrals tab.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Search for a job</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by title, company, or location"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {searchTerm && !selectedJob && (
            <div className="border rounded-md max-h-[200px] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">Loading jobs...</div>
              ) : filteredJobs.length > 0 ? (
                <ul>
                  {filteredJobs.map(job => (
                    <li
                      key={job.job_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-start gap-2"
                      onClick={() => handleSelectJob(job)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <Building className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {job.location && <span>{job.location}</span>}
                          {job.job_type && (
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded-full">
                              {formatJobType(job.job_type)}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">No jobs found</div>
              )}
            </div>
          )}

          {selectedJob && (
            <div className="border rounded-md p-3 bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{selectedJob.title}</p>
                  <p className="text-sm text-gray-600">{selectedJob.company}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    {selectedJob.location && <span>{selectedJob.location}</span>}
                    {selectedJob.job_type && (
                      <span className="bg-white px-1.5 py-0.5 rounded-full border">
                        {formatJobType(selectedJob.job_type)}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedJob(null);
                    setSearchTerm("");
                  }}
                >
                  Change
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Notes (optional)</p>
            <Textarea
              placeholder="Add a personal note about why you're recommending this job..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleRecommendJob} 
            disabled={!selectedJob || isSubmitting}
            style={{ backgroundColor: extendedPalette.primaryBlue }}
          >
            {isSubmitting ? "Recommending..." : "Recommend Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 