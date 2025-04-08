'use client'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { userService, applicationService, jobService } from "@/lib/local-storage"
import { 
  BarChart2, 
  Download, 
  FileText,
  Filter,
  PieChart, 
  TrendingUp, 
  Users 
} from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { Skeleton } from "@/components/ui/feedback/skeleton"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal"
import { JobFilters } from "@/components/job-filters"

// Define user and application interfaces
interface User {
  id: string;
  name: string;
  role: string;
}

interface Application {
  id: string;
  status: string;
}

// Define interfaces for analytics data
interface OverviewMetrics {
  totalApplicants: number;
  totalJobs: number;
  totalApplications: number;
  acceptanceRate: number;
  placementRate: number;
}

interface ApplicationOverTime {
  month: string;
  applications: number;
}

interface StatusDistribution {
  name: string;
  value: number;
}

interface JobCategory {
  name: string;
  value: number;
}

interface ProgramPlacement {
  name: string;
  graduates: number;
  placements: number;
}

interface AnalyticsData {
  overview: OverviewMetrics;
  applicationsOverTime: ApplicationOverTime[];
  statusDistribution: StatusDistribution[];
  topJobCategories: JobCategory[];
  placementsByProgram: ProgramPlacement[];
}

// Define the matching JobFilter interface
interface JobFilter {
  jobTypes: string[];
  locations: string[];
  remoteOnly: boolean;
  salary: [number, number];
  experienceLevel: string;
  keywords: string;
}

