"use client";

import { Suspense, useMemo, useRef } from "react";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  FileSpreadsheet,
  Archive,
} from "lucide-react";
import { jobService } from "@/lib/local-storage";
import type { Job } from "@/lib/local-storage";
import { Badge } from "@/components/ui/basic/badge";
import { CompanyLogo } from "@/components/ui/basic/company-logo";
import { cn } from "@/lib/utils";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { JobFilters, JobFiltersRef } from "@/components/job-filters";
import { Textarea } from "@/components/ui/form/textarea";
import { Label } from "@/components/ui/basic/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";

// Extend the Job type to include the archived property
interface ExtendedJob extends Job {
  archived?: boolean;
}

// Define interface to match JobFilters component requirements
interface JobFilterInterface {
  jobTypes: string[];
  locations: string[];
  remoteOnly: boolean;
  salary: [number, number];
  experienceLevel: string;
  keywords: string;
  tags: string[];
}

// Define the valid enum values based on the database schema
const JOB_TAGS = [
  "fully-remote", "hybrid", "in-person", "front-end", "back-end", "full-stack", 
  "non-profit", "start-up", "education", "healthcare", "fintech", "marketing", 
  "data science", "cybersecurity", "ux/ui design", "IT", "product management", 
  "game development", "AL/ML", "cloud computing", "devops", "business analysis", "social media"
];

const APPLICATION_STATUSES = [
  "interested", "applied", "rejected", "interviewing", "negotiating", "accepted"
];

/**
 * Renders an animated skeleton placeholder for the job list.
 * Displays six placeholder cards with a pulsing animation to simulate the loading state
 * of job cards while data is being fetched.
 *
 * @returns A JSX element containing six animated loading cards.
 */
function JobListSkeleton() {
  return (
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
  );
}

/**
 * Renders a loading skeleton for the job details view.
 *
 * This component displays animated placeholders mimicking the layout of job details, including a header, image, and text blocks, while the actual data is being loaded.
 */
function JobDetailsSkeleton() {
  return (
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
  );
}

// Props interfaces
interface JobListProps {
  jobs: ExtendedJob[];
  selectedJob: ExtendedJob | null;
  onSelectJob: (job: ExtendedJob) => void;
  applicationsCount: Record<string, number>;
  isLoading: boolean;
  searchQuery: string;
}

interface JobDetailsProps {
  job: ExtendedJob | null;
  applicationsCount: Record<string, number>;
  isLoading: boolean;
  onEdit: (job: ExtendedJob) => void;
  onArchive: () => void;
}

/**
 * Renders a list of job cards with filtering and loading support.
 *
 * When in a loading state, the component displays a skeleton placeholder. After data is loaded, it applies a case-insensitive
 * search filter across job title, company, description, and location. Each job is presented as a clickable card styled by
 * its type, with a visual highlight for the currently selected job. Clicking a card invokes the provided selection callback.
 *
 * @param jobs - Array of job objects to display.
 * @param selectedJob - The job currently selected, used to visually highlight its card.
 * @param onSelectJob - Callback invoked when a job card is clicked.
 * @param applicationsCount - Mapping of job IDs to their applicant counts.
 * @param isLoading - Indicator for whether job data is being loaded.
 * @param searchQuery - String used to filter job listings.
 * @returns JSX element representing either the loading skeleton or the filtered list of job cards.
 */
