"use client";

import { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlay/dialog";
import { Search, RefreshCw, Briefcase, Globe, BookmarkPlus, Bookmark, MapPin, FilterX, Loader2, Clock, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/basic/badge";
import { Label } from "@/components/ui/basic/label";
import { Textarea } from "@/components/ui/form/textarea";
import { Checkbox } from "@/components/ui/form/checkbox";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";

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
  value: any;
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

// Mock data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    jobType: "Full-time",
    experienceLevel: "Mid-level",
    salary: "$120,000 - $150,000",
    description: "We are looking for a software engineer to join our team and help build innovative web applications using React, Node.js, and TypeScript.",
    responsibilities: [
      "Design and implement frontend and backend features",
      "Write clean, maintainable, and efficient code",
      "Collaborate with cross-functional teams to define and implement new features",
      "Ensure the technical feasibility of UI/UX designs",
      "Optimize applications for maximum speed and scalability"
    ],
    qualifications: [
      "3+ years of experience in software development",
      "Strong proficiency in JavaScript, TypeScript, and React",
      "Experience with Node.js and Express",
      "Familiarity with RESTful APIs and database design",
      "Bachelor's degree in Computer Science or equivalent experience"
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Unlimited PTO",
      "401(k) matching",
      "Remote work options"
    ],
    postedDate: "2023-04-15",
    applicationDeadline: "2023-05-15",
    companyLogoUrl: "https://via.placeholder.com/150",
    industry: "Technology",
    isRemote: true
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateCo",
    location: "New York, NY",
    jobType: "Full-time",
    experienceLevel: "Senior",
    salary: "$140,000 - $180,000",
    description: "We're seeking an experienced Product Manager to lead the development and launch of our newest product line. You'll work closely with engineering, design, and marketing teams.",
    responsibilities: [
      "Define product vision, strategy, and roadmap",
      "Gather and prioritize product requirements",
      "Work closely with engineering and design teams",
      "Analyze market data and customer feedback",
      "Present product plans to stakeholders"
    ],
    qualifications: [
      "5+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Excellent communication and presentation abilities",
      "Experience with agile methodologies",
      "MBA or relevant technical degree preferred"
    ],
    benefits: [
      "Competitive compensation package",
      "Comprehensive health benefits",
      "Flexible work arrangements",
      "Professional development budget",
      "Parental leave"
    ],
    postedDate: "2023-04-10",
    applicationDeadline: "2023-05-10",
    companyLogoUrl: "https://via.placeholder.com/150",
    industry: "Technology",
    isRemote: false
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Austin, TX",
    jobType: "Contract",
    experienceLevel: "Entry-level",
    salary: "$70,000 - $90,000",
    description: "Join our creative team as a UX/UI Designer to craft beautiful and functional interfaces for our web and mobile applications. You'll be responsible for the entire design process from wireframing to final implementation.",
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity mockups",
      "Conduct user research and usability testing",
      "Collaborate with developers to implement designs",
      "Maintain design system and component library",
      "Stay updated on latest design trends and best practices"
    ],
    qualifications: [
      "1-2 years of experience in UX/UI design",
      "Proficiency in design tools like Figma, Sketch, or Adobe XD",
      "Basic understanding of HTML, CSS, and responsive design",
      "Strong portfolio demonstrating design thinking",
      "Excellent communication skills"
    ],
    benefits: [
      "Competitive hourly rate",
      "Flexible working hours",
      "Portfolio development opportunities",
      "Mentorship from senior designers",
      "Potential for full-time conversion"
    ],
    postedDate: "2023-04-20",
    applicationDeadline: "2023-05-20",
    companyLogoUrl: "https://via.placeholder.com/150",
    industry: "Design",
    isRemote: true
  }
];

// Mock applications data
const mockApplications: Application[] = [
  {
    id: "app1",
    jobId: "1",
    jobTitle: "Software Engineer",
    company: "TechCorp",
    companyLogoUrl: "https://via.placeholder.com/150",
    appliedDate: "2023-06-10",
    status: "interviewing",
    nextSteps: "Technical interview scheduled",
    interviewDate: "2023-06-25"
  },
  {
    id: "app2",
    jobId: "2",
    jobTitle: "Product Manager",
    company: "InnovateCo",
    companyLogoUrl: "https://via.placeholder.com/150",
    appliedDate: "2023-06-05",
    status: "reviewing",
    notes: "Recruiter viewed application on June 8"
  },
  {
    id: "app3",
    jobId: "3",
    jobTitle: "UX/UI Designer",
    company: "DesignHub",
    companyLogoUrl: "https://via.placeholder.com/150",
    appliedDate: "2023-05-20",
    status: "rejected",
    notes: "Position was filled internally"
  },
  {
    id: "app4",
    jobId: "5",
    jobTitle: "Frontend Developer",
    company: "WebSolutions",
    companyLogoUrl: "https://via.placeholder.com/150",
    appliedDate: "2023-06-15",
    status: "submitted"
  },
  {
    id: "app5",
    jobId: "4",
    jobTitle: "Data Analyst",
    company: "DataInsights",
    companyLogoUrl: "https://via.placeholder.com/150",
    appliedDate: "2023-05-30",
    status: "offered",
    notes: "Offer received: $85,000/year with benefits"
  }
];

// Loading components
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

export default function JobsPage() {
  // State
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(mockJobs[0] || null);
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
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: null as File | null,
    coverLetter: ""
  });

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
    setSavedJobs(prevSavedJobs => {
      if (prevSavedJobs.includes(jobId)) {
        return prevSavedJobs.filter(id => id !== jobId);
      } else {
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
            <img 
              src={job.companyLogoUrl} 
              alt={`${job.company} logo`} 
              className="w-full h-full object-contain"
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
            <div className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden">
              <img 
                src={application.companyLogoUrl} 
                alt={`${application.company} logo`} 
                className="w-full h-full object-contain"
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
                        <img 
                          src={application.companyLogoUrl} 
                          alt={`${application.company} logo`} 
                          className="w-full h-full object-contain"
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
                  You haven't submitted any applications yet
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
                                  <img 
                                    src={job.companyLogoUrl} 
                                    alt={`${job.company} logo`} 
                                    className="w-full h-full object-contain"
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
                  <Input 
                    id="resume" 
                    type="file" 
                    className="cursor-pointer"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setApplicationData({...applicationData, resume: files[0]});
                      }
                    }}
                  />
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
                <Button type="submit">Submit Application</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
  );
}
