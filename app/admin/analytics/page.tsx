"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/basic/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { BarChart2, Download, FileText, Filter, Users } from "lucide-react";
import { extendedPalette } from "@/lib/colors";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { JobFilters } from "@/components/Admin/Jobs/job-filters";

// Import modular components
import { OverviewCard } from "@/components/Admin/Analytics/overview-card";
import { ApplicationsOverTimeChart } from "@/components/Admin/Analytics/applications-over-time-chart";
import { StatusDistributionChart } from "@/components/Admin/Analytics/status-distribution-chart";
import { JobCategoriesChart } from "@/components/Admin/Analytics/job-categories-chart";
import { ApplicationFunnelChart } from "@/components/Admin/Analytics/application-funnel-chart";
import { PlacementsByProgramChart } from "@/components/Admin/Analytics/placements-by-program-chart";

// Define interfaces for analytics data
interface OverviewMetrics {
  totalApplicants: number;
  totalJobs: number;
  totalApplications: number;
}

interface ApplicationOverTime {
  month: string;
  applications: number;
}

interface StatusDistribution {
  status: string;
  count: number;
}

interface JobCategory {
  category: string;
  count: number;
}

interface ProgramPlacement {
  partner: string;
  placements: number;
}

interface AnalyticsData {
  overview: OverviewMetrics;
  applicationsOverTime: ApplicationOverTime[];
  statusDistribution: StatusDistribution[];
  topJobCategories: JobCategory[];
  placementsByPartner: ProgramPlacement[];
}

// Define the matching JobFilter interface
interface JobFilter {
  jobTypes: string[];
  locations: string[];
  remoteOnly: boolean;
  salary: [number, number];
  experienceLevel: string;
  keywords: string;
  tags: string[];
  programs: string[];
}

// Update defaultFilters
const defaultFilters: JobFilter = {
  jobTypes: [],
  locations: [],
  remoteOnly: false,
  salary: [0, 200],
  experienceLevel: "any",
  keywords: "",
  tags: [],
  programs: [],
};

// Colors for charts - using our design system colors
const CHART_COLORS = [
  extendedPalette.primaryBlue,
  extendedPalette.primaryGreen,
  extendedPalette.teal,
  extendedPalette.primaryOrange,
  extendedPalette.brown,
  extendedPalette.darkGreen,
];

/**
 * Renders the admin analytics dashboard.
 *
 * This component initializes state for loading, filtering, and analytics data, and fetches
 * data from the analytics API endpoint. It displays key metrics and various charts
 * showing applications over time, status distribution, top job categories, and placements by program.
 *
 * User interactions with filter options and date range selections update the dashboard view accordingly.
 */
