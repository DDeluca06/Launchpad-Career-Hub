"use client";

import { Button } from "@/components/ui/basic/button";
import { Badge } from "@/components/ui/basic/badge";
import { Building2, MapPin, CheckCircle2, ExternalLink, Share2, Bookmark, Users, Clock, TagIcon } from "lucide-react";
import { Separator } from "@/components/ui/basic/separator";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/basic/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar";
import { extendedPalette } from "@/lib/colors";
import { format } from 'date-fns';

export interface Job {
  job_id: number;
  job_type: string;
  title: string;
  description?: string;
  company: string;
  website?: string;
  location?: string;
  partner_id?: number;
  created_at?: string;
  tags?: string[];
  applications?: Array<{
    application_id: number;
    status: string;
    applied_at: string;
    user_id?: number;
  }>;
  applicationCount?: number;
  partner?: {
    name: string;
    industry?: string;
    location?: string;
  };
}

export interface JobDetailsProps {
  job: Job;
  onApplyClick?: () => void;
  onSaveClick?: () => void;
  onShareClick?: () => void;
}

export function JobDetails({
  job,
  onApplyClick,
  onSaveClick,
  onShareClick,
}: JobDetailsProps) {
  const formatJobType = (type: string) => {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getJobTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'full_time':
        return extendedPalette.primaryBlue;
      case 'part_time':
        return extendedPalette.primaryGreen;
      case 'internship':
        return extendedPalette.teal;
      case 'contract':
        return extendedPalette.primaryOrange;
      case 'apprenticeship':
        return extendedPalette.brown;
      default:
        return extendedPalette.darkGray;
    }
  };

  // Generate some sample requirements if none exist
  const sampleRequirements = [
    "Experience with modern web development techniques",
    "Strong understanding of JavaScript and TypeScript",
    "Experience with React and modern front-end libraries",
    "Ability to write clean, maintainable code",
    "Experience with Git and CI/CD pipelines",
  ];

  // Generate some sample responsibilities if none exist
  const sampleResponsibilities = [
    "Develop new user-facing features using React.js",
    "Build reusable components for future use",
    "Optimize components for maximum performance",
    "Collaborate with other team members and stakeholders",
    "Troubleshoot and fix bugs in existing code",
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with colored border based on job type */}
      <div 
        className="relative border-l-4 pl-4 py-2" 
        style={{ borderColor: getJobTypeColor(job.job_type) }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{job.company}</span>
              {job.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline"
              className="px-2 py-1"
              style={{ 
                backgroundColor: `${getJobTypeColor(job.job_type)}15`,
                borderColor: `${getJobTypeColor(job.job_type)}30`,
                color: getJobTypeColor(job.job_type) 
              }}
            >
              {formatJobType(job.job_type)}
            </Badge>
            
            {job.applicationCount !== undefined && (
              <Badge 
                variant="outline" 
                className="px-2 py-1"
                style={{ 
                  backgroundColor: `${extendedPalette.primaryBlue}10`,
                  borderColor: `${extendedPalette.primaryBlue}20`,
                  color: extendedPalette.primaryBlue
                }}
              >
                <Users className="mr-1 h-3 w-3" />
                {job.applicationCount} {job.applicationCount === 1 ? 'applicant' : 'applicants'}
              </Badge>
            )}
            
            {job.created_at && (
              <Badge 
                variant="outline" 
                className="px-2 py-1"
                style={{ 
                  backgroundColor: `${extendedPalette.teal}10`,
                  borderColor: `${extendedPalette.teal}20`,
                  color: extendedPalette.teal
                }}
              >
                <Clock className="mr-1 h-3 w-3" />
                Posted {format(new Date(job.created_at), 'MMM d, yyyy')}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Company Logo and details */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="h-16 w-16 shrink-0 rounded-md border border-gray-200 flex items-center justify-center bg-white overflow-hidden">
            <Avatar className="h-full w-full rounded-md">
              <AvatarImage src="/default-company-logo.png" alt={job.company} />
              <AvatarFallback className="rounded-md bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-2 flex-1">
            {job.partner && (
              <div className="text-sm">
                <span className="font-medium">Industry:</span> {job.partner.industry || 'Not specified'}
              </div>
            )}
            {job.website && (
              <div>
                <a
                  href={job.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Visit company website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 my-6">
        {onApplyClick && (
          <Button onClick={onApplyClick} style={{ backgroundColor: extendedPalette.primaryBlue }}>
            Apply Now
          </Button>
        )}
        {onSaveClick && (
          <Button
            variant="outline"
            size="icon"
            onClick={onSaveClick}
            title="Save Job"
            style={{ borderColor: extendedPalette.primaryBlue, color: extendedPalette.teal }}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        )}
        {onShareClick && (
          <Button
            variant="outline"
            size="icon"
            onClick={onShareClick}
            title="Share Job"
            style={{ borderColor: extendedPalette.primaryBlue, color: extendedPalette.teal }}
          >
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
              "flex items-center justify-center",
            )}
            title="View Company Website"
            style={{ borderColor: extendedPalette.primaryBlue, color: extendedPalette.teal }}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <Separator style={{ backgroundColor: `${extendedPalette.primaryBlue}20` }} />

      {/* Job Description */}
      {job.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <div className="text-sm text-muted-foreground whitespace-pre-line">
            {job.description}
          </div>
        </div>
      )}

      {/* Job Responsibilities */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
        <ul className="list-none space-y-2">
          {sampleResponsibilities.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle2 
                className="h-4 w-4 mt-0.5 shrink-0" 
                style={{ color: extendedPalette.primaryGreen }}
              />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Job Requirements */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Requirements</h2>
        <ul className="list-none space-y-2">
          {sampleRequirements.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle2 
                className="h-4 w-4 mt-0.5 shrink-0" 
                style={{ color: extendedPalette.primaryBlue }}
              />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Job Tags/Skills */}
      {job.tags && job.tags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="px-2 py-1"
                style={{ 
                  backgroundColor: `${extendedPalette.lightBlue}50`,
                  borderColor: `${extendedPalette.primaryBlue}20`,
                  color: extendedPalette.teal
                }}
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}