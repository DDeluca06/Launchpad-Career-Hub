"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bookmark, Filter, MapPin, Briefcase, Building, ExternalLink, Calendar, Star, FileText } from "lucide-react"
import { jobService, applicationService, Job } from "@/lib/local-storage"
import { Badge } from "@/components/ui/badge"
import { LaunchpadImage } from "@/components/launchpad-image"
import { cn } from "@/lib/utils"
import { MultiPurposeModal } from "@/components/ui/multi-purpose-modal"
import { JobFilters } from "@/components/job-filters"
import type { JobFilters as JobFiltersType } from "@/components/job-filters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Define job application status type
type ApplicationStatus = "saved" | "applied" | "interviewing" | "rejected" | "offered" | null;

interface ExtendedJob extends Omit<Job, 'tags'> {
  applicationStatus?: ApplicationStatus;
  matchPercentage?: number; // For job matching feature
  datePosted?: string;
  applicationDeadline?: string;
  salary?: string;
  benefits?: string[];
  skills?: string[];
  company_logo?: string;
  jobTypeDisplay?: string;
  isRemote?: boolean;
  tags?: string[];
}

// Define constants based on the schema
const JOB_TYPES = [
  { id: "full-time", label: "Full Time" },
  { id: "part-time", label: "Part Time" },
  { id: "contract", label: "Contract" },
  { id: "apprenticeship", label: "Apprenticeship" },
  { id: "internship", label: "Internship" }
];

const TAG_CATEGORIES = {
  WORK_MODE: ['fully-remote', 'hybrid', 'in-person'],
  ROLES: ['front-end', 'back-end', 'full-stack', 'ux/ui design', 'product management', 'game development', 'devops', 'business analysis', 'social media'],
  INDUSTRIES: ['non-profit', 'start-up', 'education', 'healthcare', 'fintech', 'marketing'],
  TECH_FIELDS: ['data science', 'cybersecurity', 'IT', 'AL/ML', 'cloud computing']
};

// Flatten all tags for filtering
const ALL_TAGS = [
  ...TAG_CATEGORIES.WORK_MODE,
  ...TAG_CATEGORIES.ROLES,
  ...TAG_CATEGORIES.INDUSTRIES,
  ...TAG_CATEGORIES.TECH_FIELDS
];

// Define filter interface
interface JobFilters {
  jobTypes: string[];
  tags: string[];
  locations: string[];
  keywords: string;
}

// Function to update job data based on current schema
function enhanceJobWithDetails(job: Job, appliedJobIds: number[], savedJobIds: number[]): ExtendedJob {
  let status: ApplicationStatus = null;
  
  if (appliedJobIds.includes(job.job_id)) {
    status = "applied";
  } else if (savedJobIds.includes(job.job_id)) {
    status = "saved";
  }
  
  // Add random match percentage
  const matchPercentage = Math.floor(Math.random() * 30) + 70; // 70-99%
  
  // Format job type display name
  let jobTypeDisplay = job.job_type;
  if (job.job_type) {
    // Convert schema format (like full-time) to display format (like Full Time)
    jobTypeDisplay = job.job_type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Handle tags if present
  const tags = typeof job.tags === 'string' ? (job.tags as string).split(',') : [];
  
  // Determine if job is remote based on tags
  const isRemote = tags.some((tag: string) => 
    tag === 'fully-remote' || tag === 'hybrid'
  );
  
  // Parse tags into skills
  const skills = tags.filter((tag: string) => 
    !['fully-remote', 'hybrid', 'in-person'].includes(tag)
  );
  
  // Add simulated posting date (based on created_at if available)
  const datePosted = job.created_at ? new Date(job.created_at) : new Date();
  
  // Add simulated application deadline (future date)
  const applicationDeadline = new Date();
  applicationDeadline.setDate(datePosted.getDate() + 30); // 30 days after posting
  
  return {
    ...job,
    applicationStatus: status,
    matchPercentage,
    jobTypeDisplay,
    isRemote,
    skills,
    tags,
    datePosted: datePosted.toISOString(),
    applicationDeadline: applicationDeadline.toISOString(),
    company_logo: `/company-logos/${job.company.toLowerCase().replace(/\s+/g, '-')}.png`
  };
}

export default function ApplicantJobListings() {
  const [jobs, setJobs] = useState<ExtendedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ExtendedJob | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<JobFilters>({
    jobTypes: [] as string[],
    tags: [] as string[],
    locations: [] as string[],
    keywords: ""
  });
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  
  // Load jobs from local storage
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      
      // Get all jobs from local storage
      const allJobs = jobService.getAll();
      
      // Get all applications to determine which jobs the user has applied to
      const allApplications = applicationService.getAll();
      const userApplications = allApplications.filter(app => app.user_id === 2); // Simulating user ID = 2
      
      const appliedJobIds = userApplications.map(app => app.job_id);
      setAppliedJobs(appliedJobIds);
      
      // Simulate saved jobs (in a real app this would come from user's saved jobs)
      setSavedJobs([3, 5, 7]);
      
      // Enhance jobs with additional data
      const enhancedJobs = allJobs.map(job => enhanceJobWithDetails(job, appliedJobIds, savedJobs));
      
      setJobs(enhancedJobs);
      
      // Set the first job as selected if available
      if (enhancedJobs.length > 0 && !selectedJob) {
        setSelectedJob(enhancedJobs[0]);
      }
      
      setIsLoading(false);
    };
    
    loadJobs();
  }, []);

  // Filter jobs with schema-based filters
  const filteredJobs = jobs.filter(job => {
    // First filter by tab
    if (activeTab === "saved" && !savedJobs.includes(job.job_id)) return false;
    if (activeTab === "applied" && !appliedJobs.includes(job.job_id)) return false;
    
    // Filter by job type if any selected
    if (activeFilters.jobTypes.length > 0 && !activeFilters.jobTypes.includes(job.job_type as string)) {
      return false;
    }
    
    // Filter by tags if any selected
    if (activeFilters.tags.length > 0) {
      if (!job.tags || !activeFilters.tags.some((tag: string) => job.tags?.includes(tag))) {
        return false;
      }
    }
    
    // Filter by location if any selected
    if (activeFilters.locations.length > 0) {
      if (!job.location || !activeFilters.locations.some((loc: string) => job.location?.toLowerCase().includes(loc.toLowerCase()))) {
        return false;
      }
    }
    
    // Then filter by search query/keywords
    if (activeFilters.keywords || searchQuery) {
      const query = (activeFilters.keywords || searchQuery).toLowerCase();
      if (query === '') return true;
      
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by match percentage
    return (b.matchPercentage || 0) - (a.matchPercentage || 0);
  });

  // Handle selecting a job
  const handleSelectJob = (job: ExtendedJob) => {
    setSelectedJob(job);
  };

  // Toggle saved job
  const handleToggleSave = (jobId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
    } else {
      setSavedJobs(prev => [...prev, jobId]);
    }
  };
  
  // Apply for job
  const handleApplyForJob = () => {
    if (selectedJob) {
      // In a real app, this would create an application in the database
      setAppliedJobs(prev => [...prev, selectedJob.job_id]);
      
      // Update the selected job's application status
      setSelectedJob({
        ...selectedJob,
        applicationStatus: "applied"
      });
      
      // Update the job in the jobs array
      setJobs(prevJobs => prevJobs.map(job => 
        job.job_id === selectedJob.job_id 
          ? { ...job, applicationStatus: "applied" } 
          : job
      ));
      
      setApplyModalOpen(false);
    }
  };

  // Apply filters
  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setFilterModalOpen(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Find Jobs</h1>
          <p className="text-gray-500 mt-1">Discover and apply to jobs matching your skills and interests</p>
        </div>
        
        {/* Job Match Summary */}
        <Card className="mb-6 bg-gradient-to-r from-launchpad-blue/10 to-launchpad-teal/10">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-base mb-1">Your Job Match Summary</h3>
                <p className="text-sm text-gray-500">
                  We've found {jobs.length} jobs that match your profile, with {jobs.filter(j => (j.matchPercentage || 0) > 85).length} high-match opportunities
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="text-sm"
                  onClick={() => window.location.href = '/applicant/settings?tab=profile'}
                >
                  Update Profile
                </Button>
                <Button 
                  className="text-sm bg-launchpad-blue hover:bg-launchpad-teal text-white"
                >
                  View Top Matches
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Search and Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search jobs, companies, skills..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="gap-1" 
              onClick={() => setFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        {/* Job Listings Tabs */}
        <Tabs defaultValue="all" className="mb-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Briefcase className="h-4 w-4" />
              All Jobs
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Saved
              <Badge className="ml-1 h-5 w-5 text-xs flex items-center justify-center p-0 bg-launchpad-blue text-white rounded-full">
                {savedJobs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="applied" className="gap-2">
              <Calendar className="h-4 w-4" />
              Applied
              <Badge className="ml-1 h-5 w-5 text-xs flex items-center justify-center p-0 bg-launchpad-green text-white rounded-full">
                {appliedJobs.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Listings Column */}
          <Card className="lg:col-span-1 max-h-[calc(100vh-300px)] overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>{filteredJobs.length} jobs found</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-3">
              {isLoading ? (
                // Loading state
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="h-12 w-12 rounded bg-gray-200" />
                          <div className="flex-1 space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                // Empty state
                <div className="text-center py-12">
                  <p className="text-gray-500">No jobs found matching your criteria</p>
                </div>
              ) : (
                // Job list
                <div className="space-y-3">
                  {filteredJobs.map((job) => (
                    <Card 
                      key={job.job_id} 
                      className={cn(
                        "cursor-pointer hover:shadow transition-shadow",
                        selectedJob?.job_id === job.job_id ? "ring-2 ring-launchpad-blue" : ""
                      )}
                      onClick={() => handleSelectJob(job)}
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                            <LaunchpadImage
                              src={job.company_logo || `/company-logos/${job.company.toLowerCase().replace(/\s+/g, '-')}.png`}
                              alt={job.company}
                              width={40}
                              height={40}
                              className="object-contain"
                              fallbackSrc="/placeholder-logo.png"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900 line-clamp-1">{job.title}</h3>
                              <button 
                                className="text-gray-400 hover:text-yellow-500"
                                onClick={(e) => handleToggleSave(job.job_id, e)}
                              >
                                {savedJobs.includes(job.job_id) ? (
                                  <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1">{job.company}</p>
                            
                            {/* Display job type and location */}
                            <div className="flex flex-wrap gap-1 mt-1 mb-1">
                              <Badge variant="outline" className="text-xs py-0 px-1.5 bg-gray-50">
                                {job.jobTypeDisplay || job.job_type}
                              </Badge>
                              
                              {/* Show remote status badge if applicable */}
                              {job.isRemote && (
                                <Badge variant="outline" className="text-xs py-0 px-1.5 bg-blue-50 text-blue-700">
                                  {job.tags?.includes('fully-remote') ? 'Remote' : 'Hybrid'}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-400">{job.location}</span>
                              </div>
                              <Badge 
                                className={cn(
                                  "text-xs",
                                  job.applicationStatus === "applied" 
                                    ? "bg-launchpad-green/20 text-launchpad-green" 
                                    : "bg-launchpad-blue/10 text-launchpad-blue"
                                )}
                              >
                                {job.applicationStatus === "applied" ? "Applied" : `${job.matchPercentage}% match`}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Job Details Column */}
          <Card className="lg:col-span-2 max-h-[calc(100vh-300px)] overflow-auto">
            {isLoading ? (
              // Loading state for job details
              <div className="animate-pulse p-6 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
                <div className="flex gap-3 mb-6">
                  <div className="h-16 w-16 rounded bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ) : !selectedJob ? (
              // No job selected state
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Job Selected</h3>
                <p className="text-gray-500 max-w-sm mb-4">
                  Please select a job from the list to view its details
                </p>
              </div>
            ) : (
              // Job details view
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-1"
                      onClick={() => handleToggleSave(selectedJob.job_id)}
                    >
                      {savedJobs.includes(selectedJob.job_id) ? (
                        <>
                          <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                    {selectedJob.applicationStatus === "applied" ? (
                      <Button 
                        size="sm"
                        className="gap-1 bg-launchpad-green text-white hover:bg-launchpad-darkGreen"
                        disabled
                      >
                        <Calendar className="h-4 w-4" /> Applied
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        className="gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white"
                        onClick={() => setApplyModalOpen(true)}
                      >
                        <ExternalLink className="h-4 w-4" /> Apply Now
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                    <LaunchpadImage
                      src={selectedJob.company_logo || `/company-logos/${selectedJob.company.toLowerCase().replace(/\s+/g, '-')}.png`}
                      alt={selectedJob.company}
                      width={60}
                      height={60}
                      className="object-contain"
                      fallbackSrc="/placeholder-logo.png"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{selectedJob.company}</h3>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {selectedJob.location}
                    </div>
                    {selectedJob.website && (
                      <div className="flex items-center text-gray-500 mt-1">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        <a 
                          href={selectedJob.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:text-launchpad-blue underline" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          Company Website
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-launchpad-blue/10 text-launchpad-blue px-3 py-1.5">
                      <Star className="h-3.5 w-3.5 mr-1 fill-launchpad-blue" />
                      {selectedJob.matchPercentage}% match
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Job Type</p>
                    <p className="font-medium">{selectedJob.jobTypeDisplay}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Work Mode</p>
                    <p className="font-medium">
                      {selectedJob.tags?.includes('fully-remote') 
                        ? 'Remote' 
                        : selectedJob.tags?.includes('hybrid')
                          ? 'Hybrid'
                          : 'In-Office'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Posted</p>
                    <p className="font-medium">{selectedJob.datePosted ? formatDate(selectedJob.datePosted) : 'Recently'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Partner ID</p>
                    <p className="font-medium">{selectedJob.partner_id || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Tags & Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.tags?.filter(tag => 
                      !['fully-remote', 'hybrid', 'in-person'].includes(tag)
                    ).map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-launchpad-blue/5">
                        {tag}
                      </Badge>
                    ))}
                    {!selectedJob.tags?.length && (
                      <p className="text-gray-500 text-sm">No specific tags listed</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {selectedJob.description || 'No description provided'}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.benefits?.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="bg-launchpad-green/5">
                        {benefit}
                      </Badge>
                    ))}
                    {!selectedJob.benefits?.length && (
                      <p className="text-gray-500 text-sm">No specific benefits listed</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  {selectedJob.applicationStatus === "applied" ? (
                    <Button 
                      disabled
                      className="gap-1 bg-launchpad-green text-white hover:bg-launchpad-darkGreen"
                    >
                      <Calendar className="h-4 w-4" /> Already Applied
                    </Button>
                  ) : (
                    <Button 
                      className="gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white"
                      onClick={() => setApplyModalOpen(true)}
                    >
                      <ExternalLink className="h-4 w-4" /> Apply Now
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="gap-1"
                    onClick={() => handleToggleSave(selectedJob.job_id)}
                  >
                    {savedJobs.includes(selectedJob.job_id) ? (
                      <>
                        <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        Save Job
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Filter Modal */}
      <MultiPurposeModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        title="Filter Jobs"
        description="Find specific jobs by criteria"
        size="md"
        showFooter={true}
        primaryActionText="Apply Filters"
        onPrimaryAction={() => {}}
        secondaryActionText="Reset"
        onSecondaryAction={() => setActiveFilters({
          jobTypes: [],
          tags: [],
          locations: [],
          keywords: ""
        })}
      >
        <div className="space-y-6 p-1">
          {/* Keywords */}
          <div>
            <h3 className="text-sm font-medium mb-2">Keywords</h3>
            <Input
              placeholder="Search job titles, companies, or skills"
              value={activeFilters.keywords}
              onChange={(e) => setActiveFilters({...activeFilters, keywords: e.target.value})}
            />
          </div>
          
          {/* Job Types */}
          <div>
            <h3 className="text-sm font-medium mb-2">Job Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {JOB_TYPES.map(type => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type.id}`}
                    checked={activeFilters.jobTypes.includes(type.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setActiveFilters({
                          ...activeFilters, 
                          jobTypes: [...activeFilters.jobTypes, type.id]
                        });
                      } else {
                        setActiveFilters({
                          ...activeFilters,
                          jobTypes: activeFilters.jobTypes.filter((t: string) => t !== type.id)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`type-${type.id}`}>{type.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Work Mode Tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Work Mode</h3>
            <div className="flex flex-wrap gap-2">
              {TAG_CATEGORIES.WORK_MODE.map((tag: string) => (
                <Badge
                  key={tag}
                  variant={activeFilters.tags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    activeFilters.tags.includes(tag) 
                      ? "bg-launchpad-blue hover:bg-launchpad-blue/90" 
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => {
                    if (activeFilters.tags.includes(tag)) {
                      setActiveFilters({
                        ...activeFilters,
                        tags: activeFilters.tags.filter((t: string) => t !== tag)
                      });
                    } else {
                      setActiveFilters({
                        ...activeFilters, 
                        tags: [...activeFilters.tags, tag]
                      });
                    }
                  }}
                >
                  {tag.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Role Tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Roles</h3>
            <div className="flex flex-wrap gap-2">
              {TAG_CATEGORIES.ROLES.map((tag: string) => (
                <Badge
                  key={tag}
                  variant={activeFilters.tags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    activeFilters.tags.includes(tag) 
                      ? "bg-launchpad-blue hover:bg-launchpad-blue/90" 
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => {
                    if (activeFilters.tags.includes(tag)) {
                      setActiveFilters({
                        ...activeFilters,
                        tags: activeFilters.tags.filter((t: string) => t !== tag)
                      });
                    } else {
                      setActiveFilters({
                        ...activeFilters, 
                        tags: [...activeFilters.tags, tag]
                      });
                    }
                  }}
                >
                  {tag.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Industry Tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Industries</h3>
            <div className="flex flex-wrap gap-2">
              {TAG_CATEGORIES.INDUSTRIES.map((tag: string) => (
                <Badge
                  key={tag}
                  variant={activeFilters.tags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    activeFilters.tags.includes(tag) 
                      ? "bg-launchpad-blue hover:bg-launchpad-blue/90" 
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => {
                    if (activeFilters.tags.includes(tag)) {
                      setActiveFilters({
                        ...activeFilters,
                        tags: activeFilters.tags.filter((t: string) => t !== tag)
                      });
                    } else {
                      setActiveFilters({
                        ...activeFilters, 
                        tags: [...activeFilters.tags, tag]
                      });
                    }
                  }}
                >
                  {tag.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Tech Field Tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Tech Fields</h3>
            <div className="flex flex-wrap gap-2">
              {TAG_CATEGORIES.TECH_FIELDS.map((tag: string) => (
                <Badge
                  key={tag}
                  variant={activeFilters.tags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    activeFilters.tags.includes(tag) 
                      ? "bg-launchpad-blue hover:bg-launchpad-blue/90" 
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => {
                    if (activeFilters.tags.includes(tag)) {
                      setActiveFilters({
                        ...activeFilters,
                        tags: activeFilters.tags.filter((t: string) => t !== tag)
                      });
                    } else {
                      setActiveFilters({
                        ...activeFilters, 
                        tags: [...activeFilters.tags, tag]
                      });
                    }
                  }}
                >
                  {tag.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Locations */}
          <div>
            <h3 className="text-sm font-medium mb-2">Popular Locations</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Philadelphia", "New York", "Remote", "Boston", "San Francisco"].map((location: string) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`loc-${location}`}
                    checked={activeFilters.locations.includes(location)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setActiveFilters({
                          ...activeFilters, 
                          locations: [...activeFilters.locations, location]
                        });
                      } else {
                        setActiveFilters({
                          ...activeFilters,
                          locations: activeFilters.locations.filter((t: string) => t !== location)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`loc-${location}`}>{location}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Active Filters Summary */}
          {(activeFilters.jobTypes.length > 0 || activeFilters.tags.length > 0 || activeFilters.locations.length > 0) && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-1.5">
                {activeFilters.jobTypes.map(type => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {JOB_TYPES.find(t => t.id === type)?.label || type}
                    <button 
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => setActiveFilters({
                        ...activeFilters,
                        jobTypes: activeFilters.jobTypes.filter(t => t !== type)
                      })}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {activeFilters.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    <button 
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => setActiveFilters({
                        ...activeFilters,
                        tags: activeFilters.tags.filter(t => t !== tag)
                      })}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {activeFilters.locations.map(loc => (
                  <Badge key={loc} variant="secondary" className="flex items-center gap-1">
                    {loc}
                    <button 
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => setActiveFilters({
                        ...activeFilters,
                        locations: activeFilters.locations.filter(l => l !== loc)
                      })}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-xs p-0 h-auto" 
                  onClick={() => setActiveFilters({
                    jobTypes: [],
                    tags: [],
                    locations: [],
                    keywords: activeFilters.keywords
                  })}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      </MultiPurposeModal>
      
      {/* Apply for Job Modal */}
      <MultiPurposeModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        title="Apply for Job"
        description={selectedJob ? `Apply for ${selectedJob.title} at ${selectedJob.company}` : "Apply for Job"}
        size="md"
        showFooter={true}
        primaryActionText="Submit Application"
        onPrimaryAction={handleApplyForJob}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setApplyModalOpen(false)}
      >
        {selectedJob && (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedJob.company_logo} alt={selectedJob.company} />
                <AvatarFallback>{selectedJob.company.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedJob.title}</h3>
                <p className="text-sm text-gray-500">{selectedJob.company} • {selectedJob.location}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Resume</h4>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span>my_resume_2023.pdf</span>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Cover Letter (Optional)</h4>
                <div className="flex items-center justify-between p-3 border rounded-md border-dashed">
                  <span className="text-gray-500">+ Add Cover Letter</span>
                  <Button variant="outline" size="sm">Upload</Button>
                </div>
              </div>
              
              <div className="bg-launchpad-blue/5 p-4 rounded-md">
                <h4 className="font-medium mb-2 text-sm">Application Tips</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Make sure your resume highlights skills relevant to this position</li>
                  <li>Include specific achievements related to the job requirements</li>
                  <li>A personalized cover letter can increase your chances by 40%</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </MultiPurposeModal>
    </DashboardLayout>
  )
}
