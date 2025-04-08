'use client'

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Search, Plus, Filter, Edit, Trash2, FileSpreadsheet } from "lucide-react"
import { jobService } from "@/lib/local-storage"
import type { Job } from "@/lib/local-storage"
import { Badge } from "@/components/ui/basic/badge"
import { CompanyLogo } from "@/components/ui/basic/company-logo"
import { cn } from "@/lib/utils"
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal"
import { JobFilters } from "@/components/job-filters"

// Define JobFiltersType with proper types to resolve errors
interface JobFiltersType {
  jobTypes: string[];
  locations: string[];
  remoteOnly: boolean;
  salary: [number, number]; // Fixed to tuple type
  experienceLevel: string;
  keywords: string;
}

/**
 * Renders a loading skeleton for job listings.
 *
 * This component displays a series of animated placeholder cards that simulate the layout of actual job items,
 * providing visual feedback during data loading.
 *
 * @returns A JSX element representing the job list loading skeleton.
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
  )
}

/**
 * Renders a skeleton placeholder for the job details view.
 *
 * This component displays animated gray blocks that mimic the layout of the job details content,
 * providing visual feedback while data is being loaded.
 *
 * @returns A JSX element representing the job details loading state.
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
  )
}

// Props interfaces
interface JobListProps {
  jobs: Job[];
  selectedJob: Job | null;
  onSelectJob: (job: Job) => void;
  applicationsCount: Record<string, number>;
  isLoading: boolean;
  searchQuery: string;
}

interface JobDetailsProps {
  job: Job | null;
  applicationsCount: Record<string, number>;
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Renders a list of job cards with filtering and loading state.
 *
 * When the component is loading, a skeleton placeholder is displayed. Otherwise, it filters
 * the provided jobs based on the search query and renders each job as a clickable card.
 *
 * @param jobs - Array of job objects to display.
 * @param selectedJob - The job currently selected; used to highlight the active card.
 * @param onSelectJob - Callback triggered when a job card is clicked.
 * @param applicationsCount - Map of job IDs to their respective applicant counts.
 * @param isLoading - Indicates whether the job list is in a loading state.
 * @param searchQuery - Text used to filter jobs by title, company, description, or location.
 *
 * @returns A JSX element representing the job list.
 */
function JobList({ jobs, selectedJob, onSelectJob, applicationsCount, isLoading, searchQuery }: JobListProps) {
  if (isLoading) return <JobListSkeleton />;

  const filteredJobs = jobs.filter(job => {
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
                : "border-orange-400"
          )}
          onClick={() => onSelectJob(job)}
        >
          <CardContent className="p-3">
            <div className="flex gap-3">
              <CompanyLogo company={job.company} size="sm" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-1">{job.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{job.company}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">{job.location}</span>
                  <Badge className={cn(
                    "text-xs",
                    job.job_type === "internship" 
                      ? "bg-blue-50 text-blue-700" 
                      : job.job_type === "part_time" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-orange-50 text-orange-700"
                  )}>
                    {applicationsCount[job.job_id] || 0} applicants
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {filteredJobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No jobs found matching your criteria
        </div>
      )}
    </div>
  );
}

/**
 * Displays detailed information for a selected job within the admin interface.
 *
 * When the data is loading, a skeleton placeholder is shown. If no job is selected, a prompt is rendered with an option to add a new job.
 * When a job is provided, its title, company information, job type, application count, description, and requirements are displayed,
 * along with buttons to trigger editing or deletion.
 *
 * @param job - The job data to display. If absent, a prompt for job selection is rendered.
 * @param applicationsCount - A mapping of job IDs to their application counts.
 * @param isLoading - Indicates whether the job details are currently being loaded.
 * @param onEdit - Callback invoked to edit the displayed job.
 * @param onDelete - Callback invoked to delete the displayed job.
 * @returns A JSX element representing the job details view.
 */