function JobList({
  jobs,
  selectedJob,
  onSelectJob,
  applicationsCount,
  isLoading,
  searchQuery,
}: JobListProps) {
  if (isLoading) return <JobListSkeleton />;

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-3">
      {filteredJobs.map((job) => (
        <Card
          key={`job-${job.job_id || Math.random()}`}
          className={cn(
            "cursor-pointer hover:shadow transition-shadow",
            selectedJob?.job_id === job.job_id
              ? "ring-2 ring-blue-400 border-l-4"
              : "border-l-4",
            job.job_type === "internship"
              ? "border-blue-400"
              : job.job_type === "part_time"
                ? "border-green-400"
                : "border-orange-400",
          )}
          onClick={() => onSelectJob(job)}
        >
          <CardContent className="p-3">
            <div className="flex gap-3">
              <CompanyLogo company={job.company} size="sm" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {job.company}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {job.location}
                  </span>
                  <Badge
                    className={cn(
                      "text-xs",
                      job.job_type === "internship"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        : job.job_type === "part_time"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
                    )}
                  >
                    {applicationsCount[job.job_id] || 0} applicants
                  </Badge>
                </div>
                
                {/* Add tags display */}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 overflow-hidden">
                    {job.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{job.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {filteredJobs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No jobs found matching your criteria
        </div>
      )}
    </div>
  );
}

/**
 * Renders detailed information about a selected job listing.
 *
 * Displays a loading skeleton during data fetches and shows an informational prompt when no job is selected.
 * For a provided job, it presents job details—including title, company information, location, job type,
 * description, requirements, and the number of applications—along with buttons to edit or delete the job.
 *
 * @param job - The current job to display. If absent, a prompt to select a job is rendered.
 * @param applicationsCount - An object mapping job IDs to their corresponding application counts.
 * @param isLoading - Indicates whether the job details are currently loading.
 * @param onEdit - Callback function triggered when the edit action is selected.
 * @param onArchive - Callback function triggered when the archive action is selected.
 *
 * @returns A React element representing the job details view.
 */
function JobDetails({
  job,
  applicationsCount,
  isLoading,
  onEdit,
  onArchive,
}: JobDetailsProps) {
  if (isLoading) return <JobDetailsSkeleton />;

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
        <Button className="bg-launchpad-blue hover:bg-launchpad-teal text-white">
          <Plus className="h-4 w-4 mr-2" /> Add New Job
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onEdit(job)}
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          {job.archived ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
              onClick={onArchive}
            >
              <Archive className="h-4 w-4" /> Restore
            </Button>
          ) : (
          <Button
            variant="danger"
            size="sm"
            className="gap-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              onClick={onArchive}
          >
              <Trash2 className="h-4 w-4" /> Archive
          </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <CompanyLogo company={job.company} size="md" />
        <div>
          <h3 className="font-medium text-lg text-foreground">{job.company}</h3>
          <p className="text-muted-foreground">{job.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted p-3 rounded">
          <p className="text-xs text-muted-foreground">Job Type</p>
          <p className="font-medium text-foreground">{job.job_type}</p>
        </div>
        {job.tags && job.tags.length > 0 && (
        <div className="bg-muted p-3 rounded">
            <p className="text-xs text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {Array.isArray(job.tags) && job.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
        </div>
        </div>
        )}
        <div className="bg-muted p-3 rounded">
          <p className="text-xs text-muted-foreground">Applications</p>
          <p className="font-medium text-foreground">
            {applicationsCount[job.job_id] || 0}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2 text-foreground">Job Description</h3>
        <div className="text-muted-foreground whitespace-pre-line">
          {job.description || "No description provided"}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2 text-foreground">Requirements</h3>
        <div className="text-muted-foreground">
          {Array.isArray(job.tags) ? (
            <ul className="list-disc pl-4 space-y-1">
              {job.tags.map((tag: string, index: number) => (
                <li key={`req-${index}`}>{tag}</li>
              ))}
            </ul>
          ) : (
            <p>No requirements specified</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the admin job listings interface.
 *
 * This React component manages the UI and state for displaying job listings and their details, along with functionalities
 * for searching, filtering, editing, deleting, and importing jobs. It loads dummy data to simulate backend responses and
 * uses modals to handle user interactions for applying filters, confirming deletions, editing job details, and importing CSV files.
 *
 * @returns The JSX element representing the admin job listings page.
 */
export default function AdminJobListings() {
  const [jobs, setJobs] = useState<ExtendedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ExtendedJob | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<JobFilterInterface>({
    jobTypes: [],
    locations: [],
    remoteOnly: false,
    salary: [0, 200],
    experienceLevel: "any",
    keywords: "",
    tags: [],
  });
  const [applicationsCount, setApplicationsCount] = useState<
    Record<string, number>
  >({});
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [editingJob, setEditingJob] = useState<ExtendedJob | null>(null);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "full_time",
    description: "",
    website: "",
    tags: [] as string[],
  });
  const [isScrapingModalOpen, setIsScrapingModalOpen] = useState(false);
  const [scrapingUrl, setScrapingUrl] = useState("");
  const [isScrapingInProgress, setIsScrapingInProgress] = useState(false);
  const jobFiltersRef = useRef<JobFiltersRef>(null);

  useEffect(() => {
    loadJobs();
  }, []);

    const loadJobs = async () => {
      try {
        setIsLoading(true);

      // Try to load jobs from local storage first
      let storedJobs = await jobService.getAll();
      
      // If no jobs exist in local storage, create dummy data
      if (!storedJobs || storedJobs.length === 0) {
        // DUMMY DATA - In a real app, this would come from a backend API
        // Philadelphia-specific tech internships for high school students
        const dummyJobs: ExtendedJob[] = [
          {
            job_id: 1,
            job_type: "internship",
            title: "Web Development Intern",
            description:
              "Join our team to learn modern web development skills including HTML, CSS, JavaScript, and React. Perfect for high school students interested in coding.",
            company: "Philly Tech Forward",
            website: "https://phillytechforward.org",
            location: "Philadelphia, PA (Center City)",
            partner_id: 1,
            created_at: new Date().toISOString(),
            tags: ["HTML", "CSS", "JavaScript", "React", "High School"],
            archived: false,
          },
          {
            job_id: 2,
            job_type: "part_time",
            title: "Junior UX Designer",
            description:
              "Work with our UX team to design user interfaces for educational apps. We'll teach you design principles and tools like Figma.",
            company: "EduTech Solutions",
            website: "https://edutechsolutions.org",
            location: "Philadelphia, PA (University City)",
            partner_id: 2,
            created_at: new Date().toISOString(),
            tags: ["UI/UX", "Figma", "Design", "Educational Apps"],
            archived: false,
          },
          {
            job_id: 3,
            job_type: "internship",
            title: "Data Science Explorer",
            description:
              "Learn the basics of data analysis and visualization. Great opportunity for math-inclined students to explore tech careers.",
            company: "Data Insights Philly",
            website: "https://datainsightsphilly.org",
            location: "Remote (Philadelphia based)",
            partner_id: 3,
            created_at: new Date().toISOString(),
            tags: ["Data Analysis", "Python", "Math", "Remote"],
            archived: false,
          },
          {
            job_id: 4,
            job_type: "internship",
            title: "IT Support Assistant",
            description:
              "Get hands-on experience with hardware, networking, and troubleshooting in our tech lab.",
            company: "PhillyTech Nonprofit",
            website: "https://phillytechnonprofit.org",
            location: "Philadelphia, PA (North Philly)",
            partner_id: 4,
            created_at: new Date().toISOString(),
            tags: ["Hardware", "Networking", "Technical Support"],
            archived: false,
          },
          {
            job_id: 5,
            job_type: "part_time",
            title: "Digital Marketing Assistant",
            description:
              "Learn social media marketing, content creation, and basic analytics for tech-focused campaigns.",
            company: "Tech Outreach Philly",
            website: "https://techoutreachphilly.org",
            location: "Hybrid (Philadelphia)",
            partner_id: 5,
            created_at: new Date().toISOString(),
            tags: ["Social Media", "Content Creation", "Analytics"],
            archived: false,
          },
        ];
        
        // Save dummy jobs to local storage
        for (const job of dummyJobs) {
          await jobService.create(job);
        }
        
        storedJobs = dummyJobs;
      }

      // Add archived property if it doesn't exist
      const updatedJobs = storedJobs.map(job => ({
        ...job,
        archived: job.archived || false
      }));

      setJobs(updatedJobs);

        // Count applications per job (dummy data)
        const dummyApplicationCounts: Record<string, number> = {
          "1": 8,
          "2": 5,
          "3": 10,
          "4": 3,
          "5": 6,
        };

        setApplicationsCount(dummyApplicationCounts);

        // Set initial selected job if none selected
      if (updatedJobs.length > 0 && !selectedJob) {
        setSelectedJob(updatedJobs[0]);
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

  // Completely rebuild the filtering system to work correctly
  // Calculate filtered jobs based on active filters and tab
  const filteredJobs = useMemo(() => {
    console.log("Filtering jobs with filters:", activeFilters);
    console.log("Current jobs:", jobs);
    
    // First filter by archived status based on active tab
    const jobsByStatus = jobs.filter(job => 
      activeTab === "active" ? !job.archived : job.archived
    );
    
    // Check if we have any active filters
    const hasActiveFilters = 
      activeFilters.jobTypes.length > 0 || 
      activeFilters.locations.length > 0 || 
      activeFilters.remoteOnly || 
      activeFilters.keywords.trim() !== "" ||
      activeFilters.tags.length > 0;
    
    // If no filters active, return all jobs for the current tab
    if (!hasActiveFilters) return jobsByStatus;
    
    // Apply filters to jobs
    return jobsByStatus.filter(job => {
      // For each filter type, check if the job matches
      // Only apply filters that are actually active (have values)
      
      // 1. Job Type filter
      if (activeFilters.jobTypes.length > 0) {
        if (!activeFilters.jobTypes.includes(job.job_type)) {
          console.log(`Job ${job.title} filtered out by job type. Job has ${job.job_type}, filter wants ${activeFilters.jobTypes}`);
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
          console.log(`Job ${job.title} filtered out by location. Job has ${job.location}, filter wants ${activeFilters.locations}`);
          return false;
        }
      }
      
      // 3. Remote-only filter
      if (activeFilters.remoteOnly) {
        const isRemote = (job.location || "").toLowerCase().includes("remote");
        if (!isRemote) {
          console.log(`Job ${job.title} filtered out by remote-only. Job has ${job.location}`);
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
          console.log(`Job ${job.title} filtered out by keywords. Filter wants ${activeFilters.keywords}`);
          return false;
        }
      }
      
      // 5. Tags filter
      if (activeFilters.tags.length > 0) {
        // Need to check if the job has any of the selected tags
        if (!job.tags || job.tags.length === 0) {
          console.log(`Job ${job.title} filtered out by tags - job has no tags`);
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
          console.log(`Job ${job.title} filtered out by tags. Job has ${job.tags}, filter wants ${activeFilters.tags}`);
          return false;
        }
      }
      
      // If we get here, the job passed all active filters
      console.log(`Job ${job.title} passed all filters`);
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
    const defaultFilters: JobFilterInterface = {
      jobTypes: [],
      locations: [],
      remoteOnly: false,
      salary: [0, 200],
      experienceLevel: "any",
      keywords: "",
      tags: [],
    };
    console.log("Resetting filters to defaults");
    setActiveFilters(defaultFilters);
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
        // Get full job data
        const jobToUpdate = await jobService.getById(selectedJob.job_id);
        
        if (jobToUpdate) {
          // Update job with archived flag - if already archived, restore it
          const isCurrentlyArchived = selectedJob.archived || false;
          const updatedJob = {
            ...jobToUpdate,
            archived: !isCurrentlyArchived
          };
          
          // Save to local storage
          await jobService.update(updatedJob);
          
          // Update UI
          setJobs(prevJobs => 
            prevJobs.map(job => 
              job.job_id === selectedJob.job_id 
                ? { ...job, archived: !isCurrentlyArchived } 
                : job
            )
          );
          
          // If we're restoring the job, set it as the selected job
          if (isCurrentlyArchived) {
            setSelectedJob({...selectedJob, archived: false});
          } else {
            // If we're archiving, deselect the job
      setSelectedJob(null);
          }
          
          setIsArchiveModalOpen(false);
        }
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
      // Generate a new job ID
      const job_id = Math.max(...jobs.map(job => job.job_id), 0) + 1;
      
      const newJobData: ExtendedJob = {
        ...newJob,
        job_id,
        partner_id: 1, // This would come from partner selection in a real app
        created_at: new Date().toISOString(),
        archived: false
      };
      
      // Save to local storage
      await jobService.create(newJobData);
      
      // Update UI
      setJobs(prevJobs => [...prevJobs, newJobData]);
      setIsAddJobModalOpen(false);
      
      // Reset form
      setNewJob({
        title: "",
        company: "",
        location: "",
        job_type: "full_time",
        description: "",
        website: "",
        tags: [],
      });
      
      // Select the newly created job
      setSelectedJob(newJobData);
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job");
    }
  };
  
  const handleEditJob = async () => {
    if (!editingJob) {
      console.error("No job data available for editing");
      return;
    }
    
    try {
      console.log("Saving edited job:", editingJob);
      
      // Save to local storage
      await jobService.update(editingJob);
      
      // Update UI
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.job_id === editingJob.job_id 
            ? editingJob 
            : job
        )
      );
      
      // Update selected job if it's the same one
      if (selectedJob?.job_id === editingJob.job_id) {
        setSelectedJob(editingJob);
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
                case 'type': job.job_type = value; break;
                case 'description': job.description = value; break;
                case 'website': job.website = value; break;
                case 'tags': job.tags = value.split(';'); break;
              }
            }
          });
          
          // Validate required fields
          if (job.title && job.company && job.location) {
            // Generate a job ID
            const job_id = Math.max(...jobs.map(j => j.job_id), 0) + importCount + 1;
            
            const newJob: ExtendedJob = {
              ...job,
              job_id,
              partner_id: 1,
              created_at: new Date().toISOString(),
              job_type: job.job_type || 'internship',
              archived: false
            };
            
            // Save to local storage
            await jobService.create(newJob);
            importedJobs.push(newJob);
            importCount++;
          }
        }
        
        // Update UI with the new jobs
        setJobs(prevJobs => [...prevJobs, ...importedJobs]);
        setIsImportModalOpen(false);
        setCsvFile(null);
        
        alert(`${importCount} jobs have been imported successfully!`);
      };
      
      reader.readAsText(csvFile);
    } catch (error) {
      console.error("Error importing CSV:", error);
      alert("Failed to import CSV file");
    }
  };
  
  const handleTagChange = (tag: string) => {
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
  
  const handleEditTagChange = (tag: string) => {
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
    const headers = "Title,Company,Location,Type,Description,Website,Tags\n";
    const exampleRow = "Frontend Developer,Example Company,Philadelphia PA,full_time,Job description goes here,https://example.com,JavaScript;React;CSS\n";
    
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
    setTimeout(() => {
      try {
        // Create a demo job from "scraping"
        const scrapedJob: ExtendedJob = {
          job_id: Math.max(...jobs.map(job => job.job_id), 0) + 1,
          title: "Web Developer (Scraped)",
          company: new URL(scrapingUrl).hostname.replace('www.', ''),
          location: "Philadelphia, PA",
          job_type: "full_time",
          description: "This is a simulated job scraped from " + scrapingUrl,
          website: scrapingUrl,
          partner_id: 1,
          created_at: new Date().toISOString(),
          tags: ["Web", "Developer", "Scraped"],
          archived: false
        };
        
        // Save to local storage
        jobService.create(scrapedJob);
        
        // Update UI
        setJobs(prevJobs => [...prevJobs, scrapedJob]);
        setSelectedJob(scrapedJob);
        
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
      job_type: job.job_type === 'full_time' || job.job_type === 'part_time' || 
                job.job_type === 'contract' || job.job_type === 'internship' ? 
                job.job_type : 'full_time'
    };
    
    console.log("Opening edit modal with job data:", job);
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
              onClick={() => setActiveTab("active")}
            >
              Active Jobs
            </button>
            <button
              className={`py-1.5 px-1 -mb-px text-sm font-medium flex items-center gap-1 ${
                activeTab === "archived"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("archived")}
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
              <Suspense fallback={<JobListSkeleton />}>
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
          <Card className="lg:col-span-2 max-h-[calc(100vh-250px)] overflow-auto">
            <Suspense fallback={<JobDetailsSkeleton />}>
              <JobDetails
                job={selectedJob}
                applicationsCount={applicationsCount}
                isLoading={isLoading}
                onEdit={openEditModal}
                onArchive={() => setIsArchiveModalOpen(true)}
              />
            </Suspense>
          </Card>
        </div>
      </div>

      {/* Filter Modal */}
      <MultiPurposeModal
        open={filterModalOpen}
        onOpenChange={(open) => {
          setFilterModalOpen(open);
        }}
        title="Filter Jobs"
        size="md"
        showFooter={true}
        primaryActionText="Apply Filters"
        onPrimaryAction={() => {
          // Call the applyFilters method on the JobFilters component through the ref
          jobFiltersRef.current?.applyFilters();
          setFilterModalOpen(false);
        }}
        secondaryActionText="Reset Filters"
        onSecondaryAction={() => {
          // Call the resetFilters method on the JobFilters component through the ref
          jobFiltersRef.current?.resetFilters();
        }}
      >
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Select filters and click Apply when ready
          </p>
          
          {/* Current filter summary */}
          {activeFilterCount > 0 && (
            <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-200">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-blue-700">
                  Active filters: {activeFilterCount}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => jobFiltersRef.current?.resetFilters()}
                  className="h-7 text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {activeFilters.jobTypes.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {activeFilters.jobTypes.length} job types
                  </Badge>
                )}
                {activeFilters.locations.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {activeFilters.locations.length} locations
                  </Badge>
                )}
                {activeFilters.remoteOnly && (
                  <Badge className="bg-blue-100 text-blue-800">
                    Remote only
                  </Badge>
                )}
                {activeFilters.tags.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {activeFilters.tags.length} tags
                  </Badge>
                )}
                {activeFilters.keywords.trim() !== "" && (
                  <Badge className="bg-blue-100 text-blue-800">
                    Keywords
                  </Badge>
                )}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Showing: {filteredJobs.length} jobs
              </p>
            </div>
          )}
          
        <JobFilters
            ref={jobFiltersRef}
            onApply={applyFilters}
          initialFilters={activeFilters}
            availableTags={JOB_TAGS}
        />
        </div>
      </MultiPurposeModal>

      {/* Archive Confirmation Modal */}
      <MultiPurposeModal
        open={isArchiveModalOpen}
        onOpenChange={setIsArchiveModalOpen}
        title={selectedJob?.archived ? "Restore Job Listing" : "Archive Job Listing"}
        size="sm"
        showFooter={true}
        primaryActionText={selectedJob?.archived ? "Restore" : "Archive"}
        onPrimaryAction={handleArchiveJob}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsArchiveModalOpen(false)}
      >
        <div className="py-4 space-y-4">
          {selectedJob?.archived ? (
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to restore this job listing? It will become visible to applicants again.
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to archive this job listing? Archived jobs will no longer be visible to applicants.
            </p>
          )}
        <div className="text-muted-foreground">
            {selectedJob?.archived ? 
              "Restored jobs will appear in the active jobs list." : 
              "You can view and restore archived jobs in the archive section."}
          </div>
        </div>
      </MultiPurposeModal>

      {/* Edit Job Modal */}
      <MultiPurposeModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditModalOpen(false);
            // Don't reset editingJob immediately to prevent form from clearing before animation completes
            setTimeout(() => setEditingJob(null), 300);
          }
        }}
        title="Edit Job"
        size="lg"
        showFooter={true}
        primaryActionText="Save Changes"
        onPrimaryAction={handleEditJob}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsEditModalOpen(false)}
      >
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500 mb-4">Update job posting details</p>
          
          {/* Show a message if no job data is available */}
          {!editingJob && (
            <div className="text-center py-4 text-red-500">
              Error: No job data available for editing
            </div>
          )}
          
          {/* Keep the form fields always visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-job-title" className="mb-1 block">Job Title</Label>
              <Input 
                id="edit-job-title" 
                value={editingJob?.title || ''}
                onChange={(e) => editingJob && setEditingJob({...editingJob, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-company" className="mb-1 block">Company</Label>
              <Input 
                id="edit-company" 
                value={editingJob?.company || ''}
                onChange={(e) => editingJob && setEditingJob({...editingJob, company: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-location" className="mb-1 block">Location</Label>
              <Input 
                id="edit-location" 
                value={editingJob?.location || ''}
                onChange={(e) => editingJob && setEditingJob({...editingJob, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-website" className="mb-1 block">Website (Optional)</Label>
              <Input 
                id="edit-website" 
                value={editingJob?.website || ''}
                onChange={(e) => editingJob && setEditingJob({...editingJob, website: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-job-type" className="mb-1 block">Job Type</Label>
              <Select 
                value={editingJob?.job_type || 'full_time'}
                onValueChange={(value) => editingJob && setEditingJob({...editingJob, job_type: value})}
              >
                <SelectTrigger id="edit-job-type">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="edit-description" className="mb-1 block">Job Description</Label>
            <Textarea 
              id="edit-description" 
              className="min-h-[150px]" 
              value={editingJob?.description || ''}
              onChange={(e) => editingJob && setEditingJob({...editingJob, description: e.target.value})}
            />
          </div>
          
          <div>
            <Label className="mb-1 block">Tags</Label>
            <div className="p-3 border rounded-md max-h-[150px] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {JOB_TAGS.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={editingJob?.tags?.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer ${editingJob?.tags?.includes(tag) ? "bg-blue-500" : ""}`}
                    onClick={() => handleEditTagChange(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Click tags to select/deselect</p>
          </div>
        </div>
      </MultiPurposeModal>

      {/* Import Jobs Modal */}
      <MultiPurposeModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        title="Import Jobs from CSV"
        size="md"
        showFooter={true}
        primaryActionText="Import Jobs"
        onPrimaryAction={handleImportCSV}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsImportModalOpen(false)}
      >
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Upload multiple job listings at once
          </p>
          <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <FileSpreadsheet className="h-10 w-10 text-gray-300 mb-2" />
              <h4 className="font-medium mb-1">Drop your CSV file here</h4>
              <p className="text-sm text-gray-500 mb-4">
                Make sure to follow the required format
              </p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                id="csv-file-input"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('csv-file-input')?.click()}
              >
                Browse Files
              </Button>
              {csvFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {csvFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="bg-launchpad-blue/5 p-4 rounded-md">
            <h4 className="font-medium mb-2 text-sm">
              CSV Format Requirements
            </h4>
            <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
              <li>
                First row must contain headers: Title, Company, Location
              </li>
              <li>All jobs must have at least Title, Company and Location</li>
              <li>
                Valid job types: full_time, part_time, contract, internship
              </li>
              <li>For multiple tags, separate with semicolons (;)</li>
              <li>Maximum 100 jobs per import</li>
            </ul>
          </div>

          <div className="text-center">
            <Button 
              variant="link" 
              size="sm" 
              className="text-xs"
              onClick={downloadCsvTemplate}
            >
              Download Template
            </Button>
          </div>
        </div>
      </MultiPurposeModal>

      {/* Add Job Modal */}
      <MultiPurposeModal
        open={isAddJobModalOpen}
        onOpenChange={setIsAddJobModalOpen}
        title="Add New Job"
        size="lg"
        showFooter={true}
        primaryActionText="Create Job"
        onPrimaryAction={handleAddJob}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsAddJobModalOpen(false)}
      >
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500 mb-4">Create a new job listing for students</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job-title" className="mb-1 block">Job Title</Label>
              <Input 
                id="job-title" 
                placeholder="e.g., Web Development Intern" 
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="company" className="mb-1 block">Company</Label>
              <Input 
                id="company" 
                placeholder="e.g., Tech Forward Philly" 
                value={newJob.company}
                onChange={(e) => setNewJob({...newJob, company: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="location" className="mb-1 block">Location</Label>
              <Input 
                id="location" 
                placeholder="e.g., Philadelphia, PA (Remote)" 
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="website" className="mb-1 block">Website (Optional)</Label>
              <Input 
                id="website" 
                placeholder="e.g., https://company.org" 
                value={newJob.website}
                onChange={(e) => setNewJob({...newJob, website: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="job-type" className="mb-1 block">Job Type</Label>
              <Select 
                value={newJob.job_type}
                onValueChange={(value) => setNewJob({...newJob, job_type: value})}
              >
                <SelectTrigger id="job-type">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="mb-1 block">Job Description</Label>
            <Textarea 
              id="description" 
              className="min-h-[150px]" 
              placeholder="Describe the job responsibilities, skills required, and any other relevant details..." 
              value={newJob.description}
              onChange={(e) => setNewJob({...newJob, description: e.target.value})}
            />
          </div>
          
          <div>
            <Label className="mb-1 block">Tags</Label>
            <div className="p-3 border rounded-md max-h-[150px] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {JOB_TAGS.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={newJob.tags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer ${newJob.tags.includes(tag) ? "bg-blue-500" : ""}`}
                    onClick={() => handleTagChange(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Click tags to select/deselect</p>
          </div>
        </div>
      </MultiPurposeModal>

      {/* Scraping Modal */}
      <MultiPurposeModal
        open={isScrapingModalOpen}
        onOpenChange={setIsScrapingModalOpen}
        title="Scrape Job Listings"
        size="md"
        showFooter={true}
        primaryActionText={isScrapingInProgress ? "Scraping..." : "Scrape Job"}
        onPrimaryAction={handleWebScraping}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsScrapingModalOpen(false)}
      >
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Enter the URL of a job listing page to scrape its details
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="scraping-url">Job Listing URL</Label>
            <Input
              id="scraping-url"
              type="url"
              placeholder="https://example.com/jobs/web-developer"
              value={scrapingUrl}
              onChange={(e) => setScrapingUrl(e.target.value)}
              disabled={isScrapingInProgress}
            />
            {!scrapingUrl && !isScrapingInProgress && (
              <p className="text-xs text-red-500 mt-1">Please enter a URL to scrape</p>
            )}
          </div>
          
          {isScrapingInProgress && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-launchpad-blue"></div>
              <span className="ml-2 text-sm text-gray-500">Scraping job data...</span>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium mb-2 text-sm">Supported Sites</h4>
            <p className="text-xs text-gray-600">
              This demo supports automatic scraping from any URL (simulated). In a production environment, 
              it would be configured to work with specific job boards and company career pages.
            </p>
          </div>
        </div>
      </MultiPurposeModal>
    </DashboardLayout>
  );
}
