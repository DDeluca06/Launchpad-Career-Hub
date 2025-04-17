"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Checkbox } from "@/components/ui/form/checkbox";
import { Card } from "@/components/ui/basic/card";
import { Label } from "@/components/ui/basic/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { Search, FilterX, Bookmark, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";

import JobsList, { UIJob } from "@/components/Applicant/Jobs/JobsList";
import JobDetails from "@/components/Applicant/Jobs/JobDetails";
import ApplicationsTracker, { Application } from "@/components/Applicant/Jobs/ApplicationsTracker";
import ApplyModal, { UserProfile, Resume } from "@/components/Applicant/Jobs/ApplyModal";
import { fetchJobs, saveJob, removeJob, submitApplication } from "@/components/Applicant/Jobs/jobService";

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

interface JobsProps {
  userId?: number;
  initialApplications?: Application[];
  initialUserProfile?: UserProfile | null;
  initialResumes?: Resume[];
}

export default function Jobs({ 
  userId, 
  initialApplications = [], 
  initialUserProfile = null,
  initialResumes = []
}: JobsProps) {
  // State
  const [jobs, setJobs] = useState<UIJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<UIJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<UIJob | null>(null);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUserProfile);
  const [userResumes, setUserResumes] = useState<Resume[]>(initialResumes);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  // Apply filters to jobs
  const applyFilters = useCallback((jobsToFilter: UIJob[], filters: FilterOptions) => {
    let results = [...jobsToFilter];
    
    // Apply saved jobs filter
    if (filters.showSavedOnly) {
      results = results.filter(job => savedJobs.includes(job.id));
    }
    
    // Hide applied jobs if enabled
    if (filters.hideAppliedJobs) {
      results = results.filter(job => !appliedJobs.includes(job.id));
    }
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply other filters
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
  }, [searchTerm, savedJobs, appliedJobs]);

  // Fetch jobs and initialize data
  const fetchAllData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Fetch jobs
      const jobsData = await fetchJobs();
      setJobs(jobsData);
      
      // Set initial selected job
      if (jobsData.length > 0 && !selectedJob) {
        setSelectedJob(jobsData[0]);
      }
      
      // Extract saved and applied job IDs
      if (applications.length > 0) {
        const savedJobIds = applications
          .filter(app => app.status === 'submitted')
          .map(app => app.jobId);
        
        const appliedJobIds = applications
          .filter(app => app.status !== 'submitted')
          .map(app => app.jobId);
        
        setSavedJobs(savedJobIds);
        setAppliedJobs(appliedJobIds);
      }
      
      // Apply filters to jobs
      applyFilters(jobsData, filterOptions);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId, applications, filterOptions, applyFilters, selectedJob]);

  // Initialize data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filter handling functions
  const handleFilterChange = useCallback((filter: JobFilter) => {
    setFilterOptions(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
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
      
      return updatedFilters;
    });
  }, []);

  // Handle search input changes
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === "") {
      applyFilters(jobs, filterOptions);
      return;
    }
    
    const searchResults = jobs.filter(job => 
      job.title.toLowerCase().includes(value.toLowerCase()) ||
      job.company.toLowerCase().includes(value.toLowerCase()) ||
      job.description?.toLowerCase().includes(value.toLowerCase())
    );
    
    applyFilters(searchResults, filterOptions);
  }, [jobs, filterOptions, applyFilters]);

  // Update filters when filterOptions changes
  useEffect(() => {
    if (jobs.length > 0) {
      applyFilters(jobs, filterOptions);
    }
  }, [filterOptions, jobs, applyFilters]);

  // Toggle saved jobs filter
  const toggleSavedJobsFilter = useCallback(() => {
    setFilterOptions(prev => ({
      ...prev,
      showSavedOnly: !prev.showSavedOnly
    }));
  }, []);

  // Toggle hide applied jobs filter
  const toggleHideAppliedJobsFilter = useCallback(() => {
    setFilterOptions(prev => ({
      ...prev,
      hideAppliedJobs: !prev.hideAppliedJobs
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
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
  }, []);

  // Job saving/unsaving function
  const toggleSaveJob = useCallback(async (jobId: string) => {
    if (!currentUser) {
      toast.error("Please log in to save jobs");
      return;
    }
    
    const numericJobId = parseInt(jobId);
    const isCurrentlySaved = savedJobs.includes(jobId);
    
    try {
      if (isCurrentlySaved) {
        // Remove from saved jobs
        await removeJob(currentUser.user_id, numericJobId);
        toast.success("Job removed from saved jobs");
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      } else {
        // Add to saved jobs
        const selectedJob = jobs.find(job => job.id === jobId);
        
        if (!selectedJob) {
          toast.error("Job not found");
          return;
        }
        
        await saveJob(currentUser.user_id, numericJobId, selectedJob.title);
        toast.success("Job saved to your dashboard");
        setSavedJobs(prev => [...prev, jobId]);
      }
      
      // Refresh filters if needed
      if (filterOptions.showSavedOnly) {
        applyFilters(jobs, filterOptions);
      }
    } catch (error: any) {
      console.error("Error managing saved job:", error);
      
      if (error.message && error.message.includes("already applied")) {
        toast.info("This job is already in your dashboard");
      } else {
        toast.error(isCurrentlySaved ? "Error removing job" : "Error saving job");
      }
    }
  }, [currentUser, savedJobs, jobs, filterOptions, applyFilters]);

  // Submit job application
  const handleSubmitApplication = useCallback(async (resumeId: number, coverLetter: string, idealCandidate: string) => {
    if (!selectedJob || !currentUser || !resumeId) {
      toast.error("Missing required information. Please try again.");
      return;
    }
    
    try {
      // Submit application
      await submitApplication(
        currentUser.user_id,
        parseInt(selectedJob.id),
        resumeId,
        selectedJob.title,
        {
          firstName: currentUser.first_name,
          lastName: currentUser.last_name,
          email: currentUser.email,
          phone: currentUser.phone || ""
        }
      );
      
      // Create a UI representation of the application
      const newUIApplication: Application = {
        id: Date.now().toString(), // Temporary ID until we refresh data
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        companyLogoUrl: selectedJob.companyLogoUrl || "https://placehold.co/150",
        appliedDate: new Date().toISOString(),
        status: "submitted",
        notes: idealCandidate
      };
      
      // Update state
      setApplications(prev => [...prev, newUIApplication]);
      setAppliedJobs(prev => [...prev, selectedJob.id]);
      setApplyModalOpen(false);
      setSavedJobs(prev => prev.filter(id => id !== selectedJob.id));
      setActiveTab("applications");
      setSelectedApplication(newUIApplication);
      
      // Apply filters if hiding applied jobs
      if (filterOptions.hideAppliedJobs) {
        applyFilters(jobs, filterOptions);
      }
      
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application. Please try again.");
    }
  }, [selectedJob, currentUser, jobs, filterOptions, applyFilters]);

  // Utility functions
  const isJobSaved = useCallback((jobId: string) => savedJobs.includes(jobId), [savedJobs]);
  const hasApplied = useCallback((jobId: string) => appliedJobs.includes(jobId), [appliedJobs]);
  
  // Handle view job details from applications tab
  const handleViewJobDetails = useCallback((jobId: string) => {
    const job = jobs.find(job => job.id === jobId);
    if (job) {
      setSelectedJob(job);
      setActiveTab("jobs");
    } else {
      toast.error("Job details not found");
    }
  }, [jobs]);

  return (
    <div className="container py-6 px-4 mx-auto">
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
                <strong>{appliedJobs.length}</strong> jobs you&apos;ve applied for are currently hidden. 
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
                <FilterX className="h-3 w-3" />
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
            {/* Job Listings */}
            <JobsList 
              jobs={filteredJobs}
              loading={loading}
              selectedJobId={selectedJob?.id || null}
              appliedJobs={appliedJobs}
              onSelectJob={setSelectedJob}
            />
            
            {/* Job Details */}
            <div className="lg:col-span-2">
              <Card className="max-h-[calc(100vh-320px)] overflow-auto">
                <JobDetails 
                  job={selectedJob}
                  isJobSaved={isJobSaved}
                  hasApplied={hasApplied}
                  onToggleSaveJob={toggleSaveJob}
                  onOpenApplyModal={(job) => {
                    setSelectedJob(job);
                    setApplyModalOpen(true);
                  }}
                  onViewApplication={() => setActiveTab("applications")}
                />
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="mt-6">
          <ApplicationsTracker 
            applications={applications}
            onViewJobDetails={handleViewJobDetails}
            currentUserId={userId}
          />
        </TabsContent>
      </Tabs>
      
      {/* Apply Modal */}
      <ApplyModal 
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={selectedJob}
        currentUser={currentUser}
        userResumes={userResumes}
        isLoadingResumes={isLoadingResumes}
        onSubmit={handleSubmitApplication}
      />
    </div>
  );
}