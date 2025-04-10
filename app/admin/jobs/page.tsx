"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/basic/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/overlay/dialog";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Suspense } from "react";
import {
  Filter,
  FileSpreadsheet,
  Plus,
  Archive,
  Search,
} from "lucide-react";

// Import our custom components
import { JobList } from "@/components/Admin/Jobs/job-list";
import { JobDetailsAdmin } from "@/components/Admin/Jobs/job-details-admin";
import { JobModals } from "@/components/Admin/Jobs/job-modals";
import { JobFilters, JobFiltersRef } from "@/components/Admin/Jobs/job-filters";

// Import types and services
import { ExtendedJob, JobFilterInterface, JobType, JobTag, JOB_TAGS, NewJob } from "@/components/Admin/Jobs/types";
import { 
  fetchJobs, 
  createJob, 
  updateJob, 
  fetchJobsByArchiveStatus, 
  toggleJobArchive 
} from "@/components/Admin/Jobs/job-service";

export default function AdminJobListings() {
  // State Management
  const [jobs, setJobs] = useState<ExtendedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ExtendedJob | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [applicationsCount, setApplicationsCount] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Modal states
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isScrapingModalOpen, setIsScrapingModalOpen] = useState(false);
  const [isScrapingInProgress, setIsScrapingInProgress] = useState(false);

  // Form states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [scrapingUrl, setScrapingUrl] = useState("");
  const [editingJob, setEditingJob] = useState<ExtendedJob | null>(null);
  const [newJob, setNewJob] = useState<NewJob>({
    title: "",
    company: "",
    location: "",
    job_type: "FULL_TIME",
    description: "",
    website: "",
    tags: [],
    partner_id: null
  });

  // Filter state
  const [activeFilters, setActiveFilters] = useState<JobFilterInterface>({
    jobTypes: [],
    locations: [],
    remoteOnly: false,
    salary: [0, 200],
    experienceLevel: "any",
    keywords: "",
    tags: [],
  });

  // Add ref for job filters
  const jobFiltersRef = useRef<JobFiltersRef>(null);

  // Load jobs on initial render and when activeTab changes
  useEffect(() => {
    loadJobs();
  }, [activeTab]);

  // Effect to get application counts when jobs change
  useEffect(() => {
    const counts: Record<string, number> = {};
    jobs.forEach(job => {
      counts[job.job_id] = job._count?.applications || 0;
    });
    setApplicationsCount(counts);
  }, [jobs]);

  /**
   * Loads jobs from API
   */
  const loadJobs = async () => {
    setIsLoading(true);
    try {
      // Fetch jobs based on archived status
      const jobsData = await fetchJobsByArchiveStatus(activeTab === "archived");
      
      // Format jobs for consistency
      const formattedJobs = jobsData.map((job: any) => ({
        ...job,
        created_at: job.created_at ? new Date(job.created_at) : null
      }));
      
      setJobs(formattedJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
      alert("Failed to load jobs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter jobs based on current tab and filters
  const filteredJobs = useMemo(() => {
    // First filter by active/archived tab
    const jobsByStatus = jobs.filter(job => 
      activeTab === "active" ? !job.archived : job.archived
    );
    
    // Check if we have any active filters
    const hasActiveFilters = activeFilters.jobTypes.length > 0 || 
                            activeFilters.locations.length > 0 || 
                            activeFilters.remoteOnly || 
                            activeFilters.keywords.trim() !== "" || 
                            activeFilters.tags.length > 0;
    
    if (!hasActiveFilters) return jobsByStatus;
    
    // Apply filters to jobs
    return jobsByStatus.filter(job => {
      // For each filter type, check if the job matches
      // Only apply filters that are actually active (have values)
      
      // 1. Job Type filter
      if (activeFilters.jobTypes.length > 0) {
        // Convert job_type to string for comparison with filter values
        const jobTypeNormalized = job.job_type.toLowerCase();
        const matchesJobType = activeFilters.jobTypes.some(filterType => {
          // Allow case-insensitive matching
          const normalizedFilterType = filterType.toUpperCase();
          const normalizedJobType = job.job_type.toUpperCase();
          
          // Check direct match or match after removing underscores
          return normalizedJobType === normalizedFilterType || 
                 normalizedJobType === normalizedFilterType.replace(/_/g, '') ||
                 normalizedJobType.replace(/_/g, '') === normalizedFilterType;
        });
        
        if (!matchesJobType) {
          return false;
        }
      }
      
      // 2. Location filter
      if (activeFilters.locations.length > 0) {
        const jobLocationLower = (job.location || "").toLowerCase();
        const matchesLocation = activeFilters.locations.some(loc => {
          switch(loc) {
            case "remote":
              return jobLocationLower.includes("remote");
            case "onsite":
              return jobLocationLower.includes("onsite") || 
                     jobLocationLower.includes("on-site") || 
                     jobLocationLower.includes("on site") ||
                     (!jobLocationLower.includes("remote") && !jobLocationLower.includes("hybrid"));
            case "hybrid":
              return jobLocationLower.includes("hybrid");
            default:
              return false;
          }
        });
        
        if (!matchesLocation) {
          return false;
        }
      }
      
      // 3. Remote-only filter
      if (activeFilters.remoteOnly) {
        const isRemote = (job.location || "").toLowerCase().includes("remote");
        if (!isRemote) {
          return false;
        }
      }
      
      // 4. Keyword filter
      if (activeFilters.keywords.trim() !== "") {
        const keywordsLower = activeFilters.keywords.toLowerCase();
        const matchesKeyword = 
          job.title.toLowerCase().includes(keywordsLower) ||
          job.company.toLowerCase().includes(keywordsLower) ||
          (job.description || "").toLowerCase().includes(keywordsLower) ||
          (job.location || "").toLowerCase().includes(keywordsLower) ||
          job.tags?.some(tag => tag.toLowerCase().includes(keywordsLower));
        
        if (!matchesKeyword) {
          return false;
        }
      }
      
      // 5. Tags filter
      if (activeFilters.tags.length > 0) {
        // Need to check if the job has any of the selected tags
        if (!job.tags || job.tags.length === 0) {
          return false;
        }
        
        // Normalize tags for case-insensitive matching
        const normalizedJobTags = job.tags.map(tag => tag.toLowerCase());
        const normalizedFilterTags = activeFilters.tags.map(tag => tag.toLowerCase());
        
        // Check if any filter tag matches any job tag
        const hasMatchingTag = normalizedFilterTags.some(filterTag => 
          normalizedJobTags.some(jobTag => 
            jobTag === filterTag || 
            jobTag.includes(filterTag) || 
            filterTag.includes(jobTag)
          )
        );
        
        if (!hasMatchingTag) {
          return false;
        }
      }
      
      // If we get here, the job passed all active filters
      return true;
    });
  }, [jobs, activeTab, activeFilters]);

  // Apply filters function with debugging
  const applyFilters = (filters: JobFilterInterface) => {
    console.log("Applying filters:", filters);
    setActiveFilters(filters);
    setFilterModalOpen(false);
  };

  // Filter reset function with feedback
  const resetFilters = () => {
    console.log("Resetting filters");
    const defaultFilters: JobFilterInterface = {
      jobTypes: [],
      locations: [],
      remoteOnly: false,
      salary: [0, 200],
      experienceLevel: "any",
      keywords: "",
      tags: [],
    };
    setActiveFilters(defaultFilters);
    
    // Reset filter ref state if it exists
    if (jobFiltersRef.current) {
      jobFiltersRef.current.resetFilters();
    }
  };

  // Track active filter count for UI feedback
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += activeFilters.jobTypes.length;
    count += activeFilters.locations.length;
    if (activeFilters.remoteOnly) count += 1;
    if (activeFilters.keywords.trim() !== "") count += 1;
    count += activeFilters.tags.length;
    return count;
  }, [activeFilters]);

  const handleArchiveJob = async () => {
    if (selectedJob) {
      try {
        // Update the job in the database with archive status toggled
        await toggleJobArchive(selectedJob.job_id, !selectedJob.archived);
        
        // Update the UI state
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.job_id === selectedJob.job_id 
              ? { ...job, archived: !selectedJob.archived } 
              : job
          )
        );
        
        if (selectedJob.archived) {
          setSelectedJob({...selectedJob, archived: false});
        } else {
          setSelectedJob(null);
        }
        
        setIsArchiveModalOpen(false);
      } catch (error) {
        console.error("Error updating job archive status:", error);
        alert("Failed to update job");
      }
    }
  };

  const handleAddJob = async () => {
    // Validate required fields
    if (!newJob.title || !newJob.company || !newJob.location) {
      alert("Please fill in all required fields");
      return;
    }
    
    try {
      // Create job via API
      const result = await createJob(newJob);
      const createdJob = result.job;
      
      // Add the new job to the UI state with proper type handling
      const extendedJob: ExtendedJob = {
        ...createdJob,
        created_at: createdJob.created_at ? new Date(createdJob.created_at) : null,
      };
      
      setJobs(prevJobs => [...prevJobs, extendedJob]);
      
      // Update application counts
      setApplicationsCount(prev => ({
        ...prev,
        [createdJob.job_id.toString()]: 0
      }));
      
      setIsAddJobModalOpen(false);
      
      // Reset form
      setNewJob({
        title: "",
        company: "",
        location: "",
        job_type: "FULL_TIME",
        description: "",
        website: "",
        tags: [],
        partner_id: null
      });
      
      // Select the newly created job
      setSelectedJob(extendedJob);
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };
  
  const handleEditJob = async () => {
    if (!editingJob) {
      console.error("No job data available for editing");
      return;
    }
    
    try {
      // Update job via API
      const result = await updateJob(editingJob.job_id, {
        title: editingJob.title,
        company: editingJob.company,
        location: editingJob.location,
        job_type: editingJob.job_type,
        description: editingJob.description,
        website: editingJob.website,
        tags: editingJob.tags,
      });
      
      const updatedJob = result.job;
      
      // Update UI with the edited job
      const extendedUpdatedJob: ExtendedJob = {
        ...updatedJob,
        archived: editingJob.archived || false,
        created_at: updatedJob.created_at ? new Date(updatedJob.created_at) : null,
      };
      
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.job_id === editingJob.job_id 
            ? extendedUpdatedJob
            : job
        )
      );
      
      // Update selected job if it's the one being edited
      if (selectedJob?.job_id === editingJob.job_id) {
        setSelectedJob(extendedUpdatedJob);
      }
      
      setIsEditModalOpen(false);
      
      // Success message
      alert("Job updated successfully!");
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };
  
  const handleImportCSV = async () => {
    if (!csvFile) {
      alert("Please select a CSV file first");
      return;
    }
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Validate headers
        const requiredHeaders = ['Title', 'Company', 'Location'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          alert(`Missing required headers: ${missingHeaders.join(', ')}`);
          return;
        }
        
        const importedJobs: ExtendedJob[] = [];
        let importCount = 0;
        let failures = 0;
        
        // Process each line (skip header)
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(',');
          const job: any = {};
          
          // Map CSV columns to job properties
          headers.forEach((header, index) => {
            const value = values[index]?.trim();
            if (value) {
              switch(header.toLowerCase()) {
                case 'title': job.title = value; break;
                case 'company': job.company = value; break;
                case 'location': job.location = value; break;
                case 'type': job.job_type = value as JobType; break;
                case 'description': job.description = value; break;
                case 'website': job.website = value; break;
                case 'tags': job.tags = value.split(';') as JobTag[]; break;
                case 'partnerid': 
                  const partnerId = parseInt(value);
                  job.partner_id = isNaN(partnerId) ? null : partnerId; 
                  break;
              }
            }
          });
          
          // Validate required fields
          if (job.title && job.company && job.location) {
            try {
              // Create job via API
              const result = await createJob(job);
              const createdJob = result.job;
              
              importedJobs.push(createdJob);
              importCount++;
            } catch (error) {
              console.error(`Failed to import job #${i}:`, error);
              failures++;
            }
          }
        }
        
        // Update UI with the new jobs
        if (importedJobs.length > 0) {
          setJobs(prevJobs => [...prevJobs, ...importedJobs]);
        }
        
        setIsImportModalOpen(false);
        setCsvFile(null);
        
        if (failures > 0) {
          alert(`${importCount} jobs have been imported successfully! (${failures} failed)`);
        } else {
          alert(`${importCount} jobs have been imported successfully!`);
        }
      };
      
      reader.readAsText(csvFile);
    } catch (error) {
      console.error("Error importing CSV:", error);
      alert("Failed to import CSV file");
    }
  };
  
  const handleTagChange = (tag: JobTag) => {
    setNewJob(prev => {
      // If tag already exists, remove it; otherwise add it
      const updatedTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      return {
        ...prev,
        tags: updatedTags
      };
    });
  };
  
  const handleEditTagChange = (tag: JobTag) => {
    if (!editingJob) return;
    
    setEditingJob(prev => {
      if (!prev) return prev;
      
      // If tag already exists, remove it; otherwise add it
      const updatedTags = prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag];
      
      return {
        ...prev,
        tags: updatedTags
      };
    });
  };

  const downloadCsvTemplate = () => {
    const headers = "Title,Company,Location,Type,Description,Website,Tags,PartnerId\n";
    const exampleRow = "Frontend Developer,Example Company,Philadelphia PA,FULL_TIME,Job description goes here,https://example.com,FRONT_END;FULLY_REMOTE,1\n";
    
    const csvContent = headers + exampleRow;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'job_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWebScraping = async () => {
    if (!scrapingUrl) {
      alert("Please enter a job listing URL");
      return;
    }
    
    // Check if scraping is already in progress
    if (isScrapingInProgress) {
      return;
    }
    
    // Basic URL validation
    try {
      new URL(scrapingUrl);
    } catch (error) {
      alert("Please enter a valid URL");
      return;
    }
    
    setIsScrapingInProgress(true);
    
    // Simulate web scraping with a timeout
    setTimeout(async () => {
      try {
        // Create a demo job from "scraping"
        const jobData = {
          title: "Web Developer (Scraped)",
          company: new URL(scrapingUrl).hostname.replace('www.', ''),
          location: "Philadelphia, PA",
          job_type: "FULL_TIME" as JobType,
          description: "This is a simulated job scraped from " + scrapingUrl,
          website: scrapingUrl,
          tags: ["FRONT_END", "FULLY_REMOTE"] as JobTag[],
          partner_id: newJob.partner_id // Use the partner ID from the form
        };
        
        // Create the job via API
        const result = await createJob(jobData);
        const createdJob = result.job;
        
        // Update UI
        setJobs(prevJobs => [...prevJobs, createdJob]);
        setSelectedJob(createdJob);
        
        alert("Job successfully scraped and added!");
      } catch (error) {
        console.error("Error scraping job:", error);
        alert("Failed to scrape job from the provided URL");
      } finally {
        setScrapingUrl("");
        setIsScrapingInProgress(false);
        setIsScrapingModalOpen(false);
      }
    }, 2000);
  };

  // Update the openEditModal function to properly handle the job data
  const openEditModal = (job: ExtendedJob) => {
    // Create a deep copy of the job to avoid reference issues
    const jobCopy = {
      ...job,
      // Ensure job_type is one of the expected values
      job_type: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "APPRENTICESHIP"].includes(job.job_type) ?
                job.job_type as JobType : "FULL_TIME"
    };
    
    setEditingJob(jobCopy);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="container mx-auto px-4">
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Jobs
          </h1>
          <p className="text-gray-500 mt-1">
            Connect high school students with local tech opportunities
          </p>
        </div>

        {/* Consolidated Action Bar */}
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div>
            <h3 className="font-medium text-base mb-1">Manage Job Listings</h3>
            <p className="text-sm text-gray-600">
              Create or import job opportunities for students
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
            <Button
              className="text-sm gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white"
              onClick={() => setIsAddJobModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add New Job
            </Button>
                <Button
                  variant="outline"
                  className="text-sm gap-1"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <FileSpreadsheet className="h-4 w-4" />
              Import Jobs
                </Button>
                <Button
              variant="outline" 
              className="text-sm gap-1"
              onClick={() => setIsScrapingModalOpen(true)}
                >
                  <Search className="h-4 w-4" />
                  Web Scraping
                </Button>
              </div>
            </div>

        {/* Tab Navigation for Active/Archived */}
        <div className="mb-3 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              className={`py-1.5 px-1 -mb-px text-sm font-medium ${
                activeTab === "active"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => {
                setActiveTab("active");
                setSelectedJob(null);
              }}
            >
              Active Jobs
            </button>
            <button
              className={`py-1.5 px-1 -mb-px text-sm font-medium flex items-center gap-1 ${
                activeTab === "archived"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => {
                setActiveTab("archived");
                setSelectedJob(null);
              }}
            >
              <Archive className="h-4 w-4" />
              Archived Jobs
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search jobs, companies, or keywords..."
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
              Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Job Listings Column */}
          <Card className="lg:col-span-1 max-h-[calc(100vh-250px)] overflow-hidden flex flex-col">
            <CardHeader className="py-3">
              <CardTitle>{activeTab === "active" ? "Job Listings" : "Archived Jobs"}</CardTitle>
              <CardDescription>{filteredJobs.length} jobs found</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-3">
              <Suspense fallback={<p>Loading...</p>}>
                <JobList
                  jobs={filteredJobs}
                  selectedJob={selectedJob}
                  onSelectJob={setSelectedJob}
                  applicationsCount={applicationsCount}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                />
              </Suspense>
            </CardContent>
          </Card>

          {/* Job Details Column */}
          <Card className="lg:col-span-2 max-h-[calc(100vh-250px)] overflow-hidden flex flex-col">
            <CardContent className="p-0 flex-1 overflow-auto">
              <Suspense fallback={<p>Loading...</p>}>
                <JobDetailsAdmin
                  job={selectedJob}
                  applicationsCount={applicationsCount}
                  isLoading={isLoading}
                  onEdit={openEditModal}
                  onArchive={() => setIsArchiveModalOpen(true)}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <JobModals
        // Add Job Modal
        isAddJobModalOpen={isAddJobModalOpen}
        setIsAddJobModalOpen={setIsAddJobModalOpen}
        newJob={newJob}
        setNewJob={setNewJob}
        handleAddJob={handleAddJob}
        handleTagChange={handleTagChange}
        
        // Edit Job Modal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editingJob={editingJob}
        setEditingJob={setEditingJob}
        handleEditJob={handleEditJob}
        handleEditTagChange={handleEditTagChange}
        
        // Archive Job Modal
        isArchiveModalOpen={isArchiveModalOpen}
        setIsArchiveModalOpen={setIsArchiveModalOpen}
        selectedJob={selectedJob}
        handleArchiveJob={handleArchiveJob}
        
        // Import CSV Modal
        isImportModalOpen={isImportModalOpen}
        setIsImportModalOpen={setIsImportModalOpen}
        csvFile={csvFile}
        setCsvFile={setCsvFile}
        handleImportCSV={handleImportCSV}
        downloadCsvTemplate={downloadCsvTemplate}
        
        // Web Scraping Modal
        isScrapingModalOpen={isScrapingModalOpen}
        setIsScrapingModalOpen={setIsScrapingModalOpen}
        scrapingUrl={scrapingUrl}
        setScrapingUrl={setScrapingUrl}
        isScrapingInProgress={isScrapingInProgress}
        handleWebScraping={handleWebScraping}
      />

      {/* Filter Dialog */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Jobs</DialogTitle>
            <DialogDescription>
              Filter job listings by type, location, and keywords
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <JobFilters 
              ref={jobFiltersRef}
              onApply={applyFilters}
              initialFilters={activeFilters}
              availableTags={JOB_TAGS}
            />
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button onClick={() => {
              if (jobFiltersRef.current) {
                const currentFilters = jobFiltersRef.current.getCurrentFilters();
                applyFilters(currentFilters);
              }
            }}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}