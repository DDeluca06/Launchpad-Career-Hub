"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { KanbanPage } from "@/components/kanban";
import { Button } from "@/components/ui/basic/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/basic/card";

// Define types for our dashboard data
interface Application {
  id: string;
  status: string;
  job: {
    title: string;
    company: string;
  };
  updatedAt: string;
}

interface DashboardData {
  applications: Application[];
  savedJobs: any[];
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ApplicantDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data from our API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/applicant/dashboard');
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load dashboard data');
        }

        setData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError(error.message || 'Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                {data?.applications.filter(a => a.status !== 'rejected').length || 0}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Saved Jobs</h3>
              <p className="text-3xl font-bold">{data?.savedJobs.length || 0}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              <p className="text-sm text-gray-600">
                {data?.applications[0] ? (
                  `Last update: ${new Date(data.applications[0].updatedAt).toLocaleDateString()}`
                ) : (
                  'No recent activity'
                )}
              </p>
            </Card>
          </div>

          {/* Kanban Board */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Application Status</h2>
            </div>
            <KanbanPage 
              applications={data?.applications || []} 
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
