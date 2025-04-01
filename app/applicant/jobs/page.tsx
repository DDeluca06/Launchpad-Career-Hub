"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, MapPin, Briefcase, BadgeDollarSign, Clock, Building, CheckCircle } from "lucide-react"
import { useState } from "react"
import { MultiPurposeModal } from "@/components/ui/multi-purpose-modal"
import { JobFilters } from "@/components/job-filters"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Define JobFilters interface (same as in components/job-filters.tsx)
interface JobFilters {
  jobTypes: string[]
  locations: string[]
  remoteOnly: boolean
  salary: [number, number]
  experienceLevel: string
  keywords: string
}

// Sample data with more details
const jobs = [
  { 
    id: "1", 
    title: "Frontend Developer", 
    company: "Tech Co", 
    location: "Remote", 
    type: "Full-time",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing designs.",
    requirements: [
      "3+ years of experience with React",
      "Strong knowledge of HTML, CSS, and JavaScript",
      "Experience with responsive design",
      "Familiarity with modern frontend tools"
    ],
    postedDate: "2 days ago",
    salary: "$80k - $120k"
  },
  { 
    id: "2", 
    title: "Backend Engineer", 
    company: "Software Inc", 
    location: "New York", 
    type: "Full-time",
    description: "Join our engineering team to build scalable backend systems for our growing platform.",
    requirements: [
      "Experience with Node.js or Python",
      "Knowledge of database systems",
      "Experience with API design",
      "Understanding of cloud infrastructure"
    ],
    postedDate: "1 week ago",
    salary: "$90k - $130k"
  },
  { 
    id: "3", 
    title: "Full Stack Developer", 
    company: "Web Solutions", 
    location: "San Francisco", 
    type: "Contract",
    description: "Looking for a versatile developer who can work on both frontend and backend technologies.",
    requirements: [
      "Experience with modern JavaScript frameworks",
      "Knowledge of backend technologies",
      "Database experience",
      "Good communication skills"
    ],
    postedDate: "3 days ago",
    salary: "$100k - $140k"
  },
  { 
    id: "4", 
    title: "UI/UX Designer", 
    company: "Design Studio", 
    location: "Remote", 
    type: "Part-time",
    description: "Join our creative team to design beautiful and functional user interfaces.",
    requirements: [
      "Portfolio of design work",
      "Experience with Figma or similar tools",
      "Understanding of user-centered design",
      "Ability to collaborate with developers"
    ],
    postedDate: "5 days ago",
    salary: "$70k - $90k"
  },
  { 
    id: "5", 
    title: "DevOps Engineer", 
    company: "Cloud Systems", 
    location: "Seattle", 
    type: "Full-time",
    description: "Help us build and maintain our cloud infrastructure and deployment pipelines.",
    requirements: [
      "Experience with AWS or Azure",
      "Knowledge of CI/CD practices",
      "Containerization experience",
      "Infrastructure as code"
    ],
    postedDate: "2 weeks ago",
    salary: "$95k - $135k"
  },
  { 
    id: "6", 
    title: "Product Manager", 
    company: "Product Co", 
    location: "Boston", 
    type: "Full-time",
    description: "Lead product strategy and development for our growing suite of applications.",
    requirements: [
      "3+ years in product management",
      "Experience with agile methodologies",
      "Strong analytical skills",
      "Excellent communication"
    ],
    postedDate: "1 month ago",
    salary: "$110k - $150k"
  },
]

