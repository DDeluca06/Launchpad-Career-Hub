"use client";

import { Badge } from "@/components/ui/basic/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/basic/card";
import { MapPin, DollarSign, Calendar, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/basic/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/basic/avatar";
import { formatDistanceToNow } from "date-fns";
import { extendedPalette } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface Job {
  job_id: number;
  job_type: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  website: string;
  partner_id: number;
  created_at: string;
  tags: string[];
  logo?: string;
  status?: string;
  appliedDate?: string;
  recruiter?: string;
  companyLogo?: string;
  applicationCount?: number;
}

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  compact?: boolean;
}

export function JobCard({ job, onSelect, compact = false }: JobCardProps) {
  // Determine job type color based on Launchpad's color scheme
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

  // Format job type for display
  const formatJobType = (type: string) => {
    if (!type) return 'Unknown';
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow duration-200 border-l-4 overflow-hidden",
        {
          "cursor-pointer": !compact,
        }
      )}
      style={{ borderLeftColor: getJobTypeColor(job.job_type) }}
      onClick={() => !compact && onSelect(job)}
    >
      <CardHeader className={cn("p-4 pb-2", { "p-3 pb-1": compact })}>
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 rounded-md border bg-background">
            {job.companyLogo ? (
              <AvatarImage src={job.companyLogo} alt={job.company} />
            ) : (
              <AvatarFallback className="rounded-md bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <CardTitle className={cn("text-lg font-medium line-clamp-1", { "text-base": compact })}>
              {job.title}
            </CardTitle>
            <CardDescription className="line-clamp-1">
              {job.company}
            </CardDescription>
          </div>
          {job.status && (
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                {
                  "bg-blue-50 text-blue-700 border-blue-200": job.status === "applied",
                  "bg-yellow-50 text-yellow-700 border-yellow-200": job.status === "interviewing",
                  "bg-green-50 text-green-700 border-green-200": job.status === "accepted",
                  "bg-red-50 text-red-700 border-red-200": job.status === "rejected",
                }
              )}
            >
              {job.status.toLowerCase()}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn("px-4 py-2 space-y-2", { "px-3 py-1": compact })}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{job.location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{formatJobType(job.job_type)}</span>
          </div>
          {job.appliedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>
                Applied {formatDistanceToNow(new Date(job.appliedDate), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {job.tags.slice(0, compact ? 2 : 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-1.5 py-0 text-xs font-normal border-primary/20 bg-primary/5"
                style={{ 
                  borderColor: `${extendedPalette.primaryBlue}20`,
                  backgroundColor: `${extendedPalette.lightBlue}50`,
                  color: extendedPalette.teal
                }}
              >
                {tag}
              </Badge>
            ))}
            {job.tags.length > (compact ? 2 : 3) && (
              <span className="text-xs text-muted-foreground">
                +{job.tags.length - (compact ? 2 : 3)} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      {!compact && (
        <CardFooter className="px-4 py-2 pt-0 flex justify-between items-center">
          {job.applicationCount !== undefined && (
            <Badge 
              variant="outline" 
              className="bg-primary/5 border-primary/10"
              style={{ 
                backgroundColor: `${extendedPalette.primaryBlue}10`,
                borderColor: `${extendedPalette.primaryBlue}20`,
                color: extendedPalette.primaryBlue
              }}
            >
              {job.applicationCount} {job.applicationCount === 1 ? 'applicant' : 'applicants'}
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            style={{ 
              borderColor: extendedPalette.primaryBlue,
              color: extendedPalette.teal
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(job);
            }}
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}