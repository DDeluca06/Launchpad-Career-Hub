"use client";

import { useState, Suspense, useEffect, useContext } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlay/dialog";
import { 
  Briefcase, 
  Bookmark,
  BookmarkPlus,
  CheckCircle2,
  Clock, 
  FileText,
  FilterX,
  Globe, 
  Info,
  MapPin, 
  RefreshCw,
  Search, 
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/basic/badge";
import { Label } from "@/components/ui/basic/label";
import { Textarea } from "@/components/ui/form/textarea";
import { Checkbox } from "@/components/ui/form/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/data-display/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AuthContext } from "@/app/providers";
import { useRouter } from "next/navigation";

// Types
interface UIJob {
  id: string;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  experienceLevel: string;
  salary: string;
  description?: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  postedDate?: string;
  applicationDeadline: string;
  companyLogoUrl: string;
  industry: string;
  isRemote: boolean;
  partner?: {
    name: string;
    industry?: string | null;
    location?: string | null;
  } | null;
  applicationCount?: number;
}

interface JobFilter {
  type: keyof FilterOptions;
  value: string | boolean;
}

interface FilterOptions {
  jobType: string[];
  experienceLevel: string[];
  location: string[];
  isRemote: boolean | null;
  industry: string[];
  showSavedOnly: boolean;
  hideAppliedJobs: boolean;
}

// Application tracking interfaces
interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogoUrl: string;
  appliedDate: string;
  status: 'submitted' | 'reviewing' | 'interviewing' | 'offered' | 'accepted' | 'rejected';
  notes?: string;
  nextSteps?: string;
  interviewDate?: string;
}

// Resume interface
interface Resume {
  resume_id: number;
  user_id: number;
  file_path: string;
  file_name: string;
  is_default: boolean;
  created_at?: string | Date;
}

// User Profile interface
interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

// Skeleton loader for job listings
function JobListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-3 border rounded-md">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton loader for job details
function JobDetailsSkeleton() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">
          <Skeleton className="h-6 w-3/4" />
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-yellow-500"
        >
          <Bookmark className="h-5 w-5 fill-current" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden">
          <Skeleton className="h-16 w-16 rounded-md" />
        </div>
        <div>
          <h3 className="font-medium text-lg">
            <Skeleton className="h-4 w-3/4" />
          </h3>
          <span className="text-gray-500 block">
            <Skeleton className="h-3 w-1/2" />
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Job Type</p>
          <span className="font-medium block">
            <Skeleton className="h-4 w-3/4" />
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Experience</p>
          <span className="font-medium block">
            <Skeleton className="h-4 w-3/4" />
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Salary Range</p>
          <span className="font-medium block">
            <Skeleton className="h-4 w-3/4" />
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Deadline</p>
          <span className="font-medium block">
            <Skeleton className="h-4 w-3/4" />
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Job Description</h3>
        <div className="text-gray-700">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-full mt-2" />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Responsibilities</h3>
        <ul className="list-disc pl-4 space-y-1">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="text-gray-700">
              <Skeleton className="h-4 w-full" />
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Qualifications</h3>
        <ul className="list-disc pl-4 space-y-1">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="text-gray-700">
              <Skeleton className="h-4 w-full" />
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Benefits</h3>
        <ul className="list-disc pl-4 space-y-1">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="text-gray-700">
              <Skeleton className="h-4 w-full" />
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8">
        <Button 
          className="w-full md:w-auto"
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
}

