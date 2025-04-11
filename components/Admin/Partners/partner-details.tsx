"use client";

import { Button } from "@/components/ui/basic/button";
import { Badge } from "@/components/ui/basic/badge";
import { Separator } from "@/components/ui/basic/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { format } from "date-fns";
import { extendedPalette } from "@/lib/colors";
import { PartnerDetailsProps } from "./types";
import { 
  Building2, MapPin, Calendar, Briefcase, 
  ExternalLink, Edit, Archive, Users, ArchiveRestore,
  Mail, Phone, User
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/basic/avatar";

export function PartnerDetailsSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-100 rounded w-24"></div>
        <div className="h-6 bg-gray-100 rounded w-32"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
        <div className="h-20 bg-gray-100 rounded w-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
        <div className="h-4 bg-gray-100 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-1"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

export function PartnerDetails({
  partner,
  jobsCount,
  isLoading,
  onEdit,
  onArchive,
}: PartnerDetailsProps) {
  if (isLoading || !partner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partner Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PartnerDetailsSkeleton />
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
              <Building2 className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">
                No partner selected
              </h3>
              <p className="text-gray-500 max-w-md mt-2">
                Select a partner from the list to view its details and manage jobs
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Determine partner color based on partner_id for consistent coloring
  const getPartnerColor = (partnerId: number) => {
    const colorIndex = partnerId % 5;
    const colors = [
      extendedPalette.primaryBlue,
      extendedPalette.primaryGreen,
      extendedPalette.teal,
      extendedPalette.primaryOrange,
      extendedPalette.brown,
    ];
    return colors[colorIndex];
  };

  // Generate initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const partnerColor = getPartnerColor(partner.partner_id);

  return (
    <div className="p-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <Building2 className="h-4 w-4" />
            <span>{partner.industry || "Organization"}</span>
            {partner.location && (
              <>
                <span className="mx-1">•</span>
                <MapPin className="h-4 w-4" />
                <span>{partner.location}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onEdit(partner)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`gap-1 ${
              partner.is_archived
                ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700"
            }`}
            onClick={onArchive}
          >
            {partner.is_archived ? (
              <>
                <ArchiveRestore className="h-4 w-4" />
                Restore
              </>
            ) : (
              <>
                <Archive className="h-4 w-4" />
                Archive
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge 
          className="px-2 py-1"
          style={{ 
            backgroundColor: `${partnerColor}15`,
            borderColor: `${partnerColor}30`,
            color: partnerColor 
          }}
        >
          <Building2 className="mr-1 h-3 w-3" />
          {partner.industry || "Organization"}
        </Badge>
        
        <Badge 
          variant="outline" 
          className="px-2 py-1"
          style={{ 
            backgroundColor: `${extendedPalette.primaryBlue}10`,
            borderColor: `${extendedPalette.primaryBlue}20`,
            color: extendedPalette.primaryBlue
          }}
        >
          <Briefcase className="mr-1 h-3 w-3" />
          {partner.jobs_available || 0} jobs
        </Badge>
        
        {partner.partnership_start && (
          <Badge 
            variant="outline" 
            className="px-2 py-1"
            style={{ 
              backgroundColor: `${extendedPalette.teal}10`,
              borderColor: `${extendedPalette.teal}20`,
              color: extendedPalette.teal
            }}
          >
            <Calendar className="mr-1 h-3 w-3" />
            Partner since {new Date(partner.partnership_start).toLocaleDateString()}
          </Badge>
        )}
      </div>

      {partner.website && (
        <div className="mb-6">
          <a
            href={partner.website.startsWith("http") ? partner.website : `https://${partner.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            {partner.website}
          </a>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">About</h2>
        <div className="prose prose-sm max-w-none">
          {partner.description ? (
            <div className="whitespace-pre-wrap">{partner.description}</div>
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-gray-50 border border-gray-100 p-3 rounded">
          <p className="text-xs text-gray-500">Available Jobs</p>
          <p className="font-medium text-lg" style={{ color: extendedPalette.primaryBlue }}>{partner.jobs_available || 0}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 p-3 rounded">
          <p className="text-xs text-gray-500">Applicants</p>
          <p className="font-medium text-lg" style={{ color: extendedPalette.teal }}>{partner.applicants || 0}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 p-3 rounded">
          <p className="text-xs text-gray-500">Hired</p>
          <p className="font-medium text-lg" style={{ color: extendedPalette.primaryGreen }}>{partner.applicants_hired || 0}</p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Contact Information</h2>
        {partner.contact_name || partner.contact_email || partner.contact_phone ? (
          <div className="space-y-3 bg-gray-50 border border-gray-100 p-4 rounded">
            {partner.contact_name && (
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span>{partner.contact_name}</span>
              </div>
            )}
            {partner.contact_email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <a
                  href={`mailto:${partner.contact_email}`}
                  className="text-blue-600 hover:underline"
                >
                  {partner.contact_email}
                </a>
              </div>
            )}
            {partner.contact_phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                <span>{partner.contact_phone}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No contact information available.
          </p>
        )}
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="text-lg font-medium mb-2">Partner Jobs</h2>
        {partner.jobs && partner.jobs.length > 0 ? (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              This partner has {partner.jobs.length} jobs.
            </p>
            
            <div className="space-y-2 mt-3 max-h-[300px] overflow-y-auto pr-1 border border-gray-100 rounded-md p-2">
              {partner.jobs.slice(0, 5).map((job) => (
                <Card key={job.job_id} className="p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company}</p>
                    </div>
                    <Badge 
                      className="text-xs"
                      style={{
                        backgroundColor: job.archived 
                          ? `${extendedPalette.darkGray}15`
                          : `${extendedPalette.primaryGreen}15`,
                        color: job.archived
                          ? extendedPalette.darkGray
                          : extendedPalette.primaryGreen
                      }}
                    >
                      {job.archived ? "Archived" : "Active"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
            
            {partner.jobs.length > 5 && (
              <Button 
                variant="link" 
                size="sm"
                className="mt-2 text-blue-600"
                onClick={() => window.location.href = `/admin/jobs?partner_id=${partner.partner_id}`}
              >
                View all {partner.jobs.length} jobs
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">
              No jobs available for this partner organization.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-4 w-fit"
              onClick={() => window.location.href = `/admin/jobs/new?partner_id=${partner.partner_id}`}
            >
              Add Job for {partner.name}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 