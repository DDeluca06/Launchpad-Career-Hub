"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Search, Plus, Trash2, FileSpreadsheet } from "lucide-react"
import { jobService, applicationService, Job } from "@/lib/local-storage"
import { Badge } from "@/components/ui/basic/badge"
import { LaunchpadImage } from "@/components/ui/basic/image"
import { Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

interface JobFilter {
  jobType?: string[];
  location?: string[];
  company?: string[];
  experienceLevel?: string[];
  salary?: string[];
}

interface ExtendedJob extends Job {
  experience?: string;
  salary_range?: string;
  requirements?: string;
  benefits?: string;
}

export default function AdminJobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [applicationsCount, setApplicationsCount] = useState<{[key: number]: number}>({});

  // Load jobs from local storage
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      
      // Get all jobs from local storage
      const allJobs = jobService.getAll();
      
      // Get all applications to count per job
      const allApplications = applicationService.getAll();
      
      // Count applications per job
      const countMap: {[key: number]: number} = {};
      allApplications.forEach(app => {
        if (countMap[app.job_id]) {
          countMap[app.job_id]++;
        } else {
          countMap[app.job_id] = 1;
        }
      });
      
      setJobs(allJobs);
      setApplicationsCount(countMap);
      
      // Set the first job as selected if available
      if (allJobs.length > 0 && !selectedJob) {
        setSelectedJob(allJobs[0]);
      }
      
      setIsLoading(false);
    };
    
    loadJobs();
  }, [selectedJob]);

  // Filter jobs by search query
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

  // Handle selecting a job
  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  // Delete a job
  const handleDeleteJob = () => {
    if (selectedJob) {
      jobService.delete(selectedJob.job_id);
      setJobs(prevJobs => prevJobs.filter(job => job.job_id !== selectedJob.job_id));
      setSelectedJob(null);
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
          <p className="text-gray-500 mt-1">Manage all job postings and track applications</p>
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
                  onClick={() => window.location.href = '/admin/dashboard?tab=import'}
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
                          <div className="flex items-center gap-4 mb-4">
                            {job.company ? (
                              <LaunchpadImage
                                imageId={`company-${job.company.toLowerCase().replace(/\s+/g, '-')}`}
                                width={32}
                                height={32}
                                className="object-contain"
                                alt={`${job.company} logo`}
                              />
                            ) : (
                              <Briefcase className="h-6 w-6 text-gray-400" />
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-500">{job.company}</p>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 line-clamp-1">{job.location}</p>
                            <Badge className="bg-launchpad-blue/10 text-launchpad-blue text-xs">
                              {applicationsCount[job.job_id] || 0} applicants
                            </Badge>
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
          <Card className="lg:col-span-2 max-h-[calc(100vh-220px)] overflow-auto">
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
                <Button className="bg-launchpad-blue hover:bg-launchpad-teal text-white">
                  <Plus className="h-4 w-4 mr-2" /> Add New Job
                </Button>
              </div>
            ) : (
              // Job details view
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="danger" 
                      size="sm"
                      className="gap-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                      onClick={() => handleDeleteJob()}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                    {selectedJob.company ? (
                      <LaunchpadImage
                        imageId={`company-${selectedJob.company.toLowerCase().replace(/\s+/g, '-')}`}
                        width={60}
                        height={60}
                        className="object-contain"
                        alt={`${selectedJob.company} logo`}
                        // Handle error if needed
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-100">
                        <Briefcase className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{selectedJob.company}</h3>
                    <p className="text-gray-500">{selectedJob.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Job Type</p>
                    <p className="font-medium">{selectedJob.job_type.replace('_', ' ')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="font-medium">{(selectedJob as ExtendedJob).experience || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Salary Range</p>
                    <p className="font-medium">{(selectedJob as ExtendedJob).salary_range || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Applications</p>
                    <p className="font-medium">{applicationsCount[selectedJob.job_id] || 0}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {selectedJob.description || 'No description provided'}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {(selectedJob as ExtendedJob).requirements || 'No requirements specified'}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Benefits</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {(selectedJob as ExtendedJob).benefits || 'No benefits specified'}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
