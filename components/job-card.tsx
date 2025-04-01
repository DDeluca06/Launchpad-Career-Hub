"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LaunchpadImage } from "@/components/ui/image"
import { MapPin, Briefcase } from "lucide-react"
import { MultiPurposeModal } from "@/components/ui/multi-purpose-modal"
import { JobDetails } from "@/components/job-details"
import { jobService, Job } from "@/lib/local-storage"

export type JobStatus = 
  | "interested" 
  | "applied" 
  | "phoneScreening" 
  | "interviewStage" 
  | "finalInterviewStage" 
  | "offerExtended" 
  | "negotiation" 
  | "offerAccepted" 
  | "rejected";

interface JobCardProps {
  id: string
  title: string
  company: string
  location?: string
  jobType?: string
  companyLogo?: string
  status?: JobStatus
  draggable?: boolean
  onClick?: () => void
  dragHandleProps?: any
  fullJobDetails?: Job
}

export function JobCard({ 
  id, 
  title, 
  company, 
  location,
  jobType,
  companyLogo,
  status, 
  draggable = false, 
  onClick,
  dragHandleProps,
  fullJobDetails
}: JobCardProps) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState<Job | null>(null);

  const statusColors: Record<string, string> = {
    interested: "bg-launchpad-lightBlue hover:bg-launchpad-blue text-black",
    applied: "bg-launchpad-blue hover:bg-launchpad-teal text-white",
    phoneScreening: "bg-launchpad-green hover:bg-launchpad-darkGreen text-white",
    interviewStage: "bg-launchpad-teal hover:bg-launchpad-blue text-white",
    finalInterviewStage: "bg-launchpad-darkGreen hover:bg-launchpad-green text-white",
    offerExtended: "bg-launchpad-orange hover:bg-launchpad-brown text-white",
    negotiation: "bg-launchpad-brown hover:bg-launchpad-orange text-white",
    offerAccepted: "bg-green-600 hover:bg-green-700 text-white",
    rejected: "bg-launchpad-darkGray hover:bg-gray-700 text-white",
  }

  const statusBorderColors: Record<string, string> = {
    interested: "border-l-launchpad-lightBlue",
    applied: "border-l-launchpad-blue",
    phoneScreening: "border-l-launchpad-green",
    interviewStage: "border-l-launchpad-teal",
    finalInterviewStage: "border-l-launchpad-darkGreen",
    offerExtended: "border-l-launchpad-orange",
    negotiation: "border-l-launchpad-brown",
    offerAccepted: "border-l-green-600",
    rejected: "border-l-launchpad-darkGray",
  }

  const formatStatusLabel = (status: string): string => {
    if (!status) return '';
    
    // Handle special cases
    if (status === 'phoneScreening') return 'Phone Screening';
    if (status === 'interviewStage') return 'Interview';
    if (status === 'finalInterviewStage') return 'Final Interview';
    if (status === 'offerExtended') return 'Offer Extended';
    if (status === 'offerAccepted') return 'Offer Accepted';
    
    // Default formatting for other statuses
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleCardClick = async () => {
    if (onClick) {
      onClick();
      return;
    }
    
    if (!fullJobDetails && !jobDetails) {
      try {
        const jobId = parseInt(id);
        const details = jobService.getById(jobId);
        if (details) {
          setJobDetails(details);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    }
    
    setDetailsModalOpen(true);
  };

  const jobToDisplay = fullJobDetails || jobDetails || {
    job_id: parseInt(id),
    title,
    company,
    location: location || "",
    job_type: jobType || "",
    description: "",
    website: "",
    partner_id: 0,
    created_at: new Date().toISOString(),
    tags: []
  };

  const handleApplyClick = () => {
    console.log(`Applying for job ${id}`);
    setDetailsModalOpen(false);
  };

  return (
    <>
      <Card
        className={cn(
          "transition-all",
          status && `border-l-4 ${status ? statusBorderColors[status] : ''}`,
          draggable && "cursor-grab active:cursor-grabbing",
          "hover:shadow-md"
        )}
        onClick={handleCardClick}
        {...dragHandleProps}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-md border flex items-center justify-center bg-white overflow-hidden">
                {companyLogo ? (
                  <img src={companyLogo} alt={company} className="h-full w-full object-contain" />
                ) : (
                  <LaunchpadImage 
                    imageId="default-profile-picture" 
                    width={40} 
                    height={40} 
                    className="h-full w-full object-contain" 
                    unoptimized={true}
                  />
                )}
              </div>
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{company}</p>
              </div>
            </div>
            {status && (
              <Badge className={status ? statusColors[status] : ''}>
                {formatStatusLabel(status)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
            {jobType && (
              <div className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                <span>{jobType}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">Job ID: {id}</p>
        </CardFooter>
      </Card>

      <MultiPurposeModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        title={title}
        size="lg"
        showFooter={false}
      >
        <JobDetails 
          job={jobToDisplay} 
          onApplyClick={handleApplyClick}
          onSaveClick={() => console.log(`Saving job ${id}`)}
          onShareClick={() => console.log(`Sharing job ${id}`)}
        />
      </MultiPurposeModal>
    </>
  )
}