export default function ApplicantJobListings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [activeFilters, setActiveFilters] = useState<JobFilters>({
    jobTypes: [],
    locations: [],
    remoteOnly: false,
    salary: [0, 200] as [number, number],
    experienceLevel: "any",
    keywords: ""
  });

  // Handle applying filters
  const handleApplyFilters = (filters: JobFilters) => {
    setActiveFilters(filters);
    setFilterModalOpen(false);
    console.log("Applied filters:", filters);
  };
  
  // Function to open the filter modal
  const openFilterModal = () => {
    setFilterModalOpen(true);
  };

  // Function to select a job
  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
  };
  
  // Filter jobs by search query and active filters
  const filteredJobs = jobs.filter(job => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery = 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.type?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query);
      
      if (!matchesQuery) return false;
    }
    
    // Filter by job type
    if (activeFilters.jobTypes.length > 0) {
      const jobType = job.type?.toLowerCase().replace('-', '_');
      if (!jobType || !activeFilters.jobTypes.some(type => jobType.includes(type))) {
        return false;
      }
    }
    
    // Filter by location
    if (activeFilters.locations.length > 0) {
      const jobLocation = job.location?.toLowerCase();
      
      // Handle remote only filter
      if (activeFilters.remoteOnly && !jobLocation?.includes('remote')) {
        return false;
      }
      
      // If locations are selected and not remote only, check if job location matches any selected locations
      if (!activeFilters.remoteOnly && !activeFilters.locations.some(location => 
          jobLocation?.includes(location.replace('_', ' ')))) {
        return false;
      }
    } else if (activeFilters.remoteOnly) {
      // If only remote is selected
      const jobLocation = job.location?.toLowerCase();
      if (!jobLocation?.includes('remote')) {
        return false;
      }
    }
    
    return true;
  });

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (activeFilters.jobTypes.length > 0) count += activeFilters.jobTypes.length;
    if (activeFilters.locations.length > 0) count += activeFilters.locations.length;
    if (activeFilters.remoteOnly) count += 1;
    if (activeFilters.experienceLevel !== 'any') count += 1;
    if (activeFilters.salary[0] > 0 || activeFilters.salary[1] < 200) count += 1;
    if (activeFilters.keywords.trim()) count += 1;
    return count;
  };

  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto max-w-screen-xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
        </div>

        {/* Search and Filter Bar - Simplified */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search job title, company, or keywords..." 
                className="pl-10 border-gray-200 focus:border-launchpad-blue" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              onClick={openFilterModal}
              className="bg-launchpad-blue hover:bg-launchpad-teal text-white gap-2 whitespace-nowrap relative"
            >
              <Filter className="h-4 w-4" />
              Filters
              {countActiveFilters() > 0 && (
                <Badge className="ml-1 bg-white text-launchpad-blue font-bold text-xs h-5 absolute -top-2 -right-2">
                  {countActiveFilters()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Job Listings - Takes 3/8 of the space on large screens */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium text-gray-900">Available Positions</h2>
              <span className="text-sm text-gray-500">{filteredJobs.length} jobs found</span>
            </div>
            
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => handleJobSelect(job)}
                  className={cn(
                    "bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md",
                    selectedJob.id === job.id ? "border-launchpad-blue border-l-4" : "border-gray-100"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                      {job.company.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center text-xs gap-1 font-normal border-gray-200">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center text-xs gap-1 font-normal border-gray-200">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center text-xs gap-1 font-normal border-gray-200">
                          <Clock className="h-3 w-3" />
                          {job.postedDate}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Details - Takes 5/8 of the space on large screens */}
          <div className="lg:col-span-5">
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{selectedJob.company}</span>
                      </div>
                    </div>
                    <Button className="bg-launchpad-blue hover:bg-launchpad-teal">Apply Now</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 font-normal">
                      <MapPin className="h-3 w-3" />
                      {selectedJob.location}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 font-normal">
                      <Briefcase className="h-3 w-3" />
                      {selectedJob.type}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 font-normal">
                      <BadgeDollarSign className="h-3 w-3" />
                      {selectedJob.salary}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 font-normal">
                      <Clock className="h-3 w-3" />
                      Posted {selectedJob.postedDate}
                    </Badge>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">Description</h3>
                    <p className="text-gray-700">{selectedJob.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-launchpad-teal shrink-0 mt-0.5" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-4">
                  <Button className="flex-1 gap-2 bg-launchpad-blue hover:bg-launchpad-teal">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    Save Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Filter Modal */}
      <MultiPurposeModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        title="Find Your Ideal Job"
        description="Customize your search to discover the perfect opportunities"
        size="lg"
        showFooter={true}
        primaryActionText="Apply Filters"
        onPrimaryAction={() => handleApplyFilters(activeFilters)}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setFilterModalOpen(false)}
      >
        <JobFilters
          onApplyFilters={handleApplyFilters}
          initialFilters={activeFilters}
        />
      </MultiPurposeModal>
    </DashboardLayout>
  )
}

