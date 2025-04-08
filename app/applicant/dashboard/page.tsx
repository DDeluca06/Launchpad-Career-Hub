"use client";

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/basic/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { Badge } from "@/components/ui/basic/badge"
import { jobService, Job } from "@/lib/local-storage"
import { Briefcase, Calendar, ChevronRight, FileSpreadsheet, MapPin, Plus, UserCircle, Users, Building, Clock, Star, Filter, Search, TrendingUp, Flag } from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/form/input"
import { LaunchpadImage } from "@/components/launchpad-image"

// Correctly type the dynamic imports
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false },
);

// Define interfaces for the dashboard data
interface ApplicantDashboardStats {
  totalApplications: number;
  activeInterviews: number;
  savedJobs: number;
  completedAssessments: number;
}

interface RecentActivity {
  id: number;
  type: 'application' | 'status_change' | 'interview' | 'offer' | 'saved';
  title: string;
  description: string;
  timestamp: string;
  job?: Job;
}

interface JobRecommendation {
  id: number;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  logo?: string;
  isNew: boolean;
}

// Define the interface for the interviews
interface UpcomingInterview {
  id: number;
  company: string;
  position: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
  logo?: string;
}

// Define job status types based on schema
type JobStatus = "interested" | "applied" | "interview" | "rejected" | "offer" | "accepted";

// Define job interface that combines backend schema with UI needs
interface JobApplication {
  applicationId: number;
  jobId: number;
  userId: number;
  status: JobStatus;
  appliedAt: string;
  statusUpdatedAt: string;
  resumeId?: number;
  position: string;
  // UI-specific properties
  job: {
    title: string;
    company: string;
    location?: string;
    jobType?: string;
    logo?: string;
  };
  priority?: "high" | "medium" | "low";
}

// Define status columns for the kanban board
const statusColumns = [
  {
    id: "interested",
    title: "Interested",
    icon: <Flag className="h-4 w-4" />,
    color: extendedPalette.lightBlue,
  },
  {
    id: "applied",
    title: "Applied",
    icon: <Briefcase className="h-4 w-4" />,
    color: extendedPalette.primaryBlue,
  },
  {
    id: "interview",
    title: "Interview",
    icon: <Users className="h-4 w-4" />,
    color: extendedPalette.primaryGreen,
  },
  {
    id: "offer",
    title: "Offer",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    color: extendedPalette.primaryOrange,
  },
  {
    id: "rejected",
    title: "Rejected",
    icon: <TrendingUp className="h-4 w-4 rotate-180" />,
    color: extendedPalette.darkGray,
  },
];

