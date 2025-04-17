"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { KanbanPage } from "@/components/kanban/KanbanPage";
import { Button } from "@/components/ui/basic/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/basic/card";
import { Plus, RefreshCw, Info, Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/feedback/alert";
import { toast } from "@/components/ui/feedback/use-toast";
import {KanbanBoard} from "@/components/kanban";

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
  subStage?: string | null;
  isRecommendation?: boolean;
}

interface DashboardData {
  applications: Application[];
  savedJobs: unknown[];
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
  details?: unknown;
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
  'REJECTED': null, // No sub-stage needed as it's a main stage now
  'referrals': 'referrals' // Keep referrals as a sub-stage
};

export default function ApplicantDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasRecommendations, setHasRecommendations] = useState(false);

  // Prevent default form submissions and navigation
  useEffect(() => {
    const preventSubmit = (e: Event) => {
      if ((e.target as HTMLElement).tagName === 'FORM') {
        e.preventDefault();
        console.log('Form submission prevented');
      }
    };

    document.addEventListener('submit', preventSubmit);
    return () => {
      document.removeEventListener('submit', preventSubmit);
    };
  }, []);

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

        // Check if there are any recommendations
        const hasRecs = responseData.applications.some((app: Application) =>
            app.subStage === 'referrals'
        );
        setHasRecommendations(hasRecs);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError({
          error: 'Data loading error',
          message: error instanceof Error ? error.message : 'Failed to load dashboard data. Please try again later.'
        });
      } finally {
        // Add a slight delay to loading state to prevent UI flashing
        setTimeout(() => setLoading(false), 300);
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
      // Special handling for referrals/recommendations
      if (app.subStage === 'referrals') {
        return {
          id: app.id,
          status: 'referrals', // Use dedicated column for referrals
          subStage: 'referrals',
          job: {
            title: app.job?.title || 'Unknown Position',
            company: app.job?.company || 'Unknown Company',
            id: app.job?.id
          },
          // Fallbacks in case job is undefined
          title: app.job?.title || 'Unknown Position',
          company: app.job?.company || 'Unknown Company',
          updatedAt: app.updatedAt,
          jobId: app.job?.id,
          isRecommendation: true
        };
      }

      // Regular application handling
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

  // Transform applications for Kanban
  const kanbanApplications = transformForKanban(data?.applications);

  // Add a handler for status changes
  const handleStatusChange = async (applicationId: string, newStatus: string, subStage?: string) => {
    try {
      console.log(`Attempting to update application ${applicationId} to: ${newStatus} (${subStage || 'no sub-stage'})`);

      // Show toast notification for status change
      toast({
        title: "Updating status...",
        description: `Moving application to ${newStatus}${subStage ? ` (${subStage})` : ''}`,
      });

      // Direct API call with exactly what columns need
      const response = await fetch(`/api/applicant/update-app-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          columnStatus: newStatus,
          subStage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update application status');
      }

      // Show success toast
      toast({
        title: "Status updated",
        description: `Application moved to ${newStatus}${subStage ? ` (${subStage})` : ''}`,
        variant: "default",
      });

      // Refresh the dashboard data
      setRetryCount(prev => prev + 1);

      // Return a resolved promise to indicate success
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating application status:', error);

      // Show error toast
      toast({
        title: "Error updating status",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });

      // Return a rejected promise to indicate failure
      return Promise.reject(error);
    }
  };

  // Handle clicking on job details
  const handleViewJobDetails = (applicationId: string, jobId?: string | number) => {
    if (jobId) {
      // Navigate to the jobs page with the specific job selected
      router.push(`/applicant/jobs?jobId=${jobId}`);
    } else {
      // If no job ID is available, perhaps show application details instead
      console.log(`View application details: ${applicationId}`);
    }
  };

  // Calculate statistics for the dashboard
  const calculateStats = () => {
    if (!data?.applications) return { total: 0, active: 0, interviews: 0, offers: 0 };

    const total = data.applications.length;
    const active = data.applications.filter(app =>
        app.status !== 'REJECTED' && app.status !== 'OFFER_ACCEPTED'
    ).length;
    const interviews = data.applications.filter(app =>
        app.status === 'PHONE_SCREENING' ||
        app.status === 'INTERVIEW_STAGE' ||
        app.status === 'FINAL_INTERVIEW_STAGE'
    ).length;
    const offers = data.applications.filter(app =>
        app.status === 'OFFER_EXTENDED' ||
        app.status === 'NEGOTIATION'
    ).length;

    return { total, active, interviews, offers };
  };

  // Get the stats
  const stats = calculateStats();

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

  return (
      <DashboardLayout>
        <div className="container py-6 px-4 mx-auto pb-24">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Application Board</h1>
                <p className="text-gray-500">Track your job applications</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="gap-2"
                    disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button
                    onClick={() => router.push('/applicant/jobs')}
                    className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Find Jobs
                </Button>
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-white border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Applications</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-white border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Applications</p>
                    <p className="text-2xl font-bold">{stats.active}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-green-700" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-white border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Interviews</p>
                    <p className="text-2xl font-bold">{stats.interviews}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-700" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-white border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Offers</p>
                    <p className="text-2xl font-bold">{stats.offers}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-amber-700" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recommendation alert */}
            {hasRecommendations && (
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-5 w-5 text-amber-500" />
                  <AlertTitle className="text-amber-800">New Job Recommendations</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Your Career Launch advisor has recommended jobs for you. Check the &quot;Referrals&quot; column to see them.
                  </AlertDescription>
                </Alert>
            )}

            {/* Error state */}
            {error && (
                <Card className="p-6 bg-red-50 border-red-200">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0 rounded-full bg-red-100 p-2">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-red-800">{(error as ApiError).error}</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{(error as ApiError).message || 'An error occurred while loading your data.'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pl-12">
                      <Button
                          onClick={handleRetry}
                          variant="outline"
                          className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                      </Button>
                    </div>
                  </div>
                </Card>
            )}

            {/* Kanban board with loading state */}
            <div className="mt-4">
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
