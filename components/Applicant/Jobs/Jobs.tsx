"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Checkbox } from "@/components/ui/form/checkbox";
import { Card } from "@/components/ui/basic/card";
import { Label } from "@/components/ui/basic/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { Search, FilterX, Bookmark} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/basic/badge";

import JobsList, { UIJob } from "./JobsList";
import JobDetails from "./JobDetails";
import ApplicationsTracker, { Application } from "./ApplicationsTracker";
import ApplyModal, { UserProfile } from "./ApplyModal";
import { fetchJobs, saveJob, removeJob, submitApplication } from "./jobService";

interface JobFilter {
  type: keyof FilterOptions;
  value: string | boolean;
}

interface FilterOptions {
  jobType: string[];
  location: string[];
  isRemote: boolean | null;
  showSavedOnly: boolean;
  hideAppliedJobs: boolean;
}

interface JobsProps {
  userId?: number;
  initialApplications?: Application[];
  initialUserProfile?: UserProfile | null;
}

export default function Jobs({ 
  userId, 
  initialApplications = [], 
  initialUserProfile = null
}: JobsProps) {
  // State
  const [jobs, setJobs] = useState<UIJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<UIJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<UIJob | null>(null);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    jobType: [],
    location: [],
    isRemote: null,
    showSavedOnly: false,
    hideAppliedJobs: true,
  });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [currentUser] = useState<UserProfile | null>(initialUserProfile);

  // Apply filters
  const applyFilters = useCallback((jobsToFilter: UIJob[], filters: FilterOptions) => {
    let results = [...jobsToFilter];
    
    if (filters.showSavedOnly) {
      results = results.filter(job => savedJobs.includes(job.id));
    }
    
    if (filters.hideAppliedJobs) {
      results = results.filter(job => !hasAppliedToJob(job.id));
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
    
    if (filters.location.length > 0) {
      results = results.filter(job => filters.location.includes(job.location || ""));
    }
    
    if (filters.isRemote !== null) {
      results = results.filter(job => job.isRemote === filters.isRemote);
    }
    
    setFilteredJobs(results);
  }, [savedJobs, applications, searchTerm]);

  // Fetch jobs and other data
  const fetchAllData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Fetch jobs
      const jobsData = await fetchJobs();
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      
      if (jobsData.length > 0) {
        setSelectedJob(jobsData[0]);
      }
      
      // Extract saved and applied job IDs from applications
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
      
      // Apply initial filters
      applyFilters(jobsData, filterOptions);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId, applications, filterOptions, applyFilters]);

  // Initialize data
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Always keep the applications data consistent
    if (value.trim() === "") {
      fetchAllData();
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

  // Handle filter changes
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

  // Toggle saved jobs filter
  const toggleSavedJobsFilter = () => {
    const updatedFilters = { 
      ...filterOptions,
      showSavedOnly: !filterOptions.showSavedOnly 
    };
    setFilterOptions(updatedFilters);
    applyFilters(jobs, updatedFilters);
  };

  // Toggle hide applied jobs filter
  const toggleHideAppliedJobsFilter = () => {
    const updatedFilters = { 
      ...filterOptions,
      hideAppliedJobs: !filterOptions.hideAppliedJobs 
    };
    setFilterOptions(updatedFilters);
    applyFilters(jobs, updatedFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      jobType: [],
      location: [],
      isRemote: null,
      showSavedOnly: false,
      hideAppliedJobs: true,
    });
    setSearchTerm("");
    setFilteredJobs(jobs.filter(job => !appliedJobs.includes(job.id)));
  };

  // Toggle save job
  const toggleSaveJob = async (jobId: string) => {
    if (!currentUser) {
      toast.error("Please log in to save jobs");
      return;
    }
    
    const numericJobId = parseInt(jobId);
    
    // Update local state
    setSavedJobs(prevSavedJobs => {
      const isCurrentlySaved = prevSavedJobs.includes(jobId);
      
      if (isCurrentlySaved) {
        // Remove from saved jobs
        removeJob(currentUser.user_id, numericJobId)
          .then(() => {
            toast.success("Job removed from saved jobs");
            fetchAllData(); // Refresh data
            
            // If showing saved only, reapply filters to remove this job
            if (filterOptions.showSavedOnly) {
              applyFilters(jobs, filterOptions);
            }
          })
          .catch(error => {
            console.error("Error removing saved job:", error);
            toast.error("Error removing job from saved jobs");
          });
        
        return prevSavedJobs.filter(id => id !== jobId);
      } else {
        // Add to saved jobs
        const selectedJob = jobs.find(job => job.id === jobId);
        
        if (!selectedJob) {
          toast.error("Job not found");
          return prevSavedJobs;
        }
        
        // Add job to saved jobs
        saveJob(currentUser.user_id, numericJobId, selectedJob.title)
          .then(() => {
            toast.success("Job saved to your dashboard");
            fetchAllData(); // Refresh data
          })
          .catch(error => {
            console.error("Error saving job:", error);
            if (error.message && error.message.includes("already applied")) {
              toast.info("This job is already in your dashboard");
            } else {
              toast.error("Error saving job");
            }
          });
        
        return [...prevSavedJobs, jobId];
      }
    });
  };

  // Check if job is saved
  const isJobSaved = (jobId: string) => {
    return savedJobs.includes(jobId);
  };

  // Check if job has been applied to
  const hasApplied = useCallback((jobId: string) => {
    return appliedJobs.includes(jobId);
  }, [appliedJobs]);

  // Open apply modal
  const openApplyModal = (job: UIJob) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  // View application
  const handleViewApplication = () => {
    setActiveTab("applications");
  };

  // Handle view job details from applications tab
  const handleViewJobDetails = (jobId: string) => {
    const job = jobs.find(job => job.id === jobId);
    if (job) {
      setSelectedJob(job);
      setActiveTab("jobs");
    } else {
      toast.error("Job details not found");
    }
  };

  // Submit job application
  const handleSubmitApplication = async (resumeId: number, coverLetter: string, idealCandidate: string) => {
    if (!selectedJob || !userId || !currentUser) {
      toast.error("Please select a job and ensure you're logged in");
      return;
    }

    try {
      const response = await submitApplication(
        Number(userId),
        Number(selectedJob.id),
        resumeId,
        selectedJob.title,
        {
          firstName: currentUser.first_name,
          lastName: currentUser.last_name,
          email: currentUser.email
        },
        coverLetter,
        idealCandidate
      );

      if (response) {
        // Map database status to UI status
        const mapDBStatusToUIStatus = (dbStatus: string) => {
          switch (dbStatus) {
            case 'INTERESTED':
            case 'APPLIED':
              return 'submitted';
            case 'PHONE_SCREENING':
            case 'INTERVIEW_STAGE':
            case 'FINAL_INTERVIEW_STAGE':
              return 'interviewing';
            case 'OFFER_EXTENDED':
            case 'NEGOTIATION':
              return 'offered';
            case 'OFFER_ACCEPTED':
              return 'accepted';
            case 'REJECTED':
              return 'rejected';
            default:
              return 'submitted';
          }
        };

        // Update local state with new application
        const newApplication: Application = {
          id: response.application.application_id.toString(),
          jobId: selectedJob.id.toString(),
          jobTitle: selectedJob.title,
          company: selectedJob.company,
          companyLogoUrl: selectedJob.website || "/placeholder-logo.png",
          appliedDate: new Date().toISOString(),
          status: mapDBStatusToUIStatus(response.application.status),
          notes: idealCandidate,
          nextSteps: "",
          interviewDate: undefined,
        };
        
        // Update applications state
        setApplications(prev => [...prev, newApplication]);
        
        // Update applied jobs state
        setAppliedJobs(prev => [...prev, selectedJob.id]);
        
        // Show success message
        toast.success("Application submitted successfully!");
        
        // Close modal and switch to applications tab
        setApplyModalOpen(false);
        setActiveTab("applications");
        
        // Refresh the applications list
        try {
          const appsResponse = await fetch(`/api/applicants?id=${userId}&applications=true`);
          const appsData = await appsResponse.json();
          
          if (appsData.applications) {
            setApplications(appsData.applications.map((app: any) => ({
              id: app.id.toString(),
              jobId: app.jobId.toString(),
              jobTitle: app.jobTitle,
              company: app.company,
              companyLogoUrl: selectedJob.website || "/placeholder-logo.png",
              appliedDate: app.appliedDate,
              status: mapDBStatusToUIStatus(app.status),
              notes: app.notes || "",
              nextSteps: app.nextSteps || "",
              interviewDate: app.interviewDate,
            })));
          }
        } catch (error) {
          console.error("Error refreshing applications:", error);
        }
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  // Add a function to check if a job has been applied to
  const hasAppliedToJob = (jobId: string) => {
    return applications.some(app => app.jobId === jobId);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "jobs" | "applications")}>
        <TabsList>
          <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
          <TabsTrigger value="applications">
            My Applications
            {applications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {applications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <div className="space-y-4">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <FilterX className="h-4 w-4" />
                  Filters
                </Button>
                <Button
                  variant={filterOptions.showSavedOnly ? "default" : "outline"}
                  onClick={toggleSavedJobsFilter}
                  className="gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Saved
                </Button>
              </div>
            </div>

            {/* Filter options */}
            {showFilters && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Job Type</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                        <Button
                          key={type}
                          variant={filterOptions.jobType.includes(type) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFilterChange({ type: "jobType", value: type })}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hide-applied"
                      checked={filterOptions.hideAppliedJobs}
                      onCheckedChange={toggleHideAppliedJobsFilter}
                    />
                    <Label htmlFor="hide-applied">Hide jobs I've already applied to</Label>
                  </div>
                </div>
              </Card>
            )}

            {/* Job listings */}
            <div className="grid lg:grid-cols-3 gap-6">
              <JobsList
                jobs={filteredJobs}
                loading={loading}
                selectedJobId={selectedJob?.id || null}
                appliedJobs={applications.map(app => app.jobId)}
                onSelectJob={setSelectedJob}
              />
              
              <div className="lg:col-span-2">
                <JobDetails
                  job={selectedJob}
                  isJobSaved={isJobSaved}
                  hasApplied={hasAppliedToJob}
                  onToggleSaveJob={toggleSaveJob}
                  onOpenApplyModal={openApplyModal}
                  onViewApplication={handleViewApplication}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsTracker
            applications={applications}
            onViewJobDetails={handleViewJobDetails}
          />
        </TabsContent>
      </Tabs>

      {/* Apply Modal */}
      <ApplyModal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={selectedJob}
        currentUser={currentUser}
        onSubmit={handleSubmitApplication}
      />
    </div>
  );
} 
