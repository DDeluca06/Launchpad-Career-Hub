import React from 'react';
import { Card, CardContent } from "@/components/ui/basic/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/basic/avatar";
import { Badge } from "@/components/ui/basic/badge";
import { Button } from "@/components/ui/basic/button";

interface ApplicationStatusCount {
  interested: number;
  applied: number;
  phoneScreening: number;
  interviewStage: number;
  finalInterview: number;
  offerExtended: number;
  negotiation: number;
  offerAccepted: number;
  rejected: number;
}

interface ApplicantWithDetails {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  applications: number;
  program: string;
  isArchived?: boolean;
  applicationStatusCount: ApplicationStatusCount;
}

interface ApplicantCardProps {
  applicant: ApplicantWithDetails;
  onViewProfile: (applicant: ApplicantWithDetails) => void;
}

/**
 * Renders a card displaying an applicant's information.
 * 
 * @param applicant - The applicant data to display
 * @param onViewProfile - Function to call when the "View Profile" button is clicked
 */
export function ApplicantCard({ applicant, onViewProfile }: ApplicantCardProps) {
  // Function to get the program badge with appropriate colors
  function getProgramBadge(program: string) {
    switch (program.toUpperCase()) {
      case "101":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            101
          </Badge>
        );
      case "LIFTOFF":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Liftoff
          </Badge>
        );
      case "FOUNDATION":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Foundation
          </Badge>
        );
      case "ALUMNI":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Alumni
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {program}
          </Badge>
        );
    }
  }

  // Define status groups with their colors matching the analytics chart
  const statusBadges = [
    {
      label: "Interested",
      count: applicant.applicationStatusCount?.interested || 0,
      className: "bg-[#c3ebf1] text-[#0a8196]"
    },
    {
      label: "Applied",
      count: applicant.applicationStatusCount?.applied || 0,
      className: "bg-[#e3edd3] text-[#658639]"
    },
    {
      label: "Interview",
      count: (applicant.applicationStatusCount?.phoneScreening || 0) + 
             (applicant.applicationStatusCount?.interviewStage || 0) + 
             (applicant.applicationStatusCount?.finalInterview || 0),
      className: "bg-[#0faec9] text-white"
    },
    {
      label: "Negotiation",
      count: applicant.applicationStatusCount?.negotiation || 0,
      className: "bg-[#f27e34] text-white"
    },
    {
      label: "Accepted",
      count: applicant.applicationStatusCount?.offerAccepted || 0,
      className: "bg-[#8eb651] text-white"
    },
    {
      label: "Rejected",
      count: applicant.applicationStatusCount?.rejected || 0,
      className: "bg-[#67686a] text-white"
    }
  ];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${applicant.firstName} ${applicant.lastName}`}
              alt={`${applicant.firstName} ${applicant.lastName}`}
            />
            <AvatarFallback>
              {applicant.firstName.charAt(0)}{applicant.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {applicant.firstName} {applicant.lastName}
              </h3>
              {getProgramBadge(applicant.program)}
              {applicant.isArchived && (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  Archived
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {applicant.userId}
              </span>
              <span className="text-sm text-gray-500">
                • {applicant.email}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {statusBadges.map((status) => (
                status.count > 0 && (
                  <span
                    key={status.label}
                    className={`text-xs px-2 py-1 rounded ${status.className}`}
                  >
                    {status.label}: {status.count}
                  </span>
                )
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-[#0faec9] text-[#0faec9] hover:bg-[#c3ebf1]"
            onClick={() => onViewProfile(applicant)}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 