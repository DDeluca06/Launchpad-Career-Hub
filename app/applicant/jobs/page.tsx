"use client";

import { useState, Suspense, useEffect } from "react";
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
import { jobService, applicationService, userService, resumeService, User } from "@/lib/local-storage";

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline: string;
  companyLogoUrl: string;
  industry: string;
  isRemote: boolean;
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
}

// Application tracking interfaces
interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogoUrl: string;
  appliedDate: string;
  status: 'submitted' | 'reviewing' | 'interviewing' | 'rejected' | 'offered' | 'accepted';
  notes?: string;
  nextSteps?: string;
  interviewDate?: string;
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
          <p className="text-gray-500">
            <Skeleton className="h-3 w-1/2" />
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Job Type</p>
          <p className="font-medium">
            <Skeleton className="h-4 w-3/4" />
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Experience</p>
          <p className="font-medium">
            <Skeleton className="h-4 w-3/4" />
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Salary Range</p>
          <p className="font-medium">
            <Skeleton className="h-4 w-3/4" />
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Deadline</p>
          <p className="font-medium">
            <Skeleton className="h-4 w-3/4" />
          </p>
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    jobType: [],
    experienceLevel: [],
    location: [],
    isRemote: null,
    industry: [],
  });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: null as File | null,
    coverLetter: "",
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userResumes, setUserResumes] = useState<Array<{resume_id: number, file_name: string, is_default: boolean | null}>>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  // Load data from local storage
  useEffect(() => {
    const loadData = async () => {
      if (typeof window === 'undefined') return;
      
      setLoading(true);
      
      // Get current user
      const user = userService.getCurrentUser() || userService.getById(2) || null;
      setCurrentUser(user);
      
      // Load jobs from local storage
      const storageJobs = jobService.getAll();
      
      // Transform jobs to match the UI format
      const transformedJobs: Job[] = storageJobs.map(job => ({
        id: job.job_id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.job_type,
        experienceLevel: job.tags?.includes("Senior") ? "Senior" : 
                         job.tags?.includes("Mid-level") ? "Mid-level" : "Entry-level",
        salary: "$80,000 - $150,000", // Mock salary since it's not in the storage schema
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
        postedDate: job.created_at,
        applicationDeadline: new Date(new Date(job.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        companyLogoUrl: job.companyLogo || "https://via.placeholder.com/150",
        industry: job.tags?.[0] || "Technology",
        isRemote: job.location.toLowerCase().includes("remote")
      }));
      
      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
      
      if (transformedJobs.length > 0) {
        setSelectedJob(transformedJobs[0]);
      }
      
      // Load user's applications
      const userApplications = applicationService.getByUserId(user?.user_id || 2);
      
      // Transform applications to match UI format
      const transformedApplications: Application[] = userApplications.map(app => {
        const relatedJob = storageJobs.find(j => j.job_id === app.job_id);
        
        return {
          id: app.application_id.toString(),
          jobId: app.job_id.toString(),
          jobTitle: relatedJob?.title || "Unknown Job",
          company: relatedJob?.company || "Unknown Company",
          companyLogoUrl: relatedJob?.companyLogo || "https://via.placeholder.com/150",
          appliedDate: app.applied_at,
          status: mapStatusToUI(app.status),
          notes: "",
          nextSteps: app.status === "interview" ? "Interview scheduled" : "",
          interviewDate: app.status === "interview" ? 
            new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
        };
      });
      
      setApplications(transformedApplications);
      
      // Load user's saved jobs (we'll use a convention where "interested" status means saved)
      const savedJobIds = userApplications
        .filter(app => app.status === "interested")
        .map(app => app.job_id.toString());
      
      setSavedJobs(savedJobIds);
      
      // Load user's resumes
      const userResumesData = resumeService.getByUserId(user?.user_id || 2);
      
      setUserResumes(userResumesData.map(resume => ({
        resume_id: resume.resume_id,
        file_name: resume.file_name,
        is_default: resume.isDefault
      })));
      
      if (userResumesData.length > 0) {
        const defaultResume = userResumesData.find(r => r.isDefault) || userResumesData[0];
        setSelectedResumeId(defaultResume.resume_id);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Map backend status to UI status
  const mapStatusToUI = (status: string): Application['status'] => {
    switch (status) {
      case "applied": return "submitted";
      case "interview": return "interviewing";
      case "rejected": return "rejected";
      case "offer": return "offered";
      case "accepted": return "accepted";
      default: return "submitted";
    }
  };

  // Handler functions
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      applyFilters(jobs, filterOptions);
      return;
    }
    
    const searchResults = jobs.filter(job => 
      job.title.toLowerCase().includes(value.toLowerCase()) ||
      job.company.toLowerCase().includes(value.toLowerCase()) ||
      job.description.toLowerCase().includes(value.toLowerCase())
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

  const applyFilters = (jobsToFilter: Job[], filters: FilterOptions) => {
    let results = [...jobsToFilter];
    
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.jobType.length > 0) {
      results = results.filter(job => filters.jobType.includes(job.jobType));
    }
    
    if (filters.experienceLevel.length > 0) {
      results = results.filter(job => filters.experienceLevel.includes(job.experienceLevel));
    }
    
    if (filters.location.length > 0) {
      results = results.filter(job => filters.location.includes(job.location));
    }
    
    if (filters.industry.length > 0) {
      results = results.filter(job => filters.industry.includes(job.industry));
    }
    
    if (filters.isRemote !== null) {
      results = results.filter(job => job.isRemote === filters.isRemote);
    }
    
    setFilteredJobs(results);
  };

  const toggleSaveJob = (jobId: string) => {
    if (!currentUser) return;
    
    const numericJobId = parseInt(jobId);
    
    // Update local state
    setSavedJobs(prevSavedJobs => {
      if (prevSavedJobs.includes(jobId)) {
        // Remove from saved jobs
        
        // Find and delete the "interested" application in local storage
        const existingApp = applicationService.getByUserId(currentUser.user_id)
          .find(app => app.job_id === numericJobId && app.status === "interested");
        
        if (existingApp) {
          applicationService.delete(existingApp.application_id);
        }
        
        return prevSavedJobs.filter(id => id !== jobId);
      } else {
        // Add to saved jobs
        
        // Create a new "interested" application in local storage
        const job = jobService.getById(numericJobId);
        
        if (job) {
          applicationService.create({
            user_id: currentUser.user_id,
            job_id: numericJobId,
            status: "interested",
            resume_id: selectedResumeId || 0,
            position: job.title
          });
        }
        
        return [...prevSavedJobs, jobId];
      }
    });
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.includes(jobId);
  };

  const openApplyModal = (job: Job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const resetFilters = () => {
    setFilterOptions({
      jobType: [],
      experienceLevel: [],
      location: [],
      isRemote: null,
      industry: [],
    });
    setSearchTerm("");
    setFilteredJobs(jobs);
  };

  // Submit job application
  const handleSubmitApplication = () => {
    if (!selectedJob || !currentUser) return;
    
    // Create application in local storage
    const jobId = parseInt(selectedJob.id);
    
    const newApplication = applicationService.create({
      user_id: currentUser.user_id,
      job_id: jobId,
      status: "applied",
      resume_id: selectedResumeId || 0,
      position: selectedJob.title
    });
    
    if (newApplication) {
      // Add to UI applications list
      const newUIApplication: Application = {
        id: newApplication.application_id.toString(),
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        companyLogoUrl: selectedJob.companyLogoUrl,
        appliedDate: newApplication.applied_at,
        status: "submitted",
        notes: applicationData.coverLetter
      };
      
      setApplications(prev => [...prev, newUIApplication]);
      
      // Close modal and reset form
      setApplyModalOpen(false);
      setApplicationData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        resume: null,
        coverLetter: ""
      });
      
      // Switch to applications tab
      setActiveTab("applications");
    }
  };

  // Job Detail View Component
  function JobDetails({ job }: { job: Job | null }) {
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

    return (
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSaveJob(job.id)}
            className={isJobSaved(job.id) ? "text-yellow-500" : ""}
          >
            {isJobSaved(job.id) ? <Bookmark className="h-5 w-5 fill-current" /> : <BookmarkPlus className="h-5 w-5" />}
          </Button>
        </div>
        
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
            <p className="text-gray-500">{job.location}</p>
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
          <Button 
            onClick={() => openApplyModal(job)}
            className="w-full md:w-auto"
          >
            Apply Now
          </Button>
        </div>
      </div>
    );
  }

  // Application tracking component
  function ApplicationsTracker() {
    // Status badge with appropriate colors
    const getStatusBadge = (status: Application['status']) => {
      switch (status) {
        case 'submitted':
          return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
        case 'reviewing':
          return <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>;
        case 'interviewing':
          return <Badge className="bg-green-100 text-green-800">Interviewing</Badge>;
        case 'offered':
          return <Badge className="bg-yellow-100 text-yellow-800">Offer Received</Badge>;
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
          return <Briefcase className="h-5 w-5 text-green-500" />;
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
                  <p className="text-sm text-gray-600">{application.notes}</p>
                </div>
              )}
            </div>
            
            {application.nextSteps && (
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-medium mb-2">Next Steps</h3>
                <p>{application.nextSteps}</p>
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
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Job Details
            </Button>
            <Button variant="outline">
              <Briefcase className="h-4 w-4 mr-2" />
              Contact Recruiter
            </Button>
          </div>
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
          // For now, we'll use a placeholder user ID of 1
          const userId = 1; // Replace with actual user ID from authentication
          const response = await fetch(`/api/resumes?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUserResumes(data);
            
            // If there's a default resume, select it automatically
            const defaultResume = data.find((resume: {resume_id: number, file_name: string, is_default: boolean | null}) => resume.is_default);
            if (defaultResume) {
              setSelectedResumeId(defaultResume.resume_id);
            } else if (data.length > 0) {
              // Otherwise select the first resume
              setSelectedResumeId(data[0].resume_id);
            }
          }
        } catch (error) {
          console.error("Failed to fetch resumes:", error);
        } finally {
          setIsLoadingResumes(false);
        }
      };

      fetchUserResumes();
    }
  }, [applyModalOpen]);

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
              </div>
            )}
          </div>
          
          <TabsContent value="jobs" className="mt-6">
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
                filterOptions.isRemote !== null) && (
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
                              selectedJob?.id === job.id && "ring-2 ring-blue-400 border-l-4 border-blue-400"
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
                                  <p className="text-sm text-gray-500 line-clamp-1">{job.company}</p>
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
                    <p className="text-sm text-gray-500">Loading your resumes...</p>
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
                  <Textarea 
                    id="cover-letter" 
                    placeholder="Why are you interested in this position?"
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
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
