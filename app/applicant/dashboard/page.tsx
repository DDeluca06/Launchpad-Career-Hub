"use client";

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/basic/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Input } from "@/components/ui/form/input"
import { Badge } from "@/components/ui/basic/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { MotionDiv } from "@/components/motion-components"
import { AnimatePresence } from "framer-motion"
import { LaunchpadImage } from "@/components/launchpad-image"
import { cn } from "@/lib/utils"
import { extendedPalette } from "@/lib/colors"
import { 
  Briefcase, 
  Building, 
  ChevronRight,
  Clock, 
  FileSpreadsheet,
  Filter, 
  MapPin, 
  Plus, 
  Search, 
  Star, 
  TrendingUp, 
  UserCircle, 
  Users 
} from "lucide-react"
import { jobService, applicationService, Job } from "@/lib/local-storage"

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
type JobStatus = "interested" | "applied" | "interview" | "offer" | "rejected";

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
  job: {
    title: string;
    company: string;
    location?: string;
    jobType?: string;
    logo?: string;
  };
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  logo?: string;
  priority?: "high" | "medium" | "low";
}

// Find the closest column to a point
function findClosestColumnElement(x: number, y: number, columnRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>): HTMLElement | null {
  let closestColumn: HTMLElement | null = null;
  let closestDistance = Infinity;
  
  // Check each column
  Object.values(columnRefs.current).forEach(columnEl => {
    if (columnEl) {
      const rect = columnEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance to column center
      const distance = Math.sqrt(
        Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
      );
      
      // Update closest if this is closer
      if (distance < closestDistance) {
        closestDistance = distance;
        closestColumn = columnEl;
      }
    }
  });
  
  return closestColumn;
}

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

  // Define status columns for the kanban board
  const statusColumns = [
    {
      id: "interested",
      title: "Saved",
      icon: <Star className="h-4 w-4" />,
      color: extendedPalette.teal,
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
      icon: <TrendingUp className="h-4 w-4" />,
      color: extendedPalette.primaryOrange,
    },
    {
      id: "rejected",
      title: "Rejected",
      icon: <UserCircle className="h-4 w-4" />,
      color: extendedPalette.darkGray,
    },
  ];

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (typeof window === 'undefined') return;
      
      setIsLoading(true);
      
      // Get all jobs
      const jobs = jobService.getAll();
      
      // Get user's applications from local storage
      const userApplications = applicationService.getAll();
      
      // If user has applications, use them
      let jobApplications: JobApplication[] = [];
      
      if (userApplications && userApplications.length > 0) {
        // Map applications to JobApplication format
        jobApplications = userApplications.map(app => {
          const job = jobService.getById(app.job_id);
          return {
            applicationId: app.application_id,
            jobId: app.job_id,
            userId: app.user_id,
            status: app.status as JobStatus,
            appliedAt: app.applied_at,
            statusUpdatedAt: app.status_updated_at,
            resumeId: app.resume_id,
            position: app.position,
            job: {
              title: job?.title || "Unknown Job",
              company: job?.company || "Unknown Company",
              location: job?.location,
              jobType: job?.job_type,
              logo: job?.companyLogo || "/placeholder-logo.png"
            },
            title: job?.title || "Unknown Job",
            company: job?.company || "Unknown Company",
            location: job?.location,
            jobType: job?.job_type,
            logo: job?.companyLogo || "/placeholder-logo.png",
            priority: Math.random() > 0.7 ? (Math.random() > 0.5 ? "high" : "medium") : "low"
          };
        });
      } else {
        // If no applications exist, create mock ones from available jobs
        jobApplications = jobs.map(job => ({
          applicationId: job.job_id,
          jobId: job.job_id,
          userId: 2,
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
          },
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.job_type,
          logo: job.companyLogo || "/placeholder-logo.png",
          priority: Math.random() > 0.7 ? (Math.random() > 0.5 ? "high" : "medium") : "low"
        }));
        
        // Save these mock applications to local storage
        jobApplications.forEach(app => {
          applicationService.create({
            user_id: app.userId,
            job_id: app.jobId,
            status: app.status,
            resume_id: app.resumeId || 0,
            position: app.position
          });
        });
      }
      
      setApplications(jobApplications);
      
      // Calculate dashboard stats
      const dashboardStats: ApplicantDashboardStats = {
        totalApplications: jobApplications.length,
        activeInterviews: jobApplications.filter(app => app.status === "interview").length,
        savedJobs: jobApplications.filter(app => app.status === "interested").length,
        completedAssessments: 3
      };
      
      setStats(dashboardStats);
      setJobStats({
        total: jobApplications.length,
        applied: jobApplications.filter(app => app.status === "applied").length,
        interested: jobApplications.filter(app => app.status === "interested").length,
        rejected: jobApplications.filter(app => app.status === "rejected").length,
      });
      
      // Generate recent activity based on applications
      const recentActivities: RecentActivity[] = generateRecentActivity(jobApplications, jobs);
      
      // Generate job recommendations
      const jobRecommendations: JobRecommendation[] = generateJobRecommendations(jobs, jobApplications);
      
      // Generate upcoming interviews from applications with interview status
      const interviews = generateUpcomingInterviews(jobApplications);
      
      setRecentActivity(recentActivities);
      setRecommendations(jobRecommendations);
      setUpcomingInterviews(interviews);
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);

  // Generate recent activity from applications
  const generateRecentActivity = (apps: JobApplication[], allJobs: Job[]): RecentActivity[] => {
    const activities: RecentActivity[] = [];
    
    // Sort applications by statusUpdatedAt (most recent first)
    const sortedApps = [...apps].sort((a, b) => 
      new Date(b.statusUpdatedAt).getTime() - new Date(a.statusUpdatedAt).getTime()
    );
    
    // Take the 4 most recent applications
    const recentApps = sortedApps.slice(0, 4);
    
    recentApps.forEach((app) => {
      const job = allJobs.find(j => j.job_id === app.jobId);
      
      let type: 'application' | 'status_change' | 'interview' | 'offer' | 'saved' = 'status_change';
      let title = 'Application Update';
      let description = `Your application for ${app.job.title} is now ${app.status}`;
      
      if (app.status === 'interested') {
        type = 'saved';
        title = 'Job Saved';
        description = `You saved the ${app.job.title} position for later`;
      } else if (app.status === 'applied') {
        type = 'application';
        title = 'Application Submitted';
        description = `You applied for ${app.job.title} at ${app.job.company}`;
      } else if (app.status === 'interview') {
        type = 'interview';
        title = 'Interview Scheduled';
        description = `Interview for ${app.job.title} position`;
      } else if (app.status === 'offer') {
        type = 'offer';
        title = 'Offer Received';
        description = `You received an offer for the ${app.job.title} position`;
      }
      
      activities.push({
        id: activities.length + 1,
        type,
        title,
        description,
        timestamp: app.statusUpdatedAt,
        job
      });
    });
    
    return activities;
  };

  // Generate job recommendations
  const generateJobRecommendations = (allJobs: Job[], userApps: JobApplication[]): JobRecommendation[] => {
    // Get job IDs that the user has already applied to
    const appliedJobIds = userApps.map(app => app.jobId);
    
    // Filter out jobs the user has already applied to
    const unappliedJobs = allJobs.filter(job => !appliedJobIds.includes(job.job_id));
    
    // Take up to 3 jobs as recommendations
    const recommendations = unappliedJobs.slice(0, 3).map(job => ({
      id: job.job_id,
      title: job.title,
      company: job.company,
      location: job.location,
      matchPercentage: Math.floor(Math.random() * 30) + 70, // Random match between 70-99%
      logo: job.companyLogo || "/placeholder-logo.png",
      isNew: Math.random() > 0.5 // 50% chance of being marked as new
    }));
    
    return recommendations;
  };

  // Generate upcoming interviews
  const generateUpcomingInterviews = (apps: JobApplication[]): UpcomingInterview[] => {
    // Filter applications with interview status
    const interviewApps = apps.filter(app => app.status === "interview");
    
    // Generate random interview dates in the future
    return interviewApps.map((app, index) => {
      const daysInFuture = Math.floor(Math.random() * 14) + 1; // 1-14 days in future
      const interviewDate = new Date();
      interviewDate.setDate(interviewDate.getDate() + daysInFuture);
      
      const formattedDate = `${interviewDate.toLocaleString('default', { month: 'short' })} ${interviewDate.getDate()}, ${interviewDate.getFullYear()}`;
      const hour = Math.floor(Math.random() * 8) + 9; // 9 AM - 5 PM
      const minute = Math.random() > 0.5 ? '00' : '30'; // Either on the hour or half past
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour > 12 ? hour - 12 : hour;
      const formattedTime = `${formattedHour}:${minute} ${ampm}`;
      
      return {
        id: 200 + index,
        company: app.job.company,
        position: app.job.title,
        date: formattedDate,
        time: formattedTime,
        type: Math.random() > 0.5 ? "Technical" : "Behavioral",
        interviewer: "Hiring Manager",
        logo: app.job.logo
      };
    });
  };

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
    // Find the application to update
    const appToUpdate = applications.find(app => app.applicationId === applicationId);
    
    if (appToUpdate) {
      // Update application in local state
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
      
      // Update application in local storage
      applicationService.updateStatus(applicationId, newStatus);
    }
    
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
            title="My Jobs"
            description="Track your job applications"
            icon={<Briefcase className="h-6 w-6" style={{ color: extendedPalette.primaryBlue }} />}
            href="/applicant/jobs"
            stats={[
              { label: "Applied", value: String(jobStats.applied) },
              { label: "Interviews", value: String(stats.activeInterviews) }
            ]}
            color={extendedPalette.primaryBlue}
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
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
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
                            onDragStart={() => handleDragStart(application.applicationId)}
                            onStatusChange={(id, status) => handleStatusChange(id, status)}
                            isDragging={draggingJob === application.applicationId}
                            columnRefs={columnRefs}
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

        {/* Two Column Layout: Recent Activity */}
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
              </div>
              <CardDescription>Your scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {upcomingInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
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
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          {interview.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          {interview.time}
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
  onDragStart: () => void;
  onStatusChange: (id: number, status: JobStatus) => void;
  isDragging: boolean;
  columnRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

function DraggableJobCard({
  application,
  onDragStart,
  onStatusChange,
  isDragging,
  columnRefs,
}: DraggableJobCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

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

  // Store card dimensions on mount
  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height
      });
      setInitialPosition({
        x: rect.left,
        y: rect.top
      });
    }
  }, []);

  // Find the closest column during drag
  const findClosestColumn = (x: number, y: number) => {
    return findClosestColumnElement(x, y, columnRefs);
  };

  // Create a drag overlay element
  const createDragOverlay = () => {
    if (!cardRef.current) return;
    
    // Get the current card's content
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: rect.left,
      y: rect.top
    });
  };

  return (
    <MotionDiv
      ref={cardRef}
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      dragMomentum={false}
      onDragStart={() => {
        setIsDraggingLocal(true);
        onDragStart();
        createDragOverlay();
        
        // Add a class to the body to prevent text selection during drag
        document.body.classList.add('dragging-active');
      }}
      onDrag={(_, info) => {
        // Update position state for the drag overlay
        setPosition({
          x: initialPosition.x + info.offset.x,
          y: initialPosition.y + info.offset.y
        });
        
        // Update visual feedback based on which column the card is over
        const closestColumn = findClosestColumn(info.point.x, info.point.y);
        
        if (closestColumn) {
          // Highlight the column being dragged over
          document.querySelectorAll('[data-column-id]').forEach((col) => {
            if (col === closestColumn) {
              col.classList.add('bg-gray-50', 'border-2', 'border-blue-300');
            } else {
              col.classList.remove('bg-gray-50', 'border-2', 'border-blue-300');
            }
          });
        }
      }}
      onDragEnd={(_, info) => {
        setIsDraggingLocal(false);
        
        // Remove body class
        document.body.classList.remove('dragging-active');
        
        // Remove all column highlights
        document.querySelectorAll('[data-column-id]').forEach((col) => {
          col.classList.remove('bg-gray-50', 'border-2', 'border-blue-300');
        });
        
        // Find the closest column to drop into
        const closestColumn = findClosestColumn(info.point.x, info.point.y);
        
        if (closestColumn) {
          const newStatus = closestColumn.getAttribute('data-column-id') as JobStatus;
          if (newStatus && newStatus !== application.status) {
            onStatusChange(application.applicationId, newStatus);
          }
        }
      }}
      style={{
        zIndex: isDraggingLocal ? 1000 : 'auto',
        position: isDraggingLocal ? 'relative' : 'static',
        opacity: isDragging && !isDraggingLocal ? 0.4 : 1,
      }}
      whileDrag={{
        scale: 1.05,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        zIndex: 100000,
        position: "relative",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      {/* Drag overlay - only visible during dragging */}
      {isDraggingLocal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: position.y,
              left: position.x,
              width: dimensions.width,
              height: dimensions.height,
              zIndex: 10001,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              opacity: 0.9,
              pointerEvents: 'none',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '2px solid #3b82f6',
            }}
          >
            <div className="p-3">
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
              </div>
            </div>
          </div>
        </div>
      )}

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