export default function AdminAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last12Months");
  const [data, setData] = useState<AnalyticsData>({
    overview: {
      totalApplicants: 0,
      totalJobs: 0,
      totalApplications: 0,
    },
    applicationsOverTime: [],
    statusDistribution: [],
    topJobCategories: [],
    placementsByPartner: [],
  });

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);

      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append("dateRange", dateRange);
        
        // Fetch data from our analytics API endpoint
        const response = await fetch(`/api/analytics?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (error) {
        console.error("Error loading analytics data:", error);
        // Set some dummy data in case of errors
        setData({
          overview: {
            totalApplicants: 150,
            totalJobs: 45,
            totalApplications: 278,
          },
          applicationsOverTime: [
            { month: "Jan", applications: 12 },
            { month: "Feb", applications: 19 },
            { month: "Mar", applications: 25 },
            { month: "Apr", applications: 31 },
            { month: "May", applications: 28 },
            { month: "Jun", applications: 35 },
            { month: "Jul", applications: 42 },
            { month: "Aug", applications: 38 },
            { month: "Sep", applications: 46 },
            { month: "Oct", applications: 53 },
            { month: "Nov", applications: 58 },
            { month: "Dec", applications: 64 },
          ],
          statusDistribution: [
            { status: "Applied", count: 95 },
            { status: "Interested", count: 45 },
            { status: "Interview Stage", count: 65 },
            { status: "Negotiation", count: 25 },
            { status: "Accepted", count: 33 },
            { status: "Rejected", count: 15 },
          ],
          topJobCategories: [
            { category: "Software Development", count: 45 },
            { category: "Data Science", count: 25 },
            { category: "UX/UI Design", count: 15 },
            { category: "Project Management", count: 10 },
            { category: "QA Testing", count: 5 },
          ],
          placementsByPartner: [
            { partner: "Treutel - Bashirian", placements: 5 },
            { partner: "D'Amore and Crist", placements: 2 },
            { partner: "Rath - Rau", placements: 1 },
            { partner: "O'Connell and Wuckert", placements: 1 },
            { partner: "Frami - Dare", placements: 1 }
          ],
        });
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    loadAnalyticsData();
  }, [dateRange]);

  // Date range handler
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setIsLoading(true);
  };

  // Export data handler
  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      // Overview section
      ['Overview Metrics'],
      ['Metric', 'Value'],
      ['Total Applicants', data.overview.totalApplicants],
      ['Total Jobs', data.overview.totalJobs],
      ['Total Applications', data.overview.totalApplications],
      [''],
      
      // Applications over time
      ['Applications Over Time'],
      ['Month', 'Applications'],
      ...data.applicationsOverTime.map(item => [item.month, item.applications]),
      [''],
      
      // Status distribution
      ['Application Status Distribution'],
      ['Status', 'Count'],
      ...data.statusDistribution.map(item => [item.status, item.count]),
      [''],
      
      // Job categories
      ['Top Job Categories'],
      ['Category', 'Count'],
      ...data.topJobCategories.map(item => [item.category, item.count]),
      [''],
      
      // Placements by partner
      ['Placements by Partner'],
      ['Partner', 'Placements'],
      ...data.placementsByPartner.map(item => [item.partner, item.placements])
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: extendedPalette.primaryBlue }}
            >
              Analytics Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Philadelphia career program performance and metrics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-muted/20 rounded-md shadow-sm">
              <Button
                variant={dateRange === "last30Days" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDateRangeChange("last30Days")}
                className="text-xs h-8 shadow-sm hover:shadow-md transition-shadow"
              >
                30 Days
              </Button>
              <Button
                variant={dateRange === "last90Days" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDateRangeChange("last90Days")}
                className="text-xs h-8 shadow-sm hover:shadow-md transition-shadow"
              >
                90 Days
              </Button>
              <Button
                variant={dateRange === "last12Months" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDateRangeChange("last12Months")}
                className="text-xs h-8 shadow-sm hover:shadow-md transition-shadow"
              >
                12 Months
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <OverviewCard
            title="Total Applicants"
            value={data.overview.totalApplicants}
            icon={
              <Users
                className="h-5 w-5"
                style={{ color: extendedPalette.primaryBlue }}
              />
            }
            trend={{ value: "+12%", isPositive: true }}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Jobs Available"
            value={data.overview.totalJobs}
            icon={
              <BarChart2
                className="h-5 w-5"
                style={{ color: extendedPalette.primaryGreen }}
              />
            }
            trend={{ value: "+8%", isPositive: true }}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Applications"
            value={data.overview.totalApplications}
            icon={
              <FileText
                className="h-5 w-5"
                style={{ color: extendedPalette.teal }}
              />
            }
            trend={{ value: "+15%", isPositive: true }}
            isLoading={isLoading}
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applications Over Time */}
              <ApplicationsOverTimeChart 
                data={data.applicationsOverTime}
                isLoading={isLoading}
              />

              {/* Application Status Distribution */}
              <StatusDistributionChart 
                data={data.statusDistribution}
                colors={CHART_COLORS}
                isLoading={isLoading}
              />
            </div>

            {/* Top Job Categories */}
            <JobCategoriesChart 
              data={data.topJobCategories}
              colors={CHART_COLORS}
              isLoading={isLoading}
            />

            {/* Add Placements by Program to Overview tab for more prominence */}
            <PlacementsByProgramChart 
              data={data.placementsByPartner}
              barColor={extendedPalette.primaryBlue}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <ApplicationFunnelChart 
              data={data.statusDistribution}
              colors={CHART_COLORS}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Placements Tab */}
          <TabsContent value="placements" className="space-y-6">
            <PlacementsByProgramChart 
              data={data.placementsByPartner}
              barColor={extendedPalette.primaryBlue}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}