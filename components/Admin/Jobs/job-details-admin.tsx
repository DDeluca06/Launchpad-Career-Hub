"use client";

import { Button } from "@/components/ui/basic/button";
import { Badge } from "@/components/ui/basic/badge";
import { Separator } from "@/components/ui/basic/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { format } from "date-fns";
import { extendedPalette } from "@/lib/colors";
import { JobDetailsProps } from "./types";
import { 
  Building2, MapPin, Calendar, Briefcase, 
  ExternalLink, Edit, Archive, Users, ArchiveRestore
} from "lucide-react";

export function JobDetailsSkeleton() {
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

export function JobDetailsAdmin({
  job,
  applicationsCount,
  isLoading,
  onEdit,
  onArchive,
  noCard = false
}: JobDetailsProps) {
  if (isLoading || !job) {
    return noCard ? (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <Building2 className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700">
          No job selected
        </h3>
        <p className="text-gray-500 max-w-md mt-2">
          Select a job from the list to view its details and manage applications
        </p>
      </div>
    ) : (
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <JobDetailsSkeleton />
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
              <Building2 className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">
                No job selected
              </h3>
              <p className="text-gray-500 max-w-md mt-2">
                Select a job from the list to view its details and manage applications
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Format the job type string for display
  const formatJobType = (type: string) => {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Determine job type color based on type
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

  const jobTypeColor = getJobTypeColor(job.job_type);

  return noCard ? (
    <div className="p-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <Building2 className="h-4 w-4" />
            <span>{job.company}</span>
            {job.location && (
              <>
                <span className="mx-1">•</span>
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onEdit(job)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`gap-1 ${
              job.archived
                ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700"
            }`}
            onClick={onArchive}
          >
            {job.archived ? (
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
            backgroundColor: `${jobTypeColor}15`,
            borderColor: `${jobTypeColor}30`,
            color: jobTypeColor 
          }}
        >
          <Briefcase className="mr-1 h-3 w-3" />
          {formatJobType(job.job_type)}
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
          <Users className="mr-1 h-3 w-3" />
          {applicationsCount[job.job_id] || 0} {applicationsCount[job.job_id] === 1 ? 'applicant' : 'applicants'}
        </Badge>
        
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
            <Calendar className="mr-1 h-3 w-3" />
            Posted {format(
              typeof job.created_at === 'string' 
                ? new Date(job.created_at) 
                : job.created_at || new Date(), 
              'MMM d, yyyy'
            )}
          </Badge>
        )}
      </div>

      {job.website && (
        <div className="mb-6">
          <a
            href={job.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            {job.website}
          </a>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Description</h2>
        <div className="prose prose-sm max-w-none">
          {job.description ? (
            <div className="whitespace-pre-wrap">{job.description}</div>
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </div>
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-gray-100">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-6" />

      <div>
        <h2 className="text-lg font-medium mb-2">Applications</h2>
        {(applicationsCount[job.job_id] || 0) > 0 ? (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              This job has {applicationsCount[job.job_id]} applications.
            </p>
            
            {job.applications && job.applications.length > 0 ? (
              <div>
                <div className="space-y-2 mt-3 max-h-[300px] overflow-y-auto pr-1 border border-gray-100 rounded-md p-2">
                  {job.applications.slice(0, 5).map((app) => (
                    <Card key={app.application_id} className="p-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {app.users?.first_name} {app.users?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Applied: {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          className="text-xs"
                          style={{
                            backgroundColor: app.status === 'APPLIED' 
                              ? `${extendedPalette.primaryBlue}15`
                              : app.status === 'INTERVIEW_STAGE' || app.status === 'PHONE_SCREENING' || app.status === 'FINAL_INTERVIEW_STAGE'
                              ? `${extendedPalette.primaryGreen}15`
                              : app.status === 'OFFER_ACCEPTED'
                              ? `${extendedPalette.darkGreen}15`
                              : `${extendedPalette.darkGray}15`,
                            color: app.status === 'APPLIED' 
                              ? extendedPalette.primaryBlue
                              : app.status === 'INTERVIEW_STAGE' || app.status === 'PHONE_SCREENING' || app.status === 'FINAL_INTERVIEW_STAGE'
                              ? extendedPalette.primaryGreen
                              : app.status === 'OFFER_ACCEPTED'
                              ? extendedPalette.darkGreen
                              : extendedPalette.darkGray
                          }}
                        >
                          {app.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {job.applications.length > 5 && (
                  <Button 
                    variant="link" 
                    size="sm"
                    className="mt-2 text-blue-600"
                    onClick={() => window.location.href = `/admin/applicants?job_id=${job.job_id}`}
                  >
                    View all {job.applications.length} applicants
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => window.location.href = `/admin/applicants?job_id=${job.job_id}`}
              >
                View Applications
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No applications yet for this position.
          </p>
        )}
      </div>
    </div>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-6 pb-12">{/* existing content */}</div>
      </CardContent>
    </Card>
  );
} 