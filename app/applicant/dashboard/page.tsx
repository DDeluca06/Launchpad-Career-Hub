"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import KanbanBoard from "@/components/kanban-board";
import { Button } from "@/components/ui/basic/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/basic/card";
import { Plus, RefreshCw } from "lucide-react";

// Define types for our dashboard data
interface Application {
  id: string;
  status: string;
  appliedAt?: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    location?: string;
    type?: string;
  };
}

interface DashboardData {
  applications: Application[];
  savedJobs: any[];
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Define error types for better error handling
interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

// Update status map to include the new statuses
const STATUS_MAP: Record<string, string> = {
  'INTERESTED': 'interested',
  'APPLIED': 'applied',
  'PHONE_SCREENING': 'interview',
  'INTERVIEW_STAGE': 'interview',
  'FINAL_INTERVIEW_STAGE': 'interview',
  'OFFER_EXTENDED': 'offer',
  'NEGOTIATION': 'offer',
  'OFFER_ACCEPTED': 'accepted', // Map to the new accepted column
  'REJECTED': 'rejected' // Map to the new rejected column
};

// Map for sub-stages
const SUB_STAGE_MAP: Record<string, string | null> = {
  'PHONE_SCREENING': 'phone_screening',
  'INTERVIEW_STAGE': 'interview_stage',
  'FINAL_INTERVIEW_STAGE': 'final_interview_stage',
  'OFFER_EXTENDED': 'offer_extended',
  'NEGOTIATION': 'negotiation',
  'OFFER_ACCEPTED': null, // No sub-stage needed as it's a main stage now
  'REJECTED': null // No sub-stage needed as it's a main stage now
};

export default function ApplicantDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load dashboard data from our API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/applicant/dashboard');
        
        const responseData = await response.json();
        
        if (!response.ok) {
          // Handle specific error types
          if (response.status === 503) {
            throw new Error('Database connection failed. Please try again later.');
          } else if (response.status === 401) {
            throw new Error('Authentication error. Please sign in again.');
          } else {
            throw new Error(responseData.message || responseData.error || 'Failed to load dashboard data');
          }
        }

        console.log('Dashboard data:', responseData); // Debug log
        setData(responseData);
        setError(null); // Clear any previous errors
      } catch (error: any) { // Type assertion for error
        console.error("Error loading dashboard data:", error);
        setError({
          error: 'Data loading error',
          message: error.message || 'Failed to load dashboard data. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [retryCount]); // Re-run the effect when retryCount changes

  // Handler for manual retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Transform applications for Kanban - update to match new component
  const transformForKanban = (applications: Application[] = []) => {
    return applications.map(app => {
      // Map API status to Kanban status
      const status = STATUS_MAP[app.status] || 'applied';
      // Get sub-stage if applicable
      const subStage = SUB_STAGE_MAP[app.status] || null;
      
      return {
        id: app.id,
        status: status,
        subStage: subStage,
        job: {
          title: app.job?.title || 'Unknown Position',
          company: app.job?.company || 'Unknown Company',
          id: app.job?.id
        },
        // Fallbacks in case job is undefined
        title: app.job?.title || 'Unknown Position',
        company: app.job?.company || 'Unknown Company',
        updatedAt: app.updatedAt,
        jobId: app.job?.id
      };
    });
  };

  // Add a handler for status changes
  const handleStatusChange = async (applicationId: string, newStatus: string, subStage?: string) => {
    try {
      // Find the appropriate API status based on the new status and subStage
      let apiStatus = Object.keys(STATUS_MAP).find(
        key => STATUS_MAP[key] === newStatus && 
              (newStatus === 'accepted' || newStatus === 'rejected' || 
               (!subStage || SUB_STAGE_MAP[key] === subStage))
      );

      // If we couldn't find a perfect match, use a default based on column
      if (!apiStatus) {
        switch (newStatus) {
          case 'interested':
            apiStatus = 'INTERESTED';
            break;
          case 'applied':
            apiStatus = 'APPLIED';
            break;
          case 'interview':
            apiStatus = subStage === 'phone_screening' ? 'PHONE_SCREENING' :
                       subStage === 'interview_stage' ? 'INTERVIEW_STAGE' :
                       subStage === 'final_interview_stage' ? 'FINAL_INTERVIEW_STAGE' :
                       'INTERVIEW_STAGE';
            break;
          case 'offer':
            apiStatus = subStage === 'negotiation' ? 'NEGOTIATION' :
                       subStage === 'offer_extended' ? 'OFFER_EXTENDED' :
                       'OFFER_EXTENDED';
            break;
          case 'accepted':
            apiStatus = 'OFFER_ACCEPTED';
            break;
          case 'rejected':
            apiStatus = 'REJECTED';
            break;
          case 'referrals':
            apiStatus = 'INTERESTED';
            break;
          default:
            apiStatus = 'APPLIED';
        }
      }

      // Update in the API
      const response = await fetch(`/api/applicant/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: apiStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      // Refresh the dashboard data
      setRetryCount(prev => prev + 1);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Handle clicking on job details
  const handleViewJobDetails = (applicationId: string, jobId?: string | number) => {
    if (jobId) {
      router.push(`/applicant/jobs/${jobId}`);
    } else {
      // If no job ID is available, perhaps show application details instead
      console.log(`View application details: ${applicationId}`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6 px-4 mx-auto pb-24">
          <div className="flex flex-col space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>

            {/* Kanban Board Skeleton */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((col) => (
                      <div key={col} className="flex flex-col space-y-4">
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-3 min-h-[500px] space-y-3">
                          {[1, 2, 3].map((card) => (
                            <div key={card} className="bg-white rounded-lg p-4 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container py-6 px-4 mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">Unable to load dashboard</h2>
            <p className="mb-4">{error.message}</p>
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Transform applications for Kanban
  const kanbanApplications = transformForKanban(data?.applications);

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto pb-24">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              {data?.profile && (
                <p className="text-gray-600">Welcome back, {data.profile.firstName}!</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => router.push('/applicant/jobs')}>
                Find Jobs
              </Button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Active Applications</h3>
              <p className="text-3xl font-bold">
                {data?.applications?.filter(a => a.status !== 'REJECTED').length || 0}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Saved Jobs</h3>
              <p className="text-3xl font-bold">{data?.savedJobs?.length || 0}</p>
            </Card>
          </div>

          {/* Kanban Board - add the job details handler */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Application Status</h2>
              <Button 
                onClick={() => router.push('/applicant/jobs')} 
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Track New Application
              </Button>
            </div>
            
            {/* Remove the div with min-width to allow proper mobile responsiveness */}
            <KanbanBoard 
              applications={kanbanApplications} 
              isLoading={loading}
              onStatusChange={handleStatusChange}
              onViewJobDetails={handleViewJobDetails}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