export default function ApplicantDashboard() {
  const [stats, setStats] = useState<ApplicantDashboardStats>({
    totalApplications: 0,
    activeInterviews: 0,
    savedJobs: 0,
    completedAssessments: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<UpcomingInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggingJob, setDraggingJob] = useState<number | null>(null);
  
  // Job statistics for analytics and future dashboard enhancements
  const [jobStats, setJobStats] = useState({
    total: 0,
    applied: 0,
    interested: 0,
    rejected: 0,
  });

  // Refs for columns to handle drop zones
  const columnRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (typeof window === 'undefined') return;
      
      setIsLoading(true);
      
      // In a real app, we would fetch user-specific data
      // For now, we'll simulate with mock data
      const jobs = jobService.getAll();
      
      // Transform jobs into application format
      const mockApplications: JobApplication[] = jobs.map(job => ({
        applicationId: job.job_id,
        jobId: job.job_id,
        userId: 1, // Mock user ID
        status: "interested" as JobStatus,
        appliedAt: new Date().toISOString(),
        statusUpdatedAt: new Date().toISOString(),
        position: job.title,
        job: {
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.job_type,
          logo: job.companyLogo || "/placeholder-logo.png"
        }
      }));
      
      setApplications(mockApplications);
      
      // Calculate dashboard stats
      const dashboardStats: ApplicantDashboardStats = {
        totalApplications: mockApplications.length,
        activeInterviews: mockApplications.filter(app => app.status === "interview").length,
        savedJobs: mockApplications.filter(app => app.status === "interested").length,
        completedAssessments: 3
      };
      
      setStats(dashboardStats);
      setJobStats({
        total: mockApplications.length,
        applied: mockApplications.filter(app => app.status === "applied").length,
        interested: mockApplications.filter(app => app.status === "interested").length,
        rejected: mockApplications.filter(app => app.status === "rejected").length,
      });
      
      // Generate mock recent activity
      const mockActivity: RecentActivity[] = [
        {
          id: 1,
          type: 'application',
          title: 'Application Submitted',
          description: 'You applied for Frontend Developer at Tech Co',
          timestamp: '2023-04-05T10:30:00Z',
          job: jobs.find(j => j.title === 'Frontend Developer')
        },
        {
          id: 2,
          type: 'status_change',
          title: 'Application Update',
          description: 'Your application for UX Designer is now in review',
          timestamp: '2023-04-04T14:15:00Z',
          job: jobs.find(j => j.title === 'UX Designer')
        },
        {
          id: 3,
          type: 'interview',
          title: 'Interview Scheduled',
          description: 'Technical interview for Backend Engineer position',
          timestamp: '2023-04-03T09:45:00Z',
          job: jobs.find(j => j.title === 'Backend Engineer')
        },
        {
          id: 4,
          type: 'saved',
          title: 'Job Saved',
          description: 'You saved the Product Manager position for later',
          timestamp: '2023-04-02T16:20:00Z',
          job: jobs.find(j => j.title === 'Product Manager')
        }
      ];
      
      // Generate job recommendations
      const mockRecommendations: JobRecommendation[] = [
        {
          id: 101,
          title: "Senior Frontend Developer",
          company: "Tech Innovations",
          location: "Remote",
          matchPercentage: 92,
          logo: "/placeholder-logo.png",
          isNew: true
        },
        {
          id: 102,
          title: "React Developer",
          company: "Digital Solutions",
          location: "Philadelphia, PA",
          matchPercentage: 87,
          logo: "/placeholder-logo.png",
          isNew: false
        },
        {
          id: 103,
          title: "Full Stack Engineer",
          company: "Startup Hub",
          location: "Remote",
          matchPercentage: 78,
          logo: "/placeholder-logo.png",
          isNew: true
        }
      ];
      
      // Generate upcoming interviews
      const mockInterviews = [
        {
          id: 201,
          company: "Tech Co",
          position: "Frontend Developer",
          date: "Apr 15, 2023",
          time: "10:00 AM",
          type: "Technical",
          interviewer: "Alex Johnson",
          logo: "/placeholder-logo.png"
        },
        {
          id: 202,
          company: "Digital Solutions",
          position: "React Developer",
          date: "Apr 18, 2023",
          time: "2:00 PM",
          type: "Behavioral",
          interviewer: "Sam Williams",
          logo: "/placeholder-logo.png"
        }
      ];
      
      setRecentActivity(mockActivity);
      setRecommendations(mockRecommendations);
      setUpcomingInterviews(mockInterviews);
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);

  // Update stats when jobs change
  useEffect(() => {
    setJobStats({
      total: applications.length,
      applied: applications.filter((app) => app.status === "applied").length,
      interested: applications.filter((app) => app.status === "interested").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    });
  }, [applications]);

  // Filter applications by search query
  const filteredApplications = applications.filter((app) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.job.title.toLowerCase().includes(query) ||
      app.job.company.toLowerCase().includes(query) ||
      app.job.location?.toLowerCase().includes(query) ||
      app.job.jobType?.toLowerCase().includes(query)
    );
  });

  // Get applications by status
  const getApplicationsByStatus = (status: JobStatus) => {
    return filteredApplications.filter((app) => app.status === status);
  };

  // Start dragging a job
  const handleDragStart = (applicationId: number) => {
    setDraggingJob(applicationId);
  };

  // Update job status on drop
  const handleStatusChange = (applicationId: number, newStatus: JobStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.applicationId === applicationId
          ? {
              ...app,
              status: newStatus,
              statusUpdatedAt: new Date().toISOString(),
            }
          : app,
      ),
    );
    setDraggingJob(null); // Reset dragging state
  };

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto pb-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your job search progress and opportunities</p>
          </div>
        
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Interview
            </Button>
            <Button className="gap-2" style={{ backgroundColor: extendedPalette.primaryBlue }}>
              <Plus className="h-4 w-4" />
              Save New Job
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Applications"
            value={jobStats.total}
            icon={<Briefcase className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />}
            isLoading={isLoading}
            subtitle={`${jobStats.applied} applied • ${jobStats.interested} interested`}
          />
          <StatCard 
            title="Active Interviews"
            value={stats.activeInterviews}
            icon={<Users className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Saved Jobs"
            value={stats.savedJobs}
            icon={<Star className="h-5 w-5" style={{ color: extendedPalette.teal }} />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Response Rate"
            value={jobStats.total > 0 ? Math.round((jobStats.applied / jobStats.total) * 100) : 0}
            icon={<TrendingUp className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />}
            isLoading={isLoading}
            suffix="%"
          />
        </div>
          
        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Job Applications Section */}
          <DashboardSection
            title="My Applications"
            description="Track your job applications"
            icon={<Briefcase className="h-6 w-6" style={{ color: extendedPalette.primaryBlue }} />}
            href="/applicant/jobs"
            stats={[
              { label: "Total", value: String(stats.totalApplications) },
              { label: "In Progress", value: "5" },
              { label: "Completed", value: "3" }
            ]}
            color={extendedPalette.primaryBlue}
          />
          
          {/* Calendar Section */}
          <DashboardSection
            title="My Calendar"
            description="View upcoming interviews and events"
            icon={<Calendar className="h-6 w-6" style={{ color: extendedPalette.primaryGreen }} />}
            href="/applicant/calendar"
            stats={[
              { label: "Interviews", value: String(stats.activeInterviews) },
              { label: "This Week", value: "1" },
              { label: "Next Week", value: "1" }
            ]}
            color={extendedPalette.primaryGreen}
          />
          
          {/* Profile Section */}
          <DashboardSection
            title="My Profile"
            description="Update your skills and resume"
            icon={<UserCircle className="h-6 w-6" style={{ color: extendedPalette.teal }} />}
            href="/applicant/settings"
            stats={[
              { label: "Skills", value: "12" },
              { label: "Profile", value: "85%" },
              { label: "Resume", value: "Updated" }
            ]}
            color={extendedPalette.teal}
          />
        </div>
        
        {/* Job Recommendations */}
        <div className="mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Star className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />
                  Job Recommendations
                </CardTitle>
                <Link href="/applicant/jobs">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <CardDescription>Jobs that match your skills and preferences</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {recommendations.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={job.logo} alt={job.company} />
                        <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{job.title}</h3>
                        {job.isNew && (
                          <Badge className="bg-green-100 text-green-600 hover:bg-green-200">New</Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building className="h-3.5 w-3.5 mr-1" />
                        {job.company}
                        <span className="mx-1.5">•</span>
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {job.location}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Link href={`/applicant/jobs/${job.id}`}>
                        <Button size="sm" variant="outline">View Job</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Application Pipeline</h2>
              <p className="text-gray-500">Track your job applications through different stages</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button className="gap-2" style={{ backgroundColor: extendedPalette.primaryBlue }}>
                <Plus className="h-4 w-4" />
                Add Job
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {statusColumns.map((column) => (
              <MotionDiv
                key={column.id}
                ref={(el) => {
                  columnRefs.current[column.id] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col relative z-0"
                onMouseEnter={() => setActiveColumn(column.id)}
                onMouseLeave={() => setActiveColumn(null)}
                data-column-id={column.id}
              >
                <Card
                  className={`h-full border-t-4`}
                  style={{ borderTopColor: column.color }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="rounded-md p-1.5"
                          style={{ backgroundColor: column.color }}
                        >
                          <div className="text-white">{column.icon}</div>
                        </div>
                        <CardTitle className="text-base font-semibold">
                          {column.title}
                        </CardTitle>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                        {getApplicationsByStatus(column.id as JobStatus).length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-y-auto max-h-[60vh] pt-0 px-3 pb-3 space-y-3 scroll-smooth">
                    <AnimatePresence mode="popLayout">
                      {getApplicationsByStatus(column.id as JobStatus).map(
                        (application) => (
                          <DraggableJobCard
                            key={application.applicationId}
                            application={application}
                            onDragStart={handleDragStart}
                            onStatusChange={handleStatusChange}
                            isColumnActive={activeColumn === column.id}
                            isDragging={draggingJob === application.applicationId}
                          />
                        ),
                      )}
                      {getApplicationsByStatus(column.id as JobStatus).length === 0 && (
                        <div className="h-24 border-2 border-dashed rounded-md flex items-center justify-center">
                          <p className="text-sm text-gray-400">Drop jobs here</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Two Column Layout: Recent Activity and Upcoming Interviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b bg-gray-50">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>Your latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-4">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-4">
                    <div className="mt-1">
                      <ActivityIcon type={activity.type} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming Interviews */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />
                  Upcoming Interviews
                </CardTitle>
                <Link href="/applicant/calendar">
                  <Button variant="ghost" size="sm">View Calendar</Button>
                </Link>
              </div>
              <CardDescription>Your scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {upcomingInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-600 mb-1">No interviews scheduled</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    You don&apos;t have any upcoming interviews. Keep applying to jobs to get interviews!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={interview.logo} alt={interview.company} />
                          <AvatarFallback>{interview.company.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{interview.position}</h3>
                          <p className="text-sm text-gray-500">{interview.company}</p>
                        </div>
                        <Badge className="ml-auto">
                          {interview.type} Interview
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-3">
                        <div className="flex items-center mr-4">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          {interview.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          {interview.time}
                        </div>
                        <div className="ml-auto">
                          <Button size="sm" style={{ backgroundColor: extendedPalette.primaryGreen }}>Prepare</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  isLoading, 
  subtitle,
  suffix
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  isLoading: boolean;
  subtitle?: string;
  suffix?: string;
}) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <>
                <p className="text-2xl font-bold mt-1">{value}{suffix}</p>
                {subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                )}
              </>
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

function DashboardSection({ 
  title, 
  description, 
  icon, 
  href, 
  stats, 
  color 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  href: string; 
  stats: { label: string; value: string }[];
  color: string;
}) {
  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm">
      <div className="h-1 w-full" style={{ backgroundColor: color }}></div>
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-lg font-bold" style={{ color }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t bg-gray-50">
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full justify-between">
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function ActivityIcon({ type }: { type: string }) {
  let icon;
  let color;
  
  switch (type) {
    case 'application':
      icon = <Briefcase className="h-5 w-5" />;
      color = extendedPalette.primaryBlue;
      break;
    case 'status_change':
      icon = <ChevronRight className="h-5 w-5" />;
      color = extendedPalette.primaryGreen;
      break;
    case 'interview':
      icon = <Users className="h-5 w-5" />;
      color = extendedPalette.teal;
      break;
    case 'offer':
      icon = <FileSpreadsheet className="h-5 w-5" />;
      color = extendedPalette.primaryOrange;
      break;
    case 'saved':
      icon = <Star className="h-5 w-5" />;
      color = extendedPalette.primaryBlue;
      break;
    default:
      icon = <FileSpreadsheet className="h-5 w-5" />;
      color = extendedPalette.primaryBlue;
  }
  
  return (
    <div className="rounded-full p-2" style={{ backgroundColor: `${color}20` }}>
      <div style={{ color }}>{icon}</div>
    </div>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString();
}

// Draggable Job Card Component
interface DraggableJobCardProps {
  application: JobApplication;
  onDragStart: (id: number) => void;
  onStatusChange: (id: number, status: JobStatus) => void;
  isColumnActive: boolean;
  isDragging: boolean;
}

function DraggableJobCard({
  application,
  onDragStart,
  onStatusChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isColumnActive,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDragging,
}: DraggableJobCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);

  // Get relative date from ISO string
  const getRelativeDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Calculate applied date or due date text
  const getDateText = () => {
    if (application.appliedAt) {
      return `Applied ${getRelativeDate(application.appliedAt)}`;
    }
    return "";
  };

  return (
    <MotionDiv
      ref={cardRef}
      drag
      dragSnapToOrigin
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={() => {
        setIsDraggingLocal(true);
        onDragStart(application.applicationId);
      }}
      onDragEnd={(event, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        info
      ) => {
        setIsDraggingLocal(false);
        const targetElement = document.elementFromPoint(
          (event as MouseEvent).clientX,
          (event as MouseEvent).clientY
        );
        if (targetElement) {
          const columnElement = targetElement.closest('[data-column-id]');
          if (columnElement) {
            const newStatus = columnElement.getAttribute('data-column-id') as JobStatus;
            if (newStatus && newStatus !== application.status) {
              onStatusChange(application.applicationId, newStatus);
            }
          }
        }
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
        position: "fixed",
        width: cardRef.current?.offsetWidth,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        position: isDraggingLocal ? "fixed" : "relative",
        zIndex: isDraggingLocal ? 9999 : "auto"
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
      }}
      className={`cursor-grab active:cursor-grabbing ${isDraggingLocal ? "fixed z-[9999]" : "relative"}`}
    >
      <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                <LaunchpadImage
                  src={application.job.logo || "/placeholder-logo.png"}
                  alt={application.job.company}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{application.job.title}</h3>
                <p className="text-xs text-gray-500">{application.job.company}</p>
              </div>
            </div>
            {application.priority && (
              <Badge
                className={cn(
                  "text-xs font-medium",
                  application.priority === "high"
                    ? "bg-red-100 text-red-600"
                    : application.priority === "medium"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-green-100 text-green-600",
                )}
              >
                {application.priority}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">{application.job.location}</span>
              <span className="text-gray-500">{application.job.jobType}</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-gray-500">{getDateText()}</span>
              <Badge variant="outline" className="text-xs bg-gray-50">
                ID: {application.applicationId}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
