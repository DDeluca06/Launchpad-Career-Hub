"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Job } from "@/lib/local-storage"
import { LaunchpadImage } from "@/components/ui/image"
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar,
  CheckCircle2,
  ExternalLink,
  Share2,
  Bookmark
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export interface JobDetailsProps {
  job: Job
  onApplyClick?: () => void
  onSaveClick?: () => void
  onShareClick?: () => void
}

export function JobDetails({ job, onApplyClick, onSaveClick, onShareClick }: JobDetailsProps) {
  const formatSalary = (salary: string) => {
    if (!salary) return 'Not specified';
    
    if (salary.includes('-')) {
      const [min, max] = salary.split('-');
      return `$${min.trim()} - $${max.trim()}`;
    }
    
    return salary;
  };
  
  // Parse tags from the job
  const jobTags = job.tags || [];
  
  // Generate a random list of job requirements if none exist
  const defaultRequirements = [
    "Experience with modern web development techniques",
    "Strong understanding of JavaScript and TypeScript",
    "Experience with React and modern front-end libraries",
    "Ability to write clean, maintainable code",
    "Experience with Git and CI/CD pipelines"
  ];
  
  // Generate a random list of job responsibilities if none exist
  const defaultResponsibilities = [
    "Develop new user-facing features using React.js",
    "Build reusable components for future use",
    "Optimize components for maximum performance",
    "Collaborate with other team members and stakeholders",
    "Troubleshoot and fix bugs in existing code"
  ];
  
  // Format the date correctly
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-16 w-16 rounded-md border border-gray-200 flex items-center justify-center bg-white overflow-hidden shrink-0">
          <LaunchpadImage imageId="default-profile-picture" width={64} height={64} className="h-full w-full object-contain" />
        </div>
        <div className="space-y-1 flex-1">
          <h1 className="text-xl font-semibold">{job.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            <Building2 className="h-4 w-4 mr-1" />
            <span>{job.company}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.location && (
              <div className="inline-flex items-center text-xs text-gray-500 gap-1">
                <MapPin className="h-3 w-3" /> {job.location}
              </div>
            )}
            {job.job_type && (
              <div className="inline-flex items-center text-xs text-gray-500 gap-1">
                <Briefcase className="h-3 w-3" /> {job.job_type}
              </div>
            )}
            {job.created_at && (
              <div className="inline-flex items-center text-xs text-gray-500 gap-1">
                <Calendar className="h-3 w-3" /> Posted {formatDate(job.created_at)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {onApplyClick && (
          <Button className="flex-1" onClick={onApplyClick}>
            Apply Now
          </Button>
        )}
        {onSaveClick && (
          <Button variant="outline" size="icon" onClick={onSaveClick} title="Save Job">
            <Bookmark className="h-4 w-4" />
          </Button>
        )}
        {onShareClick && (
          <Button variant="outline" size="icon" onClick={onShareClick} title="Share Job">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
        {job.website && (
          <a 
            href={job.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "flex items-center justify-center"
            )}
            title="View Company Website"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
      
      <Separator />
      
      {/* Job Description */}
      {job.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {job.description}
          </div>
        </div>
      )}
      
      {/* Job Responsibilities */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
        <ul className="list-none space-y-2">
          {defaultResponsibilities.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Job Requirements */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Requirements</h2>
        <ul className="list-none space-y-2">
          {defaultRequirements.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Job Tags/Skills */}
      {jobTags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {jobTags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 