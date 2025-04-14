"use client";

import { useState } from "react";
import { Button } from "@/components/ui/basic/button";
import { Badge } from "@/components/ui/basic/badge";
import { UIJob } from "./JobsList";
import Image from "next/image";
import { BookmarkPlus, Bookmark, CheckCircle2, Info, Briefcase, FileText, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/data-display/skeleton";

interface JobDetailsProps {
  job: UIJob | null;
  isJobSaved: (jobId: string) => boolean;
  hasApplied: (jobId: string) => boolean;
  onToggleSaveJob: (jobId: string) => void;
  onOpenApplyModal: (job: UIJob) => void;
  onViewApplication: () => void;
}

// Skeleton loader for job details
export function JobDetailsSkeleton() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">
          <Skeleton className="h-6 w-3/4" />
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-yellow-500"
        >
          <Bookmark className="h-5 w-5 fill-current" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden">
          <Skeleton className="h-16 w-16 rounded-md" />
        </div>
        <div>
          <h3 className="font-medium text-lg">
            <Skeleton className="h-4 w-3/4" />
          </h3>
          <span className="text-gray-500 block">
            <Skeleton className="h-3 w-1/2" />
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Job Type</p>
          <span className="font-medium block">
            <Skeleton className="h-4 w-3/4" />
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Experience</p>
          <span className="font-medium block">
            <Skeleton className="h-4 w-3/4" />
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Salary Range</p>
          <span className="font-medium block">
            <Skeleton className="h-4 w-3/4" />
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Deadline</p>
          <span className="font-medium block">
            <Skeleton className="h-4 w-3/4" />
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Job Description</h3>
        <div className="text-gray-700">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-full mt-2" />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Responsibilities</h3>
        <ul className="list-disc pl-4 space-y-1">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="text-gray-700">
              <Skeleton className="h-4 w-full" />
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Qualifications</h3>
        <ul className="list-disc pl-4 space-y-1">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="text-gray-700">
              <Skeleton className="h-4 w-full" />
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Benefits</h3>
        <ul className="list-disc pl-4 space-y-1">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="text-gray-700">
              <Skeleton className="h-4 w-full" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function JobDetails({ 
  job, 
  isJobSaved, 
  hasApplied, 
  onToggleSaveJob, 
  onOpenApplyModal,
  onViewApplication 
}: JobDetailsProps) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  
  // Wrapper function for toggleSaveJob that adds loading state
  const handleToggleSave = (jobId: string) => {
    setSaving(true);
    try {
      onToggleSaveJob(jobId);
    } finally {
      // Use a timeout to prevent UI flickering when operation is quick
      setTimeout(() => setSaving(false), 500);
    }
  };
  
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
        <div>
          <h2 className="text-2xl font-bold">{job.title}</h2>
          {hasApplied(job.id) && (
            <Badge className="mt-2 bg-green-100 text-green-800">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              You&apos;ve Applied
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {!hasApplied(job.id) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleSave(job.id)}
              className={isJobSaved(job.id) ? "text-yellow-500" : ""}
              title={isJobSaved(job.id) ? "Remove from saved jobs" : "Save job"}
              disabled={saving}
            >
              {saving ? 
                <RefreshCw className="h-5 w-5 animate-spin" /> : 
                (isJobSaved(job.id) ? <Bookmark className="h-5 w-5 fill-current" /> : <BookmarkPlus className="h-5 w-5" />)
              }
            </Button>
          )}
          {isJobSaved(job.id) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/applicant/dashboard')}
              className="text-sm"
              title="View this job in your application board"
            >
              <Briefcase className="h-4 w-4 mr-1" />
              View in Kanban
            </Button>
          )}
          {hasApplied(job.id) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewApplication}
              className="text-sm"
              title="View your application"
            >
              <FileText className="h-4 w-4 mr-1" />
              View Application
            </Button>
          )}
        </div>
      </div>
      
      {/* Applied notification */}
      {hasApplied(job.id) && (
        <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800 mb-1">Application Submitted</p>
              <p className="text-sm text-green-700">
                You&apos;ve already applied for this position. You can view the status of your application in the &quot;My Applications&quot; tab.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Important notice about job status tracking */}
      {isJobSaved(job.id) && !hasApplied(job.id) && (
        <div className="bg-yellow-50 p-4 rounded-md mb-6 border border-yellow-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800 mb-1">Job Saved</p>
              <p className="text-sm text-yellow-700">
                This job is saved to your dashboard in the &quot;Interested&quot; column. You can track your application status by dragging the card between columns in the Kanban board.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden">
          <Image 
            src={job.companyLogoUrl} 
            alt={`${job.company} logo`} 
            className="w-full h-full object-contain"
            width={64}
            height={64}
          />
        </div>
        <div>
          <h3 className="font-medium text-lg">{job.company}</h3>
          <span className="text-gray-500 block">{job.location}</span>
        </div>
      </div>
      
      {/* Important notice to users */}
      <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800 mb-1">Important Notice</p>
            <p className="text-sm text-blue-700">
              Please read the full job description before applying. You may also need to register on the company&apos;s website to complete your application.
            </p>
          </div>
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
        {hasApplied(job.id) ? (
          <Button 
            variant="outline"
            onClick={onViewApplication}
            className="w-full md:w-auto"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Your Application
          </Button>
        ) : (
          <Button 
            onClick={() => onOpenApplyModal(job)}
            className="w-full md:w-auto"
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
} 