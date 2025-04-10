import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/basic/avatar";
import { Badge } from "@/components/ui/basic/badge";
import { Button } from "@/components/ui/basic/button";
import { Card, CardContent } from "@/components/ui/basic/card";

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
  // Function to render the status badge with appropriate colors
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
              {getStatusBadge(applicant.status)}
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
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">
                {applicant.applications}{" "}
                {applicant.applications === 1
                  ? "application"
                  : "applications"}
              </span>
              <span className="text-xs text-gray-500">
                Program: {applicant.program}
              </span>
              <span className="text-xs text-gray-500">
                Joined{" "}
                {new Date(
                  applicant.createdAt,
                ).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => onViewProfile(applicant)}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 