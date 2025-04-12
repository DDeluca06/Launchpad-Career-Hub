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
import { Mail, FileText, Archive, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/basic/button";
import { toast } from "@/components/ui/feedback/use-toast";
import { ApplicantWithDetails, JobApplication } from "./types";

interface ApplicantProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: ApplicantWithDetails | null;
  jobApplications: JobApplication[];
  loadingApplications: boolean;
  onRefresh?: () => void;
  onEdit?: (applicant: ApplicantWithDetails) => void;
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
  onEdit,
}: ApplicantProfileModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRetrievingResume, setIsRetrievingResume] = useState(false);
  
  if (!applicant) return null;
  
  // Function to get program badge with appropriate colors
  function getProgramBadge(program: string) {
    switch (program.toUpperCase()) {
      case "101":
        return <Badge className="bg-[#c3ebf1] text-[#0a8196]">101</Badge>;
      case "LIFTOFF":
        return <Badge className="bg-[#fcdfcc] text-[#b45e23]">Liftoff</Badge>;
      case "FOUNDATION":
        return <Badge className="bg-[#e3edd3] text-[#658639]">Foundations</Badge>;
      case "ALUMNI":
        return <Badge className="bg-[#f7f7f7] text-[#67686a]">Alumni</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{program}</Badge>;
    }
  }
  
  // Function to toggle archive status
  const toggleArchiveStatus = async () => {
    if (!applicant) return;
    
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/applicants?id=${applicant.id}&archive=true`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isArchived: !applicant.isArchived,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update archive status');
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

  // Function to retrieve resume
  const handleRetrieveResume = async () => {
    try {
      setIsRetrievingResume(true);
      const response = await fetch(`/api/applicants?id=${applicant.id}&resume=true`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to retrieve resume');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${applicant.firstName}_${applicant.lastName}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      });
    } catch (error) {
      console.error("Error retrieving resume:", error);
      toast({
        title: "Error",
        description: "Failed to retrieve resume. The applicant may not have uploaded one yet.",
        variant: "destructive",
      });
    } finally {
      setIsRetrievingResume(false);
    }
  };

  // Function to get application status badge
  function getApplicationStatusBadge(status: string) {
    switch (status) {
      case "interested":
        return <Badge className="bg-[#c3ebf1] text-[#0a8196]">Interested</Badge>;
      case "applied":
        return <Badge className="bg-[#e3edd3] text-[#658639]">Applied</Badge>;
      case "phoneScreening":
      case "phone_screening":
        return <Badge className="bg-[#0faec9] text-white">Phone Screening</Badge>;
      case "interviewStage":
      case "interview_stage":
        return <Badge className="bg-[#0faec9] text-white">Interview Stage</Badge>;
      case "finalInterviewStage":
      case "final_interview_stage":
        return <Badge className="bg-[#0faec9] text-white">Final Interview</Badge>;
      case "offerExtended":
      case "offer_extended":
        return <Badge className="bg-[#f27e34] text-white">Offer Extended</Badge>;
      case "negotiation":
        return <Badge className="bg-[#f27e34] text-white">Negotiation</Badge>;
      case "offerAccepted":
      case "offer_accepted":
        return <Badge className="bg-[#8eb651] text-white">Offer Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-[#67686a] text-white">Rejected</Badge>;
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
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">{applicant.firstName} {applicant.lastName}</h2>
              {getProgramBadge(applicant.program)}
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
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => onEdit?.(applicant)}
              >
                <FileText className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`gap-1 ${
                  applicant.isArchived
                    ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                    : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700"
                }`}
                onClick={toggleArchiveStatus}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : applicant.isArchived ? (
                  <Archive className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                {applicant.isArchived ? "Restore" : "Archive"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-[#0faec9] text-[#0faec9] hover:bg-[#c3ebf1]"
                onClick={handleRetrieveResume}
                disabled={isRetrievingResume}
              >
                {isRetrievingResume ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Retrieve Resume
              </Button>
            </div>
          </div>
        </div>
        
        {/* Application Status Summary */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Application Status Summary</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {applicant.applicationStatusCount.interested > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interested:</span>
                    <Badge className="bg-[#c3ebf1] text-[#0a8196]">
                      {applicant.applicationStatusCount.interested}
                    </Badge>
                  </div>
                )}
                {applicant.applicationStatusCount.applied > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Applied:</span>
                    <Badge className="bg-[#e3edd3] text-[#658639]">
                      {applicant.applicationStatusCount.applied}
                    </Badge>
                  </div>
                )}
                {applicant.applicationStatusCount.phoneScreening > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone Screening:</span>
                    <Badge className="bg-[#0faec9] text-white">
                      {applicant.applicationStatusCount.phoneScreening}
                    </Badge>
                  </div>
                )}
                {applicant.applicationStatusCount.interviewStage > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interview Stage:</span>
                    <Badge className="bg-[#0faec9] text-white">
                      {applicant.applicationStatusCount.interviewStage}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {applicant.applicationStatusCount.finalInterview > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Final Interview:</span>
                    <Badge className="bg-[#0faec9] text-white">
                      {applicant.applicationStatusCount.finalInterview}
                    </Badge>
                  </div>
                )}
                {applicant.applicationStatusCount.offerExtended > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Offer Extended:</span>
                    <Badge className="bg-[#f27e34] text-white">
                      {applicant.applicationStatusCount.offerExtended}
                    </Badge>
                  </div>
                )}
                {applicant.applicationStatusCount.negotiation > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Negotiation:</span>
                    <Badge className="bg-[#f27e34] text-white">
                      {applicant.applicationStatusCount.negotiation}
                    </Badge>
                  </div>
                )}
                {applicant.applicationStatusCount.offerAccepted > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Offer Accepted:</span>
                    <Badge className="bg-[#8eb651] text-white">
                      {applicant.applicationStatusCount.offerAccepted}
                    </Badge>
                  </div>
                )}
                {applicant.applicationStatusCount.rejected > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rejected:</span>
                    <Badge className="bg-[#67686a] text-white">
                      {applicant.applicationStatusCount.rejected}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
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
                  This applicant hasn&apos;t applied to any jobs yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MultiPurposeModal>
  );
} 