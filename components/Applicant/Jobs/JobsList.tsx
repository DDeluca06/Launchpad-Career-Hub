"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/basic/card";
import { Badge } from "@/components/ui/basic/badge";
import { CheckCircle2, MapPin, Globe } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/data-display/skeleton";

export interface UIJob {
  id: string;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  experienceLevel: string;
  salary: string;
  description?: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  postedDate?: string;
  applicationDeadline: string;
  companyLogoUrl: string;
  industry: string;
  isRemote: boolean;
  partner?: {
    name: string;
    industry?: string | null;
    location?: string | null;
  } | null;
  applicationCount?: number;
}

interface JobsListProps {
  jobs: UIJob[];
  loading: boolean;
  selectedJobId: string | null;
  appliedJobs: string[];
  onSelectJob: (job: UIJob) => void;
}

// Skeleton loader for job listings
function JobListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-3 border rounded-md">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JobsList({ jobs, loading, selectedJobId, appliedJobs, onSelectJob }: JobsListProps) {
  return (
    <Card className="lg:col-span-1 max-h-[calc(100vh-320px)] overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Available Jobs</CardTitle>
        <CardDescription>{jobs.length} positions found</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-3">
        {loading ? (
          <JobListSkeleton />
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No jobs found matching your criteria
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card 
                key={job.id} 
                className={cn(
                  "cursor-pointer hover:shadow transition-shadow",
                  selectedJobId === job.id && "ring-2 ring-blue-400 border-l-4 border-blue-400",
                  appliedJobs.includes(job.id) && "border-l-4 border-green-400"
                )}
                onClick={() => onSelectJob(job)}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded border flex items-center justify-center overflow-hidden">
                      <Image 
                        src={job.companyLogoUrl} 
                        alt={`${job.company} logo`} 
                        className="w-full h-full object-contain"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{job.title}</h3>
                      <span className="text-gray-500 block">{job.company}</span>
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
                        {appliedJobs.includes(job.id) && (
                          <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Applied
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
      </CardContent>
    </Card>
  );
} 