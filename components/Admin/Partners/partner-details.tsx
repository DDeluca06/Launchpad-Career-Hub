"use client";

import React, { useState, useEffect } from 'react';
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
  Mail, Phone, User, Globe, Pencil
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/basic/avatar";
import { toast } from "@/components/ui/feedback/use-toast";

interface Job {
  job_id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  applications_count: number;
  created_at: string;
}

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    const loadPartnerJobs = async () => {
      if (!partner) return;
      
      setLoadingJobs(true);
      try {
        const response = await fetch(`/api/partners?partner_id=${partner.partner_id}&jobs=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch partner jobs');
        }
        const data = await response.json();
        setJobs(data.partner?.jobs || []);
      } catch (error) {
        console.error('Error loading partner jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load partner jobs",
          variant: "destructive",
        });
      } finally {
        setLoadingJobs(false);
      }
    };

    loadPartnerJobs();
  }, [partner]);

  if (isLoading || !partner) {
    return isLoading ? (
      <PartnerDetailsSkeleton />
    ) : (
      <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
        <Building2 className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700">
          No partner selected
        </h3>
        <p className="text-gray-500 max-w-md mt-2">
          Select a partner from the list to view its details
        </p>
      </div>
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
            <Pencil className="h-4 w-4" />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Available Jobs</p>
          <p className="font-semibold text-3xl" style={{ color: extendedPalette.primaryBlue }}>{jobs.length}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Applicants</p>
          <p className="font-semibold text-3xl" style={{ color: extendedPalette.teal }}>{jobsCount[partner.partner_id] || 0}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Hired</p>
          <p className="font-semibold text-3xl" style={{ color: extendedPalette.primaryGreen }}>{jobs.filter(job => job.job_type === "Hired").length}</p>
        </div>
      </div>

      {partner.website_url && (
        <div className="mb-6">
          <a
            href={partner.website_url.startsWith("http") ? partner.website_url : `https://${partner.website_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <Globe className="h-3.5 w-3.5 mr-1" />
            {partner.website_url}
          </a>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">About</h2>
        <div className="prose prose-sm max-w-none">
          {partner.description ? (
            <div className="whitespace-pre-wrap text-gray-600">{partner.description}</div>
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        {partner.contact_name || partner.contact_email || partner.contact_phone ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partner.contact_name && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Contact Person</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{partner.contact_name}</p>
                </div>
              </div>
            )}
            
            {partner.contact_email && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Email</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <a 
                    href={`mailto:${partner.contact_email}`}
                    className="text-primary hover:underline"
                  >
                    {partner.contact_email}
                  </a>
                </div>
              </div>
            )}
            
            {partner.contact_phone && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Phone</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <a 
                    href={`tel:${partner.contact_phone}`}
                    className="text-gray-900"
                  >
                    {partner.contact_phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-100 rounded-lg text-center">
            <p className="text-gray-500 mb-3">No contact information available.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => onEdit(partner)}
            >
              <Edit className="h-4 w-4" />
              Add Contact Info
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Job Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingJobs ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md" />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.job_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Badge variant="outline" className="bg-gray-50">
                          {job.job_type}
                        </Badge>
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-[#c3ebf1] text-[#0a8196]">
                      {job.applications_count} Applications
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900">No Jobs Listed</h4>
              <p className="text-gray-500 mt-1">
                This partner hasn't posted any jobs yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 