"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userService, applicationService, jobService } from "@/lib/local-storage"
import { 
  BarChart2, 
  Calendar, 
  Download, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Users 
} from "lucide-react"
import { extendedPalette } from "@/lib/colors"

// For charts, we're using Recharts
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

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

interface Demographic {
  name: string;
  value: number;
}

interface AnalyticsData {
  overview: OverviewMetrics;
  applicationsOverTime: ApplicationOverTime[];
  statusDistribution: StatusDistribution[];
  topJobCategories: JobCategory[];
  placementsByProgram: ProgramPlacement[];
  applicantDemographics: Demographic[];
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
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
    placementsByProgram: [],
    applicantDemographics: []
  })

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true)
      
      // Load data from localStorage services
      const users = userService.getAll().filter(user => !user.isAdmin)
      const applications = applicationService.getAll()
      const jobs = jobService.getAll()
      
      // Calculate overview metrics
      const acceptedApplications = applications.filter(app => 
        app.status === "offerAccepted"
      ).length
      
      const overview = {
        totalApplicants: users.length,
        totalJobs: jobs.length,
        totalApplications: applications.length,
        acceptanceRate: applications.length ? Math.round((acceptedApplications / applications.length) * 100) : 0,
        placementRate: users.length ? Math.round((acceptedApplications / users.length) * 100) : 0
      }
      
      // Mock data for charts
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
      
      const statusDistribution = [
        { name: 'Interested', value: applications.filter(app => app.status === 'interested').length || 15 },
        { name: 'Applied', value: applications.filter(app => app.status === 'applied').length || 30 },
        { name: 'Screening', value: applications.filter(app => app.status === 'phoneScreening').length || 20 },
        { name: 'Interview', value: applications.filter(app => app.status === 'interviewStage').length || 15 },
        { name: 'Final', value: applications.filter(app => app.status === 'finalInterviewStage').length || 8 },
        { name: 'Offer', value: applications.filter(app => app.status === 'offerExtended').length || 5 },
        { name: 'Accepted', value: applications.filter(app => app.status === 'offerAccepted').length || 4 },
        { name: 'Rejected', value: applications.filter(app => app.status === 'rejected').length || 3 }
      ]
      
      const topJobCategories = [
        { name: 'Software Development', value: 45 },
        { name: 'Data Science', value: 25 },
        { name: 'UX/UI Design', value: 15 },
        { name: 'Project Management', value: 10 },
        { name: 'QA Testing', value: 5 }
      ]
      
      const placementsByProgram = [
        { name: 'Coding Bootcamp', graduates: 42, placements: 36 },
        { name: 'Data Science Track', graduates: 28, placements: 22 },
        { name: 'UX Design', graduates: 24, placements: 18 },
        { name: 'Cybersecurity', graduates: 18, placements: 14 },
        { name: 'Cloud Computing', graduates: 16, placements: 12 }
      ]
      
      const applicantDemographics = [
        { name: '18-21', value: 35 },
        { name: '22-25', value: 45 },
        { name: '26-30', value: 15 },
        { name: '31+', value: 5 }
      ]
      
      setAnalyticsData({
        overview,
        applicationsOverTime,
        statusDistribution,
        topJobCategories,
        placementsByProgram,
        applicantDemographics
      })
      
      setIsLoading(false)
    }
    
    loadAnalyticsData()
  }, [])

  // Colors for charts
  const COLORS = [
    extendedPalette.primaryBlue,
    extendedPalette.primaryGreen,
    extendedPalette.teal,
    extendedPalette.primaryOrange,
    extendedPalette.brown,
    extendedPalette.darkGreen,
    '#8884d8',
    '#82ca9d'
  ]

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Monitor program performance and track key metrics</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Last 12 Months
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <OverviewCard
            title="Total Applicants"
            value={analyticsData.overview.totalApplicants}
            icon={<Users className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Jobs Available"
            value={analyticsData.overview.totalJobs}
            icon={<BarChart2 className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Applications"
            value={analyticsData.overview.totalApplications}
            icon={<LineChart className="h-5 w-5" style={{ color: extendedPalette.teal }} />}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Acceptance Rate"
            value={`${analyticsData.overview.acceptanceRate}%`}
            icon={<PieChart className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Placement Rate"
            value={`${analyticsData.overview.placementRate}%`}
            icon={<TrendingUp className="h-5 w-5" style={{ color: extendedPalette.brown }} />}
            isLoading={isLoading}
          />
        </div>
        
        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Applications Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications Over Time</CardTitle>
                  <CardDescription>Monthly application submissions</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.applicationsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="applications" 
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
                    <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analyticsData.statusDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Job Categories</CardTitle>
                <CardDescription>Most popular job categories by application volume</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.topJobCategories}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={extendedPalette.primaryBlue}>
                        {analyticsData.topJobCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.statusDistribution}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 90, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill={extendedPalette.primaryBlue}>
                        {analyticsData.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.placementsByProgram}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="graduates" fill={extendedPalette.primaryBlue} name="Total Graduates" />
                      <Bar dataKey="placements" fill={extendedPalette.primaryGreen} name="Placed in Jobs" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Performance Indicators</CardTitle>
            <CardDescription>Actionable metrics and program performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Application Conversion</h3>
                <p className="text-sm text-blue-600">
                  <span className="font-bold">62% of applicants</span> progress to interview stage. Focus on improving resume workshops to increase this rate.
                </p>
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <p className="text-xs text-blue-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> 7% increase from previous quarter
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-sm font-medium text-green-800 mb-2">Program Performance</h3>
                <p className="text-sm text-green-600">
                  <span className="font-bold">Coding Bootcamp</span> has the highest ROI with 85% placement rate and $58,200 average starting salary.
                </p>
                <div className="mt-3 pt-3 border-t border-green-100">
                  <p className="text-xs text-green-500 flex items-center">
                    <Users className="h-3 w-3 mr-1" /> 36 placements from 42 graduates
                  </p>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="text-sm font-medium text-orange-800 mb-2">Growth Opportunity</h3>
                <p className="text-sm text-orange-600">
                  <span className="font-bold">Software Development</span> and <span className="font-bold">Data Science</span> have highest employer demand with 20+ open positions each.
                </p>
                <div className="mt-3 pt-3 border-t border-orange-100">
                  <p className="text-xs text-orange-500 flex items-center">
                    <BarChart2 className="h-3 w-3 mr-1" /> 34% of all job placements
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="text-sm font-medium text-purple-800 mb-2">Interview Success Factors</h3>
                <ul className="text-sm text-purple-600 space-y-1 list-disc ml-4">
                  <li>Applicants who completed mock interviews are 3.2x more likely to receive offers</li>
                  <li>Technical project portfolio increases offer rates by 68%</li>
                  <li>Recommendation: Expand interview prep workshops in all programs</li>
                </ul>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h3 className="text-sm font-medium text-teal-800 mb-2">Retention & Long-term Success</h3>
                <ul className="text-sm text-teal-600 space-y-1 list-disc ml-4">
                  <li>92% of placed applicants remain employed after 6 months</li>
                  <li>75% report satisfaction with career progression</li>
                  <li>Alumni mentorship program shows 22% impact on retention</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Generate Comprehensive Report</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function OverviewCard({ title, value, icon, isLoading }: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  isLoading: boolean 
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold mt-1">{value}</p>
            )}
          </div>
          <div className="rounded-full p-2 bg-gray-100">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
