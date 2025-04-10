import React, { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/basic/avatar";
import { Badge } from "@/components/ui/basic/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Mail, FileText, Clock, Archive, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/basic/button";
import { toast } from "@/components/ui/feedback/use-toast";

// Interface definitions
interface ApplicantWithDetails {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  applications: number;
  status: string;
  createdAt: string;
  program: string;
  isArchived?: boolean;
}

interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
}

interface ApplicantProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: ApplicantWithDetails | null;
  jobApplications: JobApplication[];
  loadingApplications: boolean;
  onRefresh?: () => void;
}

/**
 * Modal component for displaying an applicant's detailed profile
 */
export function ApplicantProfileModal({
  open,
  onOpenChange,
  applicant,
  jobApplications,
  loadingApplications,
  onRefresh,
}: ApplicantProfileModalProps) {
  if (!applicant) return null;
  
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to toggle archive status
  const toggleArchiveStatus = async () => {
    if (!applicant) return;
    
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/applicants/${applicant.id}/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isArchived: !applicant.isArchived,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update archive status');
      }
      
      // Show success message
      toast({
        title: "Success",
        description: applicant.isArchived 
          ? `${applicant.firstName} ${applicant.lastName} has been unarchived` 
          : `${applicant.firstName} ${applicant.lastName} has been archived`,
      });
      
      // Refresh the data
      if (onRefresh) {
        onRefresh();
      }
      
      // Close the modal
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating archive status:", error);
      toast({
        title: "Error",
        description: "Failed to update archive status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to get status badge with appropriate styling
  function getStatusBadge(status: string) {
    switch (status) {
      case "unapplied":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Unapplied
          </Badge>
        );
      case "interview":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            In Interview
          </Badge>
        );
      case "placed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Placed
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Archived
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  }

  // Function to render job application status badges
  function getApplicationStatusBadge(status: string) {
    switch (status) {
      case "interested":
        return <Badge className="bg-blue-100 text-blue-800">Interested</Badge>;
      case "applied":
        return <Badge className="bg-purple-100 text-purple-800">Applied</Badge>;
      case "phoneScreening":
      case "phone_screening":
        return <Badge className="bg-indigo-100 text-indigo-800">Phone Screening</Badge>;
      case "interviewStage":
      case "interview_stage":
        return <Badge className="bg-cyan-100 text-cyan-800">Interview Stage</Badge>;
      case "finalInterviewStage":
      case "final_interview_stage":
        return <Badge className="bg-teal-100 text-teal-800">Final Interview</Badge>;
      case "offerExtended":
      case "offer_extended":
        return <Badge className="bg-yellow-100 text-yellow-800">Offer Extended</Badge>;
      case "negotiation":
        return <Badge className="bg-orange-100 text-orange-800">Negotiation</Badge>;
      case "offerAccepted":
      case "offer_accepted":
        return <Badge className="bg-green-100 text-green-800">Offer Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  }

  return (
    <MultiPurposeModal
      open={open}
      onOpenChange={onOpenChange}
      title={`${applicant.firstName} ${applicant.lastName}`}
      size="lg"
      showFooter={true}
      primaryActionText="Close"
      onPrimaryAction={() => onOpenChange(false)}
      secondaryActionText=""
      onSecondaryAction={() => {}}
    >
      <div className="py-4 space-y-6">
        {/* Applicant Overview */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${applicant.firstName} ${applicant.lastName}`}
              alt={`${applicant.firstName} ${applicant.lastName}`}
            />
            <AvatarFallback>
              {applicant.firstName.charAt(0)}{applicant.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{applicant.firstName} {applicant.lastName}</h2>
              {getStatusBadge(applicant.status)}
              {applicant.isArchived && (
                <Badge className="bg-red-100 text-red-800">
                  Archived
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{applicant.userId}</div>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{applicant.email}</span>
            </div>
            
            {/* Archive/Unarchive Button */}
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${applicant.isArchived ? 'border-green-600 text-green-600 hover:bg-green-50' : 'border-red-600 text-red-600 hover:bg-red-50'}`}
                onClick={toggleArchiveStatus}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : applicant.isArchived ? (
                  <RefreshCw className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                {applicant.isArchived ? 'Unarchive Applicant' : 'Archive Applicant'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Applicant Status & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Program</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p>{applicant.program}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex items-center gap-2">
                {getStatusBadge(applicant.status)}
                <span className="text-sm">
                  {applicant.status === "unapplied" && "Has not applied to any jobs yet"}
                  {applicant.status === "interview" && "Currently in interview process"}
                  {applicant.status === "placed" && "Successfully placed in a job"}
                  {applicant.status === "archived" && "Applicant has been archived"}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Joined</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p>{new Date(applicant.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Applications Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Job Applications</h3>
          {loadingApplications ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : jobApplications.length > 0 ? (
            <div className="space-y-3">
              {jobApplications.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{job.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        {getApplicationStatusBadge(job.status)}
                        <span className="text-xs text-muted-foreground">
                          Applied {new Date(job.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-medium mb-1">No Applications</h4>
                <p className="text-sm text-muted-foreground">
                  This applicant hasn't applied to any jobs yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MultiPurposeModal>
  );
} 