function JobDetails({ job, applicationsCount, isLoading, onEdit, onDelete }: JobDetailsProps) {
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
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            className="gap-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <CompanyLogo company={job.company} size="md" />
        <div>
          <h3 className="font-medium text-lg">{job.company}</h3>
          <p className="text-gray-500">{job.location}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Job Type</p>
          <p className="font-medium">{job.job_type}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Experience</p>
          <p className="font-medium">Not specified</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Salary Range</p>
          <p className="font-medium">Not specified</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Applications</p>
          <p className="font-medium">{applicationsCount[job.job_id] || 0}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Job Description</h3>
        <div className="text-gray-700 whitespace-pre-line">
          {job.description || 'No description provided'}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Requirements</h3>
        <div className="text-gray-700">
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
 * Renders the admin job listings dashboard interface.
 *
 * This component loads dummy job data and application counts, sets an initial selected job, and manages various UI states including search, filtering, editing, deletion, and CSV import via modals. It provides a structured layout featuring a quick import panel, search and filter actions, a job listings column, and a detailed job information section.
 *
 * @returns A React element representing the admin job listings interface.
 */
export default function AdminJobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<JobFiltersType>({
    jobTypes: [],
    locations: [],
    remoteOnly: false,
    salary: [0, 200],
    experienceLevel: "any",
    keywords: ""
  });
  const [applicationsCount, setApplicationsCount] = useState<Record<string, number>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        
        // DUMMY DATA - In a real app, this would come from a backend API
        // Philadelphia-specific tech internships for high school students
        const dummyJobs: Job[] = [
          {
            job_id: 1,
            job_type: "internship",
            title: "Web Development Intern",
            description: "Join our team to learn modern web development skills including HTML, CSS, JavaScript, and React. Perfect for high school students interested in coding.",
            company: "Philly Tech Forward",
            website: "https://phillytechforward.org",
            location: "Philadelphia, PA (Center City)",
            partner_id: 1,
            created_at: new Date().toISOString(),
            tags: ["HTML", "CSS", "JavaScript", "React", "High School"]
          },
          {
            job_id: 2,
            job_type: "part_time",
            title: "Junior UX Designer",
            description: "Work with our UX team to design user interfaces for educational apps. We'll teach you design principles and tools like Figma.",
            company: "EduTech Solutions",
            website: "https://edutechsolutions.org",
            location: "Philadelphia, PA (University City)",
            partner_id: 2,
            created_at: new Date().toISOString(),
            tags: ["UI/UX", "Figma", "Design", "Educational Apps"]
          },
          {
            job_id: 3,
            job_type: "internship",
            title: "Data Science Explorer",
            description: "Learn the basics of data analysis and visualization. Great opportunity for math-inclined students to explore tech careers.",
            company: "Data Insights Philly",
            website: "https://datainsightsphilly.org",
            location: "Remote (Philadelphia based)",
            partner_id: 3,
            created_at: new Date().toISOString(),
            tags: ["Data Analysis", "Python", "Math", "Remote"]
          },
          {
            job_id: 4,
            job_type: "internship",
            title: "IT Support Assistant",
            description: "Get hands-on experience with hardware, networking, and troubleshooting in our tech lab.",
            company: "PhillyTech Nonprofit",
            website: "https://phillytechnonprofit.org",
            location: "Philadelphia, PA (North Philly)",
            partner_id: 4,
            created_at: new Date().toISOString(),
            tags: ["Hardware", "Networking", "Technical Support"]
          },
          {
            job_id: 5,
            job_type: "part_time",
            title: "Digital Marketing Assistant",
            description: "Learn social media marketing, content creation, and basic analytics for tech-focused campaigns.",
            company: "Tech Outreach Philly",
            website: "https://techoutreachphilly.org",
            location: "Hybrid (Philadelphia)",
            partner_id: 5, 
            created_at: new Date().toISOString(),
            tags: ["Social Media", "Content Creation", "Analytics"]
          }
        ];
        
        // Count applications per job (dummy data)
        const dummyApplicationCounts: Record<string, number> = {
          "1": 8,
          "2": 5,
          "3": 10,
          "4": 3,
          "5": 6
        };
        
        setJobs(dummyJobs);
        setApplicationsCount(dummyApplicationCounts);
        
        // Set initial selected job if none selected
        if (dummyJobs.length > 0 && !selectedJob) {
          setSelectedJob(dummyJobs[0]);
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJobs();
  }, [selectedJob]);

  const handleDeleteJob = () => {
    if (selectedJob) {
      jobService.delete(selectedJob.job_id);
      setJobs(prevJobs => prevJobs.filter(job => job.job_id !== selectedJob.job_id));
      setSelectedJob(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Philly Tech Internships</h1>
          <p className="text-gray-500 mt-1">Connect high school students with local tech opportunities</p>
        </div>
        
        {/* Quick Import Panel */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-base mb-1">Quick Job Import</h3>
                <p className="text-sm text-gray-500">
                  Scrape job listings from external sites or upload in bulk from CSV files
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="text-sm gap-1"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <FileSpreadsheet className="h-4 w-4" /> 
                  Upload CSV
                </Button>
                <Button 
                  className="text-sm gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white"
                  onClick={() => window.location.href = '/admin/dashboard?tab=import'}
                >
                  <Search className="h-4 w-4" /> 
                  Web Scraping
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
              Filter
            </Button>
            <Button className="gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white">
              <Plus className="h-4 w-4" />
              Add Job
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Listings Column */}
          <Card className="lg:col-span-1 max-h-[calc(100vh-220px)] overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>{jobs.length} jobs found</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-3">
              <Suspense fallback={<JobListSkeleton />}>
                <JobList
                  jobs={jobs}
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
          <Card className="lg:col-span-2 max-h-[calc(100vh-220px)] overflow-auto">
            <Suspense fallback={<JobDetailsSkeleton />}>
              <JobDetails
                job={selectedJob}
                applicationsCount={applicationsCount}
                isLoading={isLoading}
                onEdit={() => setIsEditModalOpen(true)}
                onDelete={() => setIsDeleteModalOpen(true)}
              />
            </Suspense>
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
        onPrimaryAction={() => {
          setFilterModalOpen(false);
          // Apply filters logic here
        }}
        secondaryActionText="Reset"
        onSecondaryAction={() => setActiveFilters({
          jobTypes: [],
          locations: [],
          remoteOnly: false,
          salary: [0, 200],
          experienceLevel: "any",
          keywords: ""
        })}
      >
        <JobFilters
          onApply={(filters) => {
            setActiveFilters(filters);
            setFilterModalOpen(false);
          }}
          initialFilters={activeFilters}
        />
      </MultiPurposeModal>
      
      <MultiPurposeModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Job"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        size="sm"
        showFooter={true}
        primaryActionText="Delete"
        onPrimaryAction={handleDeleteJob}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsDeleteModalOpen(false)}
      >
        {selectedJob && (
          <div className="py-2">
            <p className="mb-2"><strong>Title:</strong> {selectedJob.title}</p>
            <p><strong>Company:</strong> {selectedJob.company}</p>
          </div>
        )}
      </MultiPurposeModal>
      
      <MultiPurposeModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Job"
        description="Update job posting details"
        size="lg"
        showFooter={true}
        primaryActionText="Save Changes"
        onPrimaryAction={() => setIsEditModalOpen(false)}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsEditModalOpen(false)}
      >
        <div className="py-4">
          <p className="text-center text-gray-500">Job edit form would go here</p>
        </div>
      </MultiPurposeModal>
      
      <MultiPurposeModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        title="Import Jobs from CSV"
        description="Upload multiple job listings at once"
        size="md"
        showFooter={true}
        primaryActionText="Import Jobs"
        onPrimaryAction={() => {
          alert("5 jobs have been imported successfully!");
          setIsImportModalOpen(false);
        }}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsImportModalOpen(false)}
      >
        <div className="py-4 space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <FileSpreadsheet className="h-10 w-10 text-gray-300 mb-2" />
              <h4 className="font-medium mb-1">Drop your CSV file here</h4>
              <p className="text-sm text-gray-500 mb-4">
                Make sure to follow the required format
              </p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>
          </div>
          
          <div className="bg-launchpad-blue/5 p-4 rounded-md">
            <h4 className="font-medium mb-2 text-sm">CSV Format Requirements</h4>
            <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
              <li>First row must contain headers: Title, Company, Location, Type, Description</li>
              <li>All jobs must have at least Title, Company and Location</li>
              <li>Valid job types: full_time, part_time, contract, internship</li>
              <li>Maximum 100 jobs per import</li>
            </ul>
          </div>
          
          <div className="text-center">
            <Button variant="link" size="sm" className="text-xs">
              Download Template
            </Button>
          </div>
        </div>
      </MultiPurposeModal>
    </DashboardLayout>
  )
}