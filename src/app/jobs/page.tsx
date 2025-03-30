'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Search, MapPin, Building, Briefcase } from 'lucide-react';
import { getJobs, addJobApplication, Job } from '@/utils/localStorage';

export default function JobsListing() {
  // State for jobs
  const [jobs, setJobs] = useState<Job[]>([]);
  // State for selected job
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  // State for filters
  const [filters, setFilters] = useState({
    location: '',
    title: '',
    company: '',
    type: ''
  });

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const loadedJobs = getJobs();
    setJobs(loadedJobs);
    if (loadedJobs.length > 0) {
      setSelectedJob(loadedJobs[0]);
    }
  }, []);

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to jobs
  const filteredJobs = jobs.filter(job => {
    return (
      job.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      job.company.toLowerCase().includes(filters.company.toLowerCase()) &&
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  });

  // Add job to interested list
  const addToInterested = (job: Job) => {
    const newApplication = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      status: 'Interested',
      stage: 'interested' as const
    };
    
    addJobApplication(newApplication);
    alert('Job added to your interested list!');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl font-bold">LP</div>
            <nav className="ml-8">
              <ul className="flex space-x-6">
                <li className="font-medium">
                  <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
                </li>
                <li className="font-medium">
                  <Link href="/jobs" className="text-primary">Jobs</Link>
                </li>
                <li className="font-medium">
                  <Link href="/community" className="text-foreground hover:text-primary transition-colors">Community</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <Link href="/messages" className="mr-4">
              <span className="sr-only">Messages</span>
              <Mail className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Narrow down your job search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Job Title</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={filters.title}
                  onChange={handleFilterChange}
                  placeholder="e.g. Developer"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Company</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={filters.company}
                  onChange={handleFilterChange}
                  placeholder="e.g. Tech Solutions"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g. Philadelphia"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Job Type</label>
                <Select
                  onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Jobs ({filteredJobs.length})</CardTitle>
                <CardDescription>Browse available positions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {filteredJobs.map(job => (
                    <div 
                      key={job.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedJob?.id === job.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </p>
                    </div>
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                      No jobs match your filters.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full">
              {selectedJob ? (
                <>
                  <CardHeader>
                    <CardTitle>{selectedJob.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {selectedJob.company} • 
                      <MapPin className="h-4 w-4 ml-1" />
                      {selectedJob.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Job Description</h3>
                        <p className="text-muted-foreground">{selectedJob.description}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button 
                      onClick={() => addToInterested(selectedJob)}
                    >
                      Add to Interested
                    </Button>
                    <Button variant="outline">
                      Apply Now
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <div className="p-6 text-center text-muted-foreground h-full flex items-center justify-center">
                  <div>
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Select a job to view details</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}