export default function JobsPage() {
  // State
  const { session, loading: isAuthLoading } = useContext(AuthContext);
  const [jobs, setJobs] = useState<UIJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<UIJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<UIJob | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    jobType: [],
    experienceLevel: [],
    location: [],
    isRemote: null,
    industry: [],
    showSavedOnly: false,
    hideAppliedJobs: true,
  });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
    idealCandidate: ""
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [quickViewJob, setQuickViewJob] = useState<UIJob | null>(null);

  // Create a mapping between dashboard Kanban columns and job application statuses to maintain consistency
  const DASHBOARD_TO_APPLICATION_STATUS: Record<string, Application['status']> = {
    'interested': 'submitted',
    'applied': 'submitted',  
    'interview': 'interviewing',
    'offer': 'offered',
    'accepted': 'accepted',
    'rejected': 'rejected'
  };

  // Load data from database
  useEffect(() => {
    if (isAuthLoading) return;
    
    const loadData = async () => {
      setLoading(true);
      
      // Get current user from session
      if (session?.user?.id) {
        try {
          const userResponse = await fetch(`/api/profile?userId=${session.user.id}`);
          const userData = await userResponse.json();
          
          if (userData.success) {
            setCurrentUser(userData.profile);
            
            // If profile exists, populate the form with profile data
            setApplicationData(prev => ({
              ...prev,
              firstName: userData.profile.first_name || "",
              lastName: userData.profile.last_name || "",
              email: userData.profile.email || "",
              phone: userData.profile.phone || ""
            }));
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
      
      // Load jobs from database
      try {
        const response = await fetch("/api/jobs");
        const data = await response.json();
        
        if (data.success) {
          // Transform jobs to match the UI format
          const transformedJobs: UIJob[] = data.jobs.map((job: {
            job_id: number;
            title: string;
            company?: string;
            location?: string;
            job_type?: string;
            tags?: string[];
            description?: string;
            created_at?: string;
            partners?: {
              name: string;
              industry?: string | null;
              location?: string | null;
            } | null;
            _count?: {
              applications?: number;
            };
          }) => {
            const experienceLevel = job.tags?.includes("SENIOR") ? "Senior" : job.tags?.includes("MID_LEVEL") ? "Mid-level" : "Entry-level";
            return {
              id: job.job_id.toString(),
              title: job.title,
              company: job.company || job.partners?.name || "Unknown Company",
              location: job.location || "Remote",
              jobType: job.job_type,
              experienceLevel,
              salary: "$80,000 - $150,000", // Mock salary since it's not in the schema
              description: job.description,
              responsibilities: [
                "Design and implement features",
                "Write clean, maintainable code",
                "Collaborate with cross-functional teams",
                "Ensure technical feasibility of designs",
                "Optimize for performance"
              ],
              qualifications: job.tags || ["JavaScript", "React", "TypeScript"],
              benefits: [
                "Competitive salary",
                "Health insurance",
                "Flexible work hours",
                "Professional development",
                "Remote work options"
              ],
              postedDate: job.created_at ? new Date(job.created_at).toISOString() : new Date().toISOString(),
              applicationDeadline: job.created_at 
                ? new Date(new Date(job.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              companyLogoUrl: "https://placehold.co/150",
              industry: job.tags?.[0] || "Technology",
              isRemote: job.location?.toLowerCase().includes("remote") || job.tags?.includes("FULLY_REMOTE") || false,
              partner: job.partners ? {
                name: job.partners.name,
                industry: job.partners.industry,
                location: job.partners.location
              } : null,
              applicationCount: job._count?.applications || 0
            };
          });
          
          setJobs(transformedJobs);
          setFilteredJobs(transformedJobs);
          
          if (transformedJobs.length > 0) {
            setSelectedJob(transformedJobs[0]);
          }
        } else {
          console.error("Error loading jobs:", data.error);
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
      }
      
      // Load user's applications if user is logged in
      if (session?.user?.id) {
        fetchUserApplications();
      }
      
      // Load user's resumes if user is logged in
      if (session?.user?.id) {
        try {
          setIsLoadingResumes(true);
          const userResumesResponse = await fetch(`/api/resumes?userId=${session.user.id}`);
          const userResumesData = await userResumesResponse.json();
          
          if (userResumesData.success && Array.isArray(userResumesData.resumes)) {
            setUserResumes(userResumesData.resumes);
            
            if (userResumesData.resumes.length > 0) {
              const defaultResume = userResumesData.resumes.find((resume: Resume) => resume.is_default);
              setSelectedResumeId(defaultResume?.resume_id || userResumesData.resumes[0].resume_id);
            }
          } else {
            console.error("Error loading resumes or invalid data format:", userResumesData.error || "No resumes found");
            setUserResumes([]);
          }
        } catch (error) {
          console.error("Error loading resumes:", error);
          setUserResumes([]);
        } finally {
          setIsLoadingResumes(false);
        }
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [session, isAuthLoading]);

  // Add a new effect to refresh saved jobs whenever the user returns to the page
  useEffect(() => {
    // Only run this if the user is logged in and we have successfully loaded the jobs
    if (session?.user?.id && !loading && !isAuthLoading) {
      // If the tab is "jobs", refresh the saved jobs
      if (activeTab === "jobs") {
        fetchUserApplications();
      }
    }
  }, [activeTab, session, loading, isAuthLoading]);

  // Handle the jobId parameter when navigating from the dashboard
  useEffect(() => {
    // Extract jobId from URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const jobId = queryParams.get('jobId');
    
    // If jobId is present and jobs are loaded
    if (jobId && jobs.length > 0 && !loading) {
      // Find the job with the matching ID
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        // Select the job and ensure we're on the jobs tab
        setSelectedJob(job);
        setActiveTab('jobs');
        
        // Remove the query parameter from the URL to avoid issues with browser refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [jobs, loading]);

  // Map backend database status to UI status aligned with dashboard Kanban columns
  const mapStatusToUI = (status: string): Application['status'] => {
    // First map the database status to dashboard Kanban column
    let dashboardStatus: string;
    switch (status) {
      case "INTERESTED": dashboardStatus = 'interested'; break;
      case "APPLIED": dashboardStatus = 'applied'; break;
      case "PHONE_SCREENING": 
      case "INTERVIEW_STAGE": 
      case "FINAL_INTERVIEW_STAGE": dashboardStatus = 'interview'; break;
      case "OFFER_EXTENDED": 
      case "NEGOTIATION": dashboardStatus = 'offer'; break;
      case "OFFER_ACCEPTED": dashboardStatus = 'accepted'; break;
      case "REJECTED": dashboardStatus = 'rejected'; break;
      default: dashboardStatus = 'interested';
    }
    
    // Then map the dashboard status to application status
    return DASHBOARD_TO_APPLICATION_STATUS[dashboardStatus] || 'submitted';
  };

  // Fetch user applications to keep the list in sync with the database
  const fetchUserApplications = async () => {
    if (!session?.user?.id) return;
    
    try {
      console.log("Fetching applications for user ID:", session.user.id);
      const userApplicationsResponse = await fetch(`/api/applications?userId=${session.user.id}`);
      const userApplicationsData = await userApplicationsResponse.json();
      
      if (userApplicationsData.success) {
        console.log("Applications data:", userApplicationsData.applications);
        
        // Load user's saved jobs (INTERESTED status means saved)
        const savedJobIds = userApplicationsData.applications
          .filter((app: { status: string; job_id: number }) => app.status === "INTERESTED")
          .map((app: { job_id: number }) => app.job_id.toString());
        
        // Track jobs the user has already applied for (any status except INTERESTED)
        const appliedJobIds = userApplicationsData.applications
          .filter((app: { status: string; job_id: number }) => app.status !== "INTERESTED")
          .map((app: { job_id: number }) => app.job_id.toString());
        
        console.log("Saved job IDs:", savedJobIds);
        console.log("Applied job IDs:", appliedJobIds);
        
        setSavedJobs(savedJobIds);
        setAppliedJobs(appliedJobIds);
        
        // Transform applications to match UI format - but exclude INTERESTED status
        // as these are shown separately in saved jobs
        const transformedApplications: Application[] = userApplicationsData.applications
          .filter((app: { status: string }) => app.status !== "INTERESTED")
          .map((app: {
            application_id: number;
            job_id: number;
            jobs: {
              title: string;
              company: string;
            };
            applied_at: string;
            status: string;
            notes?: string;
          }) => {
            return {
              id: app.application_id.toString(),
              jobId: app.job_id.toString(),
              jobTitle: app.jobs.title,
              company: app.jobs.company,
              companyLogoUrl: "https://placehold.co/150",
              appliedDate: app.applied_at ? new Date(app.applied_at).toISOString() : new Date().toISOString(),
              status: mapStatusToUI(app.status),
              notes: app.notes || "",
              nextSteps: app.status === "INTERVIEW_STAGE" ? "Interview scheduled" : "",
              interviewDate: app.status === "INTERVIEW_STAGE" ? 
                new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
            };
          });
        
        setApplications(transformedApplications);
        
        // Reapply filters to ensure accurate display
        applyFilters(jobs, filterOptions);
      }
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  // Add effect to reload application data when notes are updated
  useEffect(() => {
    if (selectedApplication?.id) {
      // Refresh applications to get updated notes
      fetchUserApplications();
    }
  }, [selectedApplication?.notes]);

  // Update the handleSearch function to preserve notes when filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Always keep the applications data consistent
    if (value.trim() === "") {
      fetchUserApplications();
    }
    
    // Filter jobs based on search
    if (!value.trim()) {
      applyFilters(jobs, filterOptions);
      return;
    }
    
    const searchResults = jobs.filter(job => 
      job.title.toLowerCase().includes(value.toLowerCase()) ||
      job.company.toLowerCase().includes(value.toLowerCase()) ||
      job.description?.toLowerCase().includes(value.toLowerCase())
    );
    
    applyFilters(searchResults, filterOptions);
  };

  const handleFilterChange = (filter: JobFilter) => {
    const updatedFilters = { ...filterOptions };
    
    if (filter.type === 'isRemote') {
      updatedFilters.isRemote = filter.value as boolean;
    } else {
      const values = updatedFilters[filter.type] as string[];
      const index = values.indexOf(filter.value as string);
      
      if (index === -1) {
        values.push(filter.value as string);
      } else {
        values.splice(index, 1);
      }
    }
    
    setFilterOptions(updatedFilters);
    applyFilters(jobs, updatedFilters);
  };

  const applyFilters = (jobsToFilter: UIJob[], filters: FilterOptions) => {
    let results = [...jobsToFilter];
    
    // Apply saved jobs filter first if enabled
    if (filters.showSavedOnly) {
      results = results.filter(job => savedJobs.includes(job.id));
    }
    
    // Hide jobs the user has already applied for if enabled
    if (filters.hideAppliedJobs) {
      results = results.filter(job => !appliedJobs.includes(job.id));
    }
    
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.jobType.length > 0) {
      results = results.filter(job => filters.jobType.includes(job.jobType || ""));
    }
    
    if (filters.experienceLevel.length > 0) {
      results = results.filter(job => filters.experienceLevel.includes(job.experienceLevel));
    }
    
    if (filters.location.length > 0) {
      results = results.filter(job => filters.location.includes(job.location || ""));
    }
    
    if (filters.industry.length > 0) {
      results = results.filter(job => filters.industry.includes(job.industry));
    }
    
    if (filters.isRemote !== null) {
      results = results.filter(job => job.isRemote === filters.isRemote);
    }
    
    setFilteredJobs(results);
  };

  const toggleSavedJobsFilter = () => {
    const updatedFilters = { 
      ...filterOptions,
      showSavedOnly: !filterOptions.showSavedOnly 
    };
    setFilterOptions(updatedFilters);
    applyFilters(jobs, updatedFilters);
  };

  const toggleHideAppliedJobsFilter = () => {
    const updatedFilters = { 
      ...filterOptions,
      hideAppliedJobs: !filterOptions.hideAppliedJobs 
    };
    setFilterOptions(updatedFilters);
    applyFilters(jobs, updatedFilters);
  };

  const resetFilters = () => {
    setFilterOptions({
      jobType: [],
      experienceLevel: [],
      location: [],
      isRemote: null,
      industry: [],
      showSavedOnly: false,
      hideAppliedJobs: true,
    });
    setSearchTerm("");
    setFilteredJobs(jobs.filter(job => !appliedJobs.includes(job.id)));
  };

  const toggleSaveJob = (jobId: string) => {
    if (!currentUser) {
      toast.error("Please log in to save jobs");
      return;
    }
    
    const numericJobId = parseInt(jobId);
    
    // Update local state
    setSavedJobs(prevSavedJobs => {
      const isCurrentlySaved = prevSavedJobs.includes(jobId);
      
      if (isCurrentlySaved) {
        // Use our new endpoint to remove saved job by job_id
        fetch(`/api/applications/job/${numericJobId}?userId=${currentUser.user_id}`, {
          method: "DELETE",
        })
        .then(async response => {
          const data = await response.json();
          
          if (response.ok && data.success) {
            toast.success("Job removed from saved jobs");
            // Refresh applications to sync with Kanban board
            fetchUserApplications();
            
            // If showing saved only, reapply filters to remove this job
            if (filterOptions.showSavedOnly) {
              applyFilters(jobs, filterOptions);
            }
          } else {
            toast.error(data.error || "Failed to remove job from saved jobs");
          }
        })
        .catch(error => {
          console.error("Error removing saved job:", error);
          toast.error("Error removing job from saved jobs");
        });
        
        return prevSavedJobs.filter(id => id !== jobId);
      } else {
        // Add to saved jobs with INTERESTED status to show in Kanban
        const selectedJob = jobs.find(job => job.id === jobId);
        
        if (!selectedJob) {
          toast.error("Job not found");
          return prevSavedJobs;
        }
        
        // Add the job position to match the API expectation
        fetch("/api/applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parseInt(currentUser.user_id.toString()),
            job_id: numericJobId,
            status: "INTERESTED", // Use INTERESTED status to show in Kanban
            position: selectedJob.title
          }),
        })
        .then(async response => {
          const data = await response.json();
          
          if (response.ok && data.success) {
            toast.success("Job saved to your dashboard");
            // Refresh applications to sync with Kanban board
            fetchUserApplications();
          } else {
            // Handle the case where the job might already be saved
            if (data.error && data.error.includes("already applied")) {
              toast.info("This job is already in your dashboard");
            } else {
              toast.error(data.error || "Failed to save job");
            }
          }
        })
        .catch(error => {
          console.error("Error saving job:", error);
          toast.error("Error saving job");
        });
        
        return [...prevSavedJobs, jobId];
      }
    });
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.includes(jobId);
  };

  const openApplyModal = (job: UIJob) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  // Submit job application
  const handleSubmitApplication = async () => {
    if (!selectedJob || !currentUser || !selectedResumeId) return;
    
    try {
      // Create a new application
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          job_id: parseInt(selectedJob.id), // Convert string id to number
          status: "APPLIED",
          resume_id: selectedResumeId,
          position: selectedJob.title,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to create application");
      }
      
      const newApplication = data.application;
      
      // Save or update user profile information
      if (currentUser) {
        await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.user_id,
            firstName: applicationData.firstName,
            lastName: applicationData.lastName,
            email: applicationData.email,
            phone: applicationData.phone
          }),
        });
      }
      
      // Create a UI representation of the application
      const newUIApplication: Application = {
        id: newApplication.application_id.toString(),
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        companyLogoUrl: selectedJob.companyLogoUrl || "https://placehold.co/150",
        appliedDate: newApplication.applied_at ? new Date(newApplication.applied_at).toISOString() : new Date().toISOString(),
        status: "submitted",
        notes: applicationData.idealCandidate
      };
      
      // Update local state
      setApplications(prev => [...prev, newUIApplication]);
      
      // Add to applied jobs list
      setAppliedJobs(prev => [...prev, selectedJob.id]);
      
      // If showing filtered jobs, update filtered list
      if (filterOptions.hideAppliedJobs) {
        setFilteredJobs(prev => prev.filter(job => job.id !== selectedJob.id));
      }
      
      setApplyModalOpen(false);
      
      // Reset form
      setApplicationData({
        firstName: currentUser?.first_name || "",
        lastName: currentUser?.last_name || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        coverLetter: "",
        idealCandidate: ""
      });
      
      // Update saved jobs status if the job was saved before applying
      if (savedJobs.includes(selectedJob.id)) {
        // If the job was saved, remove it from saved jobs (since it's now applied)
        setSavedJobs(prev => prev.filter(id => id !== selectedJob.id));
      }
      
      // Refresh applications to ensure latest state from database
      fetchUserApplications();
      
      // Switch to applications tab
      setActiveTab("applications");
      
      // Select the newly created application
      setSelectedApplication(newUIApplication);
      
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application. Please try again.");
    }
  };

  // Quick view job details in a popover
  const openQuickView = (job: UIJob, event: React.MouseEvent) => {
    event.stopPropagation();
    setQuickViewJob(job);
  };
  
  // Close quick view
  const closeQuickView = () => {
    setQuickViewJob(null);
  };

  // Job Detail View Component
  function JobDetails({ job }: { job: UIJob | null }) {
    const [saving, setSaving] = useState(false);
    
    // Wrapper function for toggleSaveJob that adds loading state
    const handleToggleSave = (jobId: string) => {
      setSaving(true);
      try {
        toggleSaveJob(jobId);
      } finally {
        // Use a timeout to prevent UI flickering when operation is quick
        setTimeout(() => setSaving(false), 500);
      }
    };
    
    if (!job) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Job Selected</h3>
          <p className="text-gray-500 max-w-sm mb-4">
            Please select a job from the list to view its details
          </p>
        </div>
      );
    }

    const hasApplied = appliedJobs.includes(job.id);

    return (
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{job.title}</h2>
            {hasApplied && (
              <Badge className="mt-2 bg-green-100 text-green-800">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                You've Applied
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {!hasApplied && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleSave(job.id)}
                className={isJobSaved(job.id) ? "text-yellow-500" : ""}
                title={isJobSaved(job.id) ? "Remove from saved jobs" : "Save job"}
                disabled={saving}
              >
                {saving ? 
                  <RefreshCw className="h-5 w-5 animate-spin" /> : 
                  (isJobSaved(job.id) ? <Bookmark className="h-5 w-5 fill-current" /> : <BookmarkPlus className="h-5 w-5" />)
                }
              </Button>
            )}
            {isJobSaved(job.id) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/applicant/dashboard')}
                className="text-sm"
                title="View this job in your application board"
              >
                <Briefcase className="h-4 w-4 mr-1" />
                View in Kanban
              </Button>
            )}
            {hasApplied && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("applications")}
                className="text-sm"
                title="View your application"
              >
                <FileText className="h-4 w-4 mr-1" />
                View Application
              </Button>
            )}
          </div>
        </div>
        
        {/* Applied notification */}
        {hasApplied && (
          <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800 mb-1">Application Submitted</p>
                <p className="text-sm text-green-700">
                  You've already applied for this position. You can view the status of your application in the "My Applications" tab.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Important notice about job status tracking */}
        {isJobSaved(job.id) && !hasApplied && (
          <div className="bg-yellow-50 p-4 rounded-md mb-6 border border-yellow-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">Job Saved</p>
                <p className="text-sm text-yellow-700">
                  This job is saved to your dashboard in the "Interested" column. You can track your application status by dragging the card between columns in the Kanban board.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden">
            <Image 
              src={job.companyLogoUrl} 
              alt={`${job.company} logo`} 
              className="w-full h-full object-contain"
              width={64}
              height={64}
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">{job.company}</h3>
            <span className="text-gray-500 block">{job.location}</span>
          </div>
        </div>
        
        {/* Important notice to users */}
        <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800 mb-1">Important Notice</p>
              <p className="text-sm text-blue-700">
                Please read the full job description before applying. You may also need to register on the company's website to complete your application.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Job Type</p>
            <p className="font-medium">{job.jobType}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Experience</p>
            <p className="font-medium">{job.experienceLevel}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Salary Range</p>
            <p className="font-medium">{job.salary}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Deadline</p>
            <p className="font-medium">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Job Description</h3>
          <div className="text-gray-700">
            {job.description}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Responsibilities</h3>
          <ul className="list-disc pl-4 space-y-1">
            {job.responsibilities.map((responsibility, index) => (
              <li key={`resp-${index}`} className="text-gray-700">{responsibility}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Qualifications</h3>
          <ul className="list-disc pl-4 space-y-1">
            {job.qualifications.map((qualification, index) => (
              <li key={`qual-${index}`} className="text-gray-700">{qualification}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Benefits</h3>
          <ul className="list-disc pl-4 space-y-1">
            {job.benefits.map((benefit, index) => (
              <li key={`ben-${index}`} className="text-gray-700">{benefit}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8">
          {hasApplied ? (
            <Button 
              variant="outline"
              onClick={() => setActiveTab("applications")}
              className="w-full md:w-auto"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Your Application
            </Button>
          ) : (
            <Button 
              onClick={() => openApplyModal(job)}
              className="w-full md:w-auto"
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Application tracking component
  function ApplicationsTracker() {
    // Status badge with appropriate colors to match Kanban columns
    const getStatusBadge = (status: Application['status']) => {
      switch (status) {
        case 'submitted':
          return <Badge className="bg-blue-100 text-blue-800">Interested/Applied</Badge>;
        case 'reviewing':
          return <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>;
        case 'interviewing':
          return <Badge className="bg-violet-100 text-violet-800">Interviewing</Badge>;
        case 'offered':
          return <Badge className="bg-yellow-100 text-yellow-800">Offer Stage</Badge>;
        case 'accepted':
          return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
        case 'rejected':
          return <Badge className="bg-red-100 text-red-800">Not Selected</Badge>;
        default:
          return <Badge>Unknown</Badge>;
      }
    };

    // Status icon for visual indication
    const getStatusIcon = (status: Application['status']) => {
      switch (status) {
        case 'submitted':
          return <FileText className="h-5 w-5 text-blue-500" />;
        case 'reviewing':
          return <Clock className="h-5 w-5 text-purple-500" />;
        case 'interviewing':
          return <Briefcase className="h-5 w-5 text-violet-500" />;
        case 'offered':
          return <FileText className="h-5 w-5 text-yellow-500" />;
        case 'accepted':
          return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case 'rejected':
          return <XCircle className="h-5 w-5 text-red-500" />;
        default:
          return <FileText className="h-5 w-5" />;
      }
    };

    // Format date to be more readable
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Application detail view
    function ApplicationDetail({ application }: { application: Application | null }) {
      const [notesDialogOpen, setNotesDialogOpen] = useState(false);
      const [applicationNotes, setApplicationNotes] = useState("");
      const [isSaving, setIsSaving] = useState(false);

      useEffect(() => {
        if (application) {
          setApplicationNotes(application.notes || "");
        }
      }, [application]);

      const saveNotes = async () => {
        if (!application || !currentUser) {
          toast.error("User information not available. Please log in again.");
          return;
        }
        
        setIsSaving(true);
        
        try {
          console.log("Saving notes for application:", application.id, "User ID:", currentUser.user_id);
          // Update application notes in the database
          const response = await fetch(`/api/applications/${application.id}/notes`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notes: applicationNotes,
              userId: currentUser.user_id
            }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            console.error("Error response:", data);
            throw new Error(data.error || "Failed to update notes");
          }
          
          toast.success("Notes updated successfully");
          
          // Update local state
          setApplications(prev => 
            prev.map(app => 
              app.id === application.id 
                ? { ...app, notes: applicationNotes }
                : app
            )
          );
          
          // Update the selectedApplication to trigger a refresh
          if (selectedApplication && selectedApplication.id === application.id) {
            setSelectedApplication({
              ...selectedApplication,
              notes: applicationNotes
            });
          }
          
          // Refresh applications from the server to ensure data is in sync
          setTimeout(() => {
            fetchUserApplications();
          }, 1000);
          
          setNotesDialogOpen(false);
        } catch (error) {
          console.error("Error updating notes:", error);
          toast.error(`Failed to update notes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setIsSaving(false);
        }
      };

      if (!application) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Application Selected</h3>
            <p className="text-gray-500 max-w-sm mb-4">
              Please select an application from the list to view details
            </p>
          </div>
        );
      }

      return (
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{application.jobTitle}</h2>
              <p className="text-gray-600">{application.company}</p>
            </div>
            <div>
              {getStatusBadge(application.status)}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded border flex items-center justify-center overflow-hidden">
              <Image 
                src={application.companyLogoUrl} 
                alt={`${application.company} logo`} 
                className="w-full h-full object-contain"
                width={48}
                height={48}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Application ID: {application.id}</p>
              <p className="text-sm text-gray-500">Applied on {formatDate(application.appliedDate)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Application Status</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(application.status)}
                <span className="font-medium">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
              </div>
              {application.notes && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">{application.notes}</span>
                </div>
              )}
            </div>
            
            {application.nextSteps && (
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-medium mb-2">Next Steps</h3>
                <span>{application.nextSteps}</span>
                {application.interviewDate && (
                  <div className="mt-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Interview scheduled for {formatDate(application.interviewDate)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-8 flex gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                // Find the matching job and display its details
                const job = jobs.find(job => job.id === application.jobId);
                if (job) {
                  setSelectedJob(job);
                  setActiveTab("jobs");
                } else {
                  toast.error("Job details not found");
                }
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Job Details
            </Button>
            <Button 
              variant="outline"
              onClick={() => setNotesDialogOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Update Notes
            </Button>
          </div>

          <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Application Notes</DialogTitle>
                <DialogDescription>
                  This is where you or launchpad staff can add notes about your application for {application.jobTitle} at {application.company}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder= "Add notes about interviews, follow-ups, or any other information about this application..."
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  rows={5}
                  className="w-full"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveNotes} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Notes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <Card className="lg:col-span-1 max-h-[calc(100vh-220px)] overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>My Applications</CardTitle>
            <CardDescription>{applications.length} applications submitted</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-auto p-3">
            <div className="space-y-3">
              {applications.map((application) => (
                <Card 
                  key={application.id} 
                  className={cn(
                    "cursor-pointer hover:shadow transition-shadow",
                    selectedApplication?.id === application.id && "ring-2 ring-blue-400 border-l-4 border-blue-400"
                  )}
                  onClick={() => setSelectedApplication(application)}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded border flex items-center justify-center overflow-hidden">
                        <Image 
                          src={application.companyLogoUrl} 
                          alt={`${application.company} logo`} 
                          className="w-full h-full object-contain"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-1">{application.jobTitle}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{application.company}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">{formatDate(application.appliedDate)}</span>
                          {getStatusBadge(application.status)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {applications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  You haven&apos;t submitted any applications yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Application Details */}
        <Card className="lg:col-span-2 max-h-[calc(100vh-220px)] overflow-auto">
          <ApplicationDetail application={selectedApplication} />
        </Card>
      </div>
    );
  }

  useEffect(() => {
    if (applyModalOpen) {
      const fetchUserResumes = async () => {
        setIsLoadingResumes(true);
        try {
          // Get the user ID from the session
          const userId = session?.user?.id || 1;
          const response = await fetch(`/api/resumes?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            
            if (data.success && Array.isArray(data.resumes)) {
              setUserResumes(data.resumes);
              
              // If there's a default resume, select it automatically
              const defaultResume = data.resumes.find((resume: Resume) => resume.is_default);
              if (defaultResume) {
                setSelectedResumeId(defaultResume.resume_id);
              } else if (data.resumes.length > 0) {
                // Otherwise select the first resume
                setSelectedResumeId(data.resumes[0].resume_id);
              }
            } else {
              console.error("Invalid resume data format:", data.error || "No resumes found");
              setUserResumes([]);
            }
          } else {
            console.error("Failed to fetch resumes: API returned status", response.status);
            setUserResumes([]);
          }
        } catch (error) {
          console.error("Failed to fetch resumes:", error);
          setUserResumes([]);
        } finally {
          setIsLoadingResumes(false);
        }
      };
      
      fetchUserResumes();
    }
  }, [applyModalOpen, session]);

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Career Opportunities</h1>
          <p className="text-gray-500 mt-1">Discover tech opportunities and track your applications</p>
        </div>
        
        {/* Tab Navigation */}
        <Tabs defaultValue="jobs" className="mb-6" onValueChange={(value) => setActiveTab(value as "jobs" | "applications")}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="jobs" className="px-6">Available Jobs</TabsTrigger>
              <TabsTrigger value="applications" className="px-6">My Applications</TabsTrigger>
            </TabsList>
            
            {activeTab === "jobs" && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FilterX className="h-4 w-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
                
                <Button
                  variant={filterOptions.showSavedOnly ? "default" : "outline"}
                  className="gap-1"
                  onClick={toggleSavedJobsFilter}
                >
                  <Bookmark className="h-4 w-4" />
                  {filterOptions.showSavedOnly ? "All Jobs" : "Saved Jobs Only"}
                </Button>
                
                <Button
                  variant={filterOptions.hideAppliedJobs ? "default" : "outline"}
                  className="gap-1"
                  onClick={toggleHideAppliedJobsFilter}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {filterOptions.hideAppliedJobs ? "Show All" : "Hide Applied Jobs"}
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="jobs" className="mt-6">
            {/* Helper info about applied jobs filter */}
            {filterOptions.hideAppliedJobs && appliedJobs.length > 0 && (
              <div className="bg-blue-50 p-3 rounded mb-4 text-sm text-blue-700 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <p>
                  <strong>{appliedJobs.length}</strong> jobs you've applied for are currently hidden. 
                  <Button 
                    variant="link" 
                    onClick={toggleHideAppliedJobsFilter} 
                    className="p-0 h-auto text-blue-700 font-medium"
                  >
                    Show them
                  </Button>
                </p>
              </div>
            )}
            
            {/* Search and Filters for Jobs Tab */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search job titles, companies, or keywords..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              {(filterOptions.jobType.length > 0 || 
                filterOptions.experienceLevel.length > 0 || 
                filterOptions.location.length > 0 || 
                filterOptions.industry.length > 0 || 
                filterOptions.isRemote !== null ||
                filterOptions.showSavedOnly ||
                !filterOptions.hideAppliedJobs) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-xs flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reset
                </Button>
              )}
            </div>
            
            {/* Filters */}
            {showFilters && (
              <Card className="p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Job Type</h3>
                    <div className="space-y-2">
                      {["Full-time", "Part-time", "Contract", "Internship"].map(type => (
                        <div key={type} className="flex items-center">
                          <Checkbox 
                            id={`job-type-${type}`}
                            checked={filterOptions.jobType.includes(type)}
                            onCheckedChange={() => handleFilterChange({ type: 'jobType', value: type })}
                          />
                          <Label htmlFor={`job-type-${type}`} className="ml-2">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Experience Level</h3>
                    <div className="space-y-2">
                      {["Entry-level", "Mid-level", "Senior", "Executive"].map(level => (
                        <div key={level} className="flex items-center">
                          <Checkbox 
                            id={`exp-level-${level}`}
                            checked={filterOptions.experienceLevel.includes(level)}
                            onCheckedChange={() => handleFilterChange({ type: 'experienceLevel', value: level })}
                          />
                          <Label htmlFor={`exp-level-${level}`} className="ml-2">{level}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Remote Work</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox 
                          id="remote-yes"
                          checked={filterOptions.isRemote === true}
                          onCheckedChange={() => handleFilterChange({ type: 'isRemote', value: true })}
                        />
                        <Label htmlFor="remote-yes" className="ml-2">Remote</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="remote-no"
                          checked={filterOptions.isRemote === false}
                          onCheckedChange={() => handleFilterChange({ type: 'isRemote', value: false })}
                        />
                        <Label htmlFor="remote-no" className="ml-2">On-site</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Jobs Listing and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Listings Column */}
              <Card className="lg:col-span-1 max-h-[calc(100vh-320px)] overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle>Available Jobs</CardTitle>
                  <CardDescription>{filteredJobs.length} positions found</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-auto p-3">
                  <Suspense fallback={<JobListSkeleton />}>
                    {loading ? (
                      <JobListSkeleton />
                    ) : filteredJobs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No jobs found matching your criteria
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredJobs.map((job) => (
                          <Card 
                            key={job.id} 
                            className={cn(
                              "cursor-pointer hover:shadow transition-shadow",
                              selectedJob?.id === job.id && "ring-2 ring-blue-400 border-l-4 border-blue-400",
                              appliedJobs.includes(job.id) && "border-l-4 border-green-400"
                            )}
                            onClick={() => setSelectedJob(job)}
                          >
                            <CardContent className="p-3">
                              <div className="flex gap-3">
                                <div className="w-12 h-12 rounded border flex items-center justify-center overflow-hidden">
                                  <Image 
                                    src={job.companyLogoUrl} 
                                    alt={`${job.company} logo`} 
                                    className="w-full h-full object-contain"
                                    width={48}
                                    height={48}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900 line-clamp-1">{job.title}</h3>
                                  <span className="text-gray-500 block">{job.company}</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {job.location}
                                    </Badge>
                                    {job.isRemote && (
                                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                                        <Globe className="h-3 w-3" />
                                        Remote
                                      </Badge>
                                    )}
                                    {appliedJobs.includes(job.id) && (
                                      <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Applied
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Suspense>
                </CardContent>
              </Card>
              
              {/* Job Details Column */}
              <Card className="lg:col-span-2 max-h-[calc(100vh-320px)] overflow-auto">
                <Suspense fallback={<JobDetailsSkeleton />}>
                  {loading ? <JobDetailsSkeleton /> : <JobDetails job={selectedJob} />}
                </Suspense>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="applications" className="mt-6">
            <ApplicationsTracker />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Apply Modal */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="max-w-lg">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>Apply for {selectedJob.title}</DialogTitle>
                <DialogDescription>
                  Complete the application for {selectedJob.company}
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
                <Button variant="outline" onClick={() => setApplyModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSubmitApplication}>
                  Submit Application
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
