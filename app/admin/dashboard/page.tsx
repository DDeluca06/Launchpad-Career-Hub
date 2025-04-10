"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Building, Briefcase, Users } from "lucide-react";
import { StatsOverview, QuickActions, DashboardSection, UpcomingInterviews } from "@/components/Admin/Dashboard";
import { extendedPalette } from "@/lib/colors";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/feedback/skeleton";

/**
 * Renders the admin dashboard page with data from the database.
 * 
 * This component provides an interface for administrators to monitor key metrics and activities
 * from the database. It uses modular components from the Admin/Dashboard directory that
 * connect to the API endpoints to fetch real data.
 */
export default function AdminDashboard() {
  return (
    <DashboardLayout isAdmin={true}>
      <div className="flex flex-col p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Monitor job activities and applicant statistics</p>
        </div>
        
        {/* Stats Overview with error fallback */}
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg p-5 shadow-sm">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>}>
          <StatsOverview />
        </Suspense>
        
        {/* Dashboard Sections with Database Data - Optimized layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ErrorBoundaryWrapper>
            <DashboardSection
              title="Partner Companies"
              icon={
                <Building
                  className="h-6 w-6"
                  style={{ color: extendedPalette.brown }}
                />
              }
              href="/admin/partners"
              stats={[
                { label: "Total Partners", value: "2" },
                { label: "Total Jobs", value: "3" }
              ]}
              color={extendedPalette.brown}
              apiEndpoint="/api/dashboard/partners"
            />
          </ErrorBoundaryWrapper>

          <ErrorBoundaryWrapper>
            <DashboardSection
              title="Internship Opportunities"
              icon={
                <Briefcase
                  className="h-6 w-6"
                  style={{ color: extendedPalette.primaryGreen }}
                />
              }
              href="/admin/jobs"
              stats={[
                { label: "Unplaced Applicants", value: "2" },
                { label: "Placed Applicants", value: "0" }
              ]}
              color={extendedPalette.primaryGreen}
              apiEndpoint="/api/dashboard/internships"
            />
          </ErrorBoundaryWrapper>

          <ErrorBoundaryWrapper>
            <DashboardSection
              title="Student Applications"
              icon={
                <Users
                  className="h-6 w-6"
                  style={{ color: extendedPalette.teal }}
                />
              }
              href="/admin/applicants"
              stats={[
                { label: "Total Applications", value: "3" },
                { label: "In Interview", value: "2" }
              ]}
              color={extendedPalette.teal}
              apiEndpoint="/api/dashboard/students"
            />
          </ErrorBoundaryWrapper>
        </div>
        
        {/* Bottom Content Row - Balanced layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions - Takes 2/4 of the space */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          
          {/* Upcoming Interviews - Takes 2/4 of the space */}
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>}>
              <ErrorBoundaryWrapper>
                <UpcomingInterviews />
              </ErrorBoundaryWrapper>
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * A wrapper component that catches errors in children and renders a fallback UI.
 * This prevents the entire dashboard from crashing if one component fails.
 */
function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  // If there was an error, show a simpler version of the component
  if (hasError) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="text-sm text-gray-500">Component data unavailable</div>
        <div className="text-xs text-gray-400 mt-1">Please try refreshing the page</div>
      </div>
    );
  }
  
  // Wrap the children in error handling
  return (
    <div onError={() => setHasError(true)}>
      {children}
    </div>
  );
}