// Update defaultFilters
const defaultFilters: JobFilter = {
  jobTypes: [],
  locations: [],
  remoteOnly: false,
  salary: [0, 200],
  experienceLevel: "any",
  keywords: ""
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

// Helper function to calculate chart domains
const calculateDomain = (dataMax: number) => Math.ceil(dataMax * 1.2);

/**
 * Renders a card displaying a metric overview with a title, value, icon, and an optional trend indicator.
 *
 * When in a loading state, it shows a skeleton loader instead of the value and trend. If trend data is provided,
 * it displays an indicator showing whether the metric has increased or decreased relative to the previous month.
 *
 * @param title - The label for the metric.
 * @param value - The metric's value; displayed when not loading.
 * @param icon - A visual element representing the metric.
 * @param trend - Optional trend information including a display value and a flag indicating positive change.
 * @param isLoading - If true, a loading skeleton replaces the metric value and trend.
 * @returns A card element representing the overview metric.
 */
function OverviewCard({ title, value, icon, trend, isLoading }: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode;
  trend?: { value: string; isPositive: boolean };
  isLoading: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold mt-1">{value}</p>
            )}
          </div>
          <div className="rounded-full p-3 bg-gray-50">
            {icon}
          </div>
        </div>
        
        {!isLoading && trend && (
          <div className={`mt-4 text-xs flex items-center ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? 
              <TrendingUp className="h-3 w-3 mr-1" /> : 
              <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
            }
            <span>{trend.value} from previous month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Renders the admin analytics dashboard with metrics, charts, and filtering options.
 *
 * This component simulates fetching and processing analytics data, including overview metrics,
 * applications over time, application status distribution, top job categories, and placements by program.
 * It manages loading states and provides user interactions for applying filters and changing the date range.
 *
 * @remark Integration points currently simulate API calls and data processing; update these integrations for production use.
 */
export default function AdminAnalytics() {
  const [isLoading, setIsLoading] = useState(true)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      totalApplicants: 0,
      totalJobs: 0,
      totalApplications: 0,
      acceptanceRate: 0,
      placementRate: 0
    },
    applicationsOverTime: [],
    statusDistribution: [],
    topJobCategories: [],
    placementsByProgram: []
  })
  const [dateRange, setDateRange] = useState("last12Months")

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true)
      
      try {
        // INTEGRATION POINT: Replace with actual API calls when available
        // Currently using local storage services but should be replaced with API endpoints
        const [users, applications, jobs] = await Promise.all([
          userService.getAll() as unknown as User[],
          applicationService.getAll() as unknown as Application[],
          jobService.getAll()
        ])

        // INTEGRATION POINT: Filter and process data based on selected date range and filters
        const applicantUsers = users.filter(user => user.role === 'applicant')
        const acceptedApplications = applications.filter(app => 
          app.status === 'accepted'
        ).length
        
        // Basic metrics calculation
        const overview = {
          totalApplicants: applicantUsers.length,
          totalJobs: jobs.length,
          totalApplications: applications.length,
          acceptanceRate: applications.length ? Math.round((acceptedApplications / applications.length) * 100) : 0,
          placementRate: applicantUsers.length ? Math.round((acceptedApplications / applicantUsers.length) * 100) : 0
        }
        
        // INTEGRATION POINT: Generate these from actual data
        // Applications over time - should come from database with proper aggregation
        const applicationsOverTime = [
          { month: 'Jan', applications: 12 },
          { month: 'Feb', applications: 19 },
          { month: 'Mar', applications: 25 },
          { month: 'Apr', applications: 31 },
          { month: 'May', applications: 28 },
          { month: 'Jun', applications: 35 },
          { month: 'Jul', applications: 42 },
          { month: 'Aug', applications: 38 },
          { month: 'Sep', applications: 46 },
          { month: 'Oct', applications: 53 },
          { month: 'Nov', applications: 58 },
          { month: 'Dec', applications: 64 }
        ]
        
        // INTEGRATION POINT: Should come from actual status counts in database
        const statusDistribution = [
          { name: 'Submitted', value: applications.filter(app => app.status === 'submitted').length || 15 },
          { name: 'Reviewing', value: applications.filter(app => app.status === 'reviewing').length || 30 },
          { name: 'Interviewing', value: applications.filter(app => app.status === 'interviewing').length || 20 },
          { name: 'Offered', value: applications.filter(app => app.status === 'offered').length || 15 },
          { name: 'Accepted', value: applications.filter(app => app.status === 'accepted').length || 8 },
          { name: 'Rejected', value: applications.filter(app => app.status === 'rejected').length || 3 }
        ]
        
        // INTEGRATION POINT: Should be calculated from job categories and application counts
        const topJobCategories = [
          { name: 'Software Development', value: 45 },
          { name: 'Data Science', value: 25 },
          { name: 'UX/UI Design', value: 15 },
          { name: 'Project Management', value: 10 },
          { name: 'QA Testing', value: 5 }
        ]
        
        // INTEGRATION POINT: Should come from actual program data and placement tracking
        const placementsByProgram = [
          { name: 'Coding Bootcamp', graduates: 42, placements: 36 },
          { name: 'Data Science Track', graduates: 28, placements: 22 },
          { name: 'UX Design', graduates: 24, placements: 18 },
          { name: 'Cybersecurity', graduates: 18, placements: 14 },
          { name: 'Cloud Computing', graduates: 16, placements: 12 }
        ]
        
        setAnalyticsData({
          overview,
          applicationsOverTime,
          statusDistribution,
          topJobCategories,
          placementsByProgram
        })
      } catch (error) {
        console.error('Error loading analytics data:', error)
      } finally {
        // Simulate loading for demo purposes
        setTimeout(() => setIsLoading(false), 1200)
      }
    }
    
    loadAnalyticsData()
    // INTEGRATION POINT: Add filters and dateRange as dependencies when integrating with real API
  }, [])

  // Filter application handler
  const handleApplyFilters = (newFilters: JobFilter) => {
    setFilters(newFilters)
    setFilterModalOpen(false)
    
    // INTEGRATION POINT: Make API call with filters to refresh data
    // For now we just show loading and then reset it
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 600)
  }

  // Date range handler
  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
    setIsLoading(true)
    
    // INTEGRATION POINT: Make API call with new date range
    // For now we just show loading and then reset it
    setTimeout(() => setIsLoading(false), 600)
  }

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: extendedPalette.primaryBlue }}>
              Analytics Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Philadelphia career program performance and metrics</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4" /> 
              Filter Data
            </Button>
            
            <div className="flex items-center bg-gray-100 rounded-md">
              <Button 
                variant={dateRange === "last30Days" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => handleDateRangeChange("last30Days")}
                className="text-xs h-8"
              >
                30 Days
              </Button>
              <Button 
                variant={dateRange === "last90Days" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => handleDateRangeChange("last90Days")}
                className="text-xs h-8"
              >
                90 Days
              </Button>
              <Button 
                variant={dateRange === "last12Months" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => handleDateRangeChange("last12Months")}
                className="text-xs h-8"
              >
                12 Months
              </Button>
            </div>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <OverviewCard
            title="Total Applicants"
            value={analyticsData.overview.totalApplicants}
            icon={<Users className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />}
            trend={{ value: "+12%", isPositive: true }}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Jobs Available"
            value={analyticsData.overview.totalJobs}
            icon={<BarChart2 className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />}
            trend={{ value: "+8%", isPositive: true }}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Applications"
            value={analyticsData.overview.totalApplications}
            icon={<FileText className="h-5 w-5" style={{ color: extendedPalette.teal }} />}
            trend={{ value: "+15%", isPositive: true }}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Acceptance Rate"
            value={`${analyticsData.overview.acceptanceRate}%`}
            icon={<PieChart className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />}
            trend={{ value: "-3%", isPositive: false }}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Placement Rate"
            value={`${analyticsData.overview.placementRate}%`}
            icon={<TrendingUp className="h-5 w-5" style={{ color: extendedPalette.brown }} />}
            trend={{ value: "+5%", isPositive: true }}
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications Over Time</CardTitle>
                  <CardDescription>Monthly application submissions</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-64 w-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={analyticsData.applicationsOverTime}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          width={40}
                          tick={{ fontSize: 12 }}
                          domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                        />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="applications" 
                          name="Applications"
                          stroke={extendedPalette.primaryBlue} 
                          fill={`${extendedPalette.primaryBlue}40`} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              {/* Application Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Status Distribution</CardTitle>
                  <CardDescription>Current status of all applications</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-64 w-full rounded-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analyticsData.statusDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Top Job Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Job Categories</CardTitle>
                <CardDescription>Most popular job categories by application volume</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={analyticsData.topJobCategories}
                      margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
                      barSize={40}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        width={40}
                        tick={{ fontSize: 12 }}
                        domain={[0, calculateDomain]}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Applications">
                        {analyticsData.topJobCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Funnel</CardTitle>
                <CardDescription>Conversion at each stage of the application process</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.statusDistribution}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={110}
                        tick={{ fontSize: 12 }} 
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Applications">
                        {analyticsData.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Placements Tab */}
          <TabsContent value="placements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Placements by Program</CardTitle>
                <CardDescription>Job placement success rate by program</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={analyticsData.placementsByProgram}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="graduates" name="Total Graduates" fill={extendedPalette.primaryBlue} />
                      <Bar dataKey="placements" name="Placed in Jobs" fill={extendedPalette.primaryGreen} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Filter Modal */}
      <MultiPurposeModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        title="Filter Analytics Data"
        description="Refine the analytics view by specific criteria"
        size="md"
        showFooter={true}
        primaryActionText="Apply Filters"
        onPrimaryAction={() => {
          handleApplyFilters(filters)
        }}
        secondaryActionText="Reset"
        onSecondaryAction={() => setFilters(defaultFilters)}
      >
        <JobFilters
          onApply={handleApplyFilters}
          initialFilters={filters}
        />
      </MultiPurposeModal>
    </DashboardLayout>
  )
}
