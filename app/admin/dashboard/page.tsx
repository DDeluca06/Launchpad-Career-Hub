"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
// import { KanbanBoard } from "@/components/kanban-board"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Button } from "@/components/ui/basic/button"
import { LaunchpadImage } from "@/components/launchpad-image"
import { userService, applicationService, jobService, User, Job } from "@/lib/local-storage"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/basic/badge"
import { BarChart, Calendar, ChevronRight, Download, FileSpreadsheet, MapPin, Plus, UserCircle, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { Input } from "@/components/ui/form/input"

// Define interfaces for the dashboard data
interface DashboardStats {
  totalJobs: number;
  totalApplicants: number;
  totalApplications: number; 
  activeInterviews: number;
  offersSent: number;
  filledPositions: number;
}

interface ApplicationStats {
  interested: number;
  applied: number;
  phoneScreening: number;
  interviewStage: number;
  finalInterviewStage: number;
  offerExtended: number;
  offerAccepted: number;
  rejected: number;
}

interface RecentActivity {
  id: number;
  type: 'application' | 'status_change' | 'interview' | 'offer';
  title: string;
  description: string;
  timestamp: string;
  user?: User;
  job?: Job;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalApplicants: 0,
    totalApplications: 0,
    activeInterviews: 0,
    offersSent: 0,
    filledPositions: 0
  });
  
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    interested: 0,
    applied: 0,
    phoneScreening: 0,
    interviewStage: 0,
    finalInterviewStage: 0,
    offerExtended: 0,
    offerAccepted: 0,
    rejected: 0
  });
  
  const [topJobs, setTopJobs] = useState<Job[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (typeof window === 'undefined') return;
      
      setIsLoading(true);
      
      // Load all data from local storage
      const users = userService.getAll().filter(user => !user.isAdmin);
      const applications = applicationService.getAll();
      const jobs = jobService.getAll();
      
      // Calculate dashboard stats
      const dashboardStats: DashboardStats = {
        totalJobs: jobs.length,
        totalApplicants: users.length,
        totalApplications: applications.length,
        activeInterviews: applications.filter(app => 
          app.status === "phoneScreening" || 
          app.status === "interviewStage" || 
          app.status === "finalInterviewStage"
        ).length,
        offersSent: applications.filter(app => 
          app.status === "offerExtended" || 
          app.status === "negotiation"
        ).length,
        filledPositions: applications.filter(app => 
          app.status === "offerAccepted"
        ).length
      };
      
      // Calculate application stats
      const appStats: ApplicationStats = {
        interested: applications.filter(app => app.status === "interested").length,
        applied: applications.filter(app => app.status === "applied").length,
        phoneScreening: applications.filter(app => app.status === "phoneScreening").length,
        interviewStage: applications.filter(app => app.status === "interviewStage").length,
        finalInterviewStage: applications.filter(app => app.status === "finalInterviewStage").length,
        offerExtended: applications.filter(app => app.status === "offerExtended").length,
        offerAccepted: applications.filter(app => app.status === "offerAccepted").length,
        rejected: applications.filter(app => app.status === "rejected").length
      };
      
      // Get top jobs (jobs with most applications)
      const jobApplicationCounts = jobs.map(job => {
        const jobApplications = applications.filter(app => app.job_id === job.job_id);
        return {
          job,
          count: jobApplications.length
        };
      });
      
      const sortedJobs = jobApplicationCounts
        .sort((a, b) => b.count - a.count)
        .map(item => item.job)
        .slice(0, 5);
      
      // Get recent applicants
      const userWithApplication = users
        .map(user => {
          const userApps = applications.filter(app => app.user_id === user.user_id);
          const latestApp = userApps.sort((a, b) => 
            new Date(b.status_updated_at).getTime() - new Date(a.status_updated_at).getTime()
          )[0];
          
          return {
            user,
            latestActivity: latestApp ? new Date(latestApp.status_updated_at).getTime() : 0
          };
        })
        .sort((a, b) => b.latestActivity - a.latestActivity)
        .map(item => item.user)
        .slice(0, 5);
      
      // Generate mock recent activity
      const mockActivity: RecentActivity[] = [
        {
          id: 1,
          type: 'application',
          title: 'New Application',
          description: 'Jordan Lee applied for the Frontend Developer position',
          timestamp: '2023-04-05T10:30:00Z',
          user: users.find(u => u.username === 'applicant'),
          job: jobs.find(j => j.title === 'Frontend Developer')
        },
        {
          id: 2,
          type: 'status_change',
          title: 'Status Update',
          description: 'Alex Johnson moved to Interview Stage',
          timestamp: '2023-04-04T14:15:00Z',
          user: users.find(u => u.username === 'applicant'),
          job: jobs.find(j => j.title === 'UX Designer')
        },
        {
          id: 3,
          type: 'interview',
          title: 'Interview Scheduled',
          description: 'Technical interview scheduled with Sam Williams',
          timestamp: '2023-04-03T09:45:00Z',
          user: users.find(u => u.username === 'applicant'),
          job: jobs.find(j => j.title === 'Backend Engineer')
        },
        {
          id: 4,
          type: 'offer',
          title: 'Offer Extended',
          description: 'Offer sent to Taylor Martinez for Product Manager',
          timestamp: '2023-04-02T16:20:00Z',
          user: users.find(u => u.username === 'applicant'),
          job: jobs.find(j => j.title === 'Product Manager')
        }
      ];
      
      setStats(dashboardStats);
      setApplicationStats(appStats);
      setTopJobs(sortedJobs);
      setRecentApplicants(userWithApplication);
      setRecentActivity(mockActivity);
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of job applications and candidate pipeline</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard 
            title="Total Jobs"
            value={stats.totalJobs}
            icon={<FileSpreadsheet className="h-5 w-5 text-launchpad-blue" />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Applicants"
            value={stats.totalApplicants}
            icon={<Users className="h-5 w-5 text-launchpad-green" />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Applications"
            value={stats.totalApplications}
            icon={<FileSpreadsheet className="h-5 w-5 text-launchpad-orange" />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Active Interviews"
            value={stats.activeInterviews}
            icon={<UserCircle className="h-5 w-5 text-launchpad-teal" />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Offers Sent"
            value={stats.offersSent}
            icon={<FileSpreadsheet className="h-5 w-5 text-launchpad-darkGreen" />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Filled Positions"
            value={stats.filledPositions}
            icon={<Users className="h-5 w-5 text-launchpad-darkBlue" />}
            isLoading={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Application Pipeline */}
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Application Pipeline</CardTitle>
                  <CardDescription>Current status of all job applications</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="mr-1 h-3 w-3" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <PipelineProgressBar 
                    label="Interested" 
                    count={applicationStats.interested}
                    total={stats.totalApplications}
                    color="bg-launchpad-lightBlue"
                  />
                  <PipelineProgressBar 
                    label="Applied" 
                    count={applicationStats.applied}
                    total={stats.totalApplications}
                    color="bg-launchpad-blue"
                  />
                  <PipelineProgressBar 
                    label="Phone Screening" 
                    count={applicationStats.phoneScreening}
                    total={stats.totalApplications}
                    color="bg-launchpad-teal"
                  />
                  <PipelineProgressBar 
                    label="Interview" 
                    count={applicationStats.interviewStage}
                    total={stats.totalApplications}
                    color="bg-launchpad-green"
                  />
                  <PipelineProgressBar 
                    label="Final Interview" 
                    count={applicationStats.finalInterviewStage}
                    total={stats.totalApplications}
                    color="bg-launchpad-darkGreen"
                  />
                  <PipelineProgressBar 
                    label="Offer Extended" 
                    count={applicationStats.offerExtended}
                    total={stats.totalApplications}
                    color="bg-launchpad-orange"
                  />
                  <PipelineProgressBar 
                    label="Offer Accepted" 
                    count={applicationStats.offerAccepted}
                    total={stats.totalApplications}
                    color="bg-green-500"
                  />
                  <PipelineProgressBar 
                    label="Rejected" 
                    count={applicationStats.rejected}
                    total={stats.totalApplications}
                    color="bg-gray-400"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your job postings</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="mt-1">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="ghost" size="sm" className="w-full text-sm text-gray-500">
                View All Activity <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Top Jobs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Top Jobs</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0 border-gray-100">
                      <div className="h-10 w-10 rounded-md bg-gray-200 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {topJobs.map((job) => (
                    <div key={job.job_id} className="flex items-center gap-3 pb-3 border-b last:border-0 border-gray-100">
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <LaunchpadImage
                          src={`/company-logos/${job.company.toLowerCase().replace(/\s+/g, '-')}.png`}
                          alt={job.company}
                          width={32}
                          height={32}
                          className="object-contain"
                          fallbackSrc="/placeholder-logo.png"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{job.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{job.company}</span>
                          <span className="mx-1">•</span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-0.5" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-launchpad-blue/10 text-launchpad-blue">
                        {job.job_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Applicants */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Applicants</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0 border-gray-100">
                      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplicants.map((user) => (
                    <div key={user.user_id} className="flex items-center gap-3 pb-3 border-b last:border-0 border-gray-100">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-user.jpg" alt={user.username} />
                        <AvatarFallback>{user.username.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{user.username}</h4>
                        <p className="text-xs text-gray-500 mt-1">{user.program || 'No program specified'}</p>
                      </div>
                      <Badge className="bg-launchpad-blue/10 text-launchpad-blue">
                        Recent
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Upcoming Interviews */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Interviews</CardTitle>
                  <CardDescription>Scheduled interviews for the week</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  <Calendar className="mr-1 h-3 w-3" /> Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 border-gray-100">
                      <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" alt="Jordan Lee" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Jordan Lee</h4>
                      <p className="text-xs text-gray-500">Frontend Developer • Tech Innovators</p>
                      <p className="text-xs text-gray-400 mt-1">Technical Interview • 10:00 AM - 11:00 AM</p>
                    </div>
                    <Button size="sm" className="bg-launchpad-blue text-white hover:bg-launchpad-teal">Join</Button>
                  </div>
                  
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" alt="Alex Johnson" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Alex Johnson</h4>
                      <p className="text-xs text-gray-500">UX Designer • Creative Solutions</p>
                      <p className="text-xs text-gray-400 mt-1">Portfolio Review • 1:30 PM - 2:30 PM</p>
                    </div>
                    <Button size="sm" className="bg-launchpad-blue text-white hover:bg-launchpad-teal">Join</Button>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" alt="Sam Williams" />
                      <AvatarFallback>SW</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Sam Williams</h4>
                      <p className="text-xs text-gray-500">Backend Engineer • Tech Innovators</p>
                      <p className="text-xs text-gray-400 mt-1">Final Interview • 3:00 PM - 4:00 PM</p>
                    </div>
                    <Button size="sm" className="bg-launchpad-blue text-white hover:bg-launchpad-teal">Join</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Applications Kanban Board */}
        <div className="mt-8">
          <Tabs defaultValue="applications" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                <TabsTrigger value="import">Import Jobs</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <BarChart className="h-4 w-4" /> Reports
                </Button>
                <Button className="gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white">
                  <Plus className="h-4 w-4" /> Post Job
                </Button>
              </div>
            </div>
            
            <TabsContent value="applications" className="m-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileSpreadsheet className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-2">Applications Overview</h3>
                    <p className="text-gray-500 text-center max-w-md mb-4">
                      The Kanban board for managing applications is currently under development.
                    </p>
                    <Button className="bg-launchpad-blue hover:bg-launchpad-teal text-white">
                      View Applications List
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="candidates" className="m-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-2">Candidates Management</h3>
                    <p className="text-gray-500 text-center max-w-md mb-4">
                      This section allows you to view and manage all candidates in your pipeline.
                    </p>
                    <Button className="bg-launchpad-blue hover:bg-launchpad-teal text-white">
                      View Candidates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="jobs" className="m-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileSpreadsheet className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-2">Job Management</h3>
                    <p className="text-gray-500 text-center max-w-md mb-4">
                      This section allows you to create, edit, and manage all job postings.
                    </p>
                    <Button className="bg-launchpad-blue hover:bg-launchpad-teal text-white">
                      Manage Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="m-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <BarChart className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-500 text-center max-w-md mb-4">
                      View detailed analytics about job postings, applications, and hiring metrics.
                    </p>
                    <Button className="bg-launchpad-blue hover:bg-launchpad-teal text-white">
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* New Interview Scheduling Tab */}
            <TabsContent value="scheduling" className="m-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Interview Scheduling</CardTitle>
                      <CardDescription>Schedule and manage candidate interviews</CardDescription>
                    </div>
                    <Button className="gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white">
                      <Plus className="h-4 w-4" /> New Interview
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar View */}
                    <Card className="lg:col-span-2 p-4">
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="font-medium">April 2023</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Previous</Button>
                          <Button variant="outline" size="sm">Next</Button>
                        </div>
                      </div>
                      
                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {/* Day Headers */}
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center py-2 font-medium text-sm">
                            {day}
                          </div>
                        ))}
                        
                        {/* Calendar Days */}
                        {Array.from({ length: 30 }, (_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "border rounded-md h-28 p-1 overflow-hidden",
                              [5, 12, 18, 25].includes(i + 1) ? "bg-launchpad-blue/5" : ""
                            )}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{i + 1}</span>
                              {[5, 12, 18, 25].includes(i + 1) && (
                                <Badge className="bg-launchpad-blue/10 text-launchpad-blue text-xs">
                                  {i === 4 ? 3 : i === 11 ? 2 : 1} interviews
                                </Badge>
                              )}
                            </div>
                            {i === 4 && (
                              <div className="text-xs space-y-1">
                                <div className="bg-launchpad-blue/10 p-1 rounded truncate">9:00 AM - Jordan Lee</div>
                                <div className="bg-launchpad-green/10 p-1 rounded truncate">11:30 AM - Alex Chen</div>
                                <div className="bg-launchpad-orange/10 p-1 rounded truncate">2:00 PM - Taylor Smith</div>
                              </div>
                            )}
                            {i === 11 && (
                              <div className="text-xs space-y-1">
                                <div className="bg-launchpad-blue/10 p-1 rounded truncate">10:00 AM - Sam Williams</div>
                                <div className="bg-launchpad-green/10 p-1 rounded truncate">3:30 PM - Jamie Davis</div>
                              </div>
                            )}
                            {i === 17 && (
                              <div className="text-xs space-y-1">
                                <div className="bg-launchpad-orange/10 p-1 rounded truncate">1:00 PM - Riley Johnson</div>
                              </div>
                            )}
                            {i === 24 && (
                              <div className="text-xs space-y-1">
                                <div className="bg-launchpad-teal/10 p-1 rounded truncate">11:00 AM - Casey Morgan</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    {/* Upcoming Interviews */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border-l-4 border-launchpad-blue pl-3 py-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Jordan Lee</h4>
                            <span className="text-xs bg-launchpad-blue/10 text-launchpad-blue px-2 py-1 rounded">Today</span>
                          </div>
                          <p className="text-sm text-gray-500">Frontend Developer • Tech Innovators</p>
                          <p className="text-xs text-gray-400 mt-1">9:00 AM - 10:00 AM • Technical Interview</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" className="text-xs h-7">Reschedule</Button>
                            <Button size="sm" className="text-xs h-7 bg-launchpad-blue text-white hover:bg-launchpad-teal">Join Call</Button>
                          </div>
                        </div>
                        
                        <div className="border-l-4 border-launchpad-green pl-3 py-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Alex Chen</h4>
                            <span className="text-xs bg-launchpad-blue/10 text-launchpad-blue px-2 py-1 rounded">Today</span>
                          </div>
                          <p className="text-sm text-gray-500">Data Scientist • Analytics Co</p>
                          <p className="text-xs text-gray-400 mt-1">11:30 AM - 12:30 PM • Initial Interview</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" className="text-xs h-7">Reschedule</Button>
                            <Button size="sm" className="text-xs h-7 bg-launchpad-blue text-white hover:bg-launchpad-teal">Join Call</Button>
                          </div>
                        </div>
                        
                        <div className="border-l-4 border-launchpad-orange pl-3 py-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Taylor Smith</h4>
                            <span className="text-xs bg-launchpad-blue/10 text-launchpad-blue px-2 py-1 rounded">Today</span>
                          </div>
                          <p className="text-sm text-gray-500">Product Manager • SaaS Solutions</p>
                          <p className="text-xs text-gray-400 mt-1">2:00 PM - 3:00 PM • Final Interview</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" className="text-xs h-7">Reschedule</Button>
                            <Button size="sm" className="text-xs h-7 bg-launchpad-blue text-white hover:bg-launchpad-teal">Join Call</Button>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="w-full text-sm text-gray-500">
                          View All Interviews <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Web Scraping / Bulk Job Import Tab */}
            <TabsContent value="import" className="m-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Job Import Tools</CardTitle>
                      <CardDescription>Scrape job listings from external sites or upload in bulk</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Web Scraping Tool */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Web Scraping</CardTitle>
                        <CardDescription>Import jobs automatically from job boards and company websites</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-md p-4">
                            <h4 className="font-medium mb-2">Select Job Sources</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="indeed" className="rounded" defaultChecked />
                                <label htmlFor="indeed" className="text-sm">Indeed</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="linkedin" className="rounded" defaultChecked />
                                <label htmlFor="linkedin" className="text-sm">LinkedIn</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="monster" className="rounded" />
                                <label htmlFor="monster" className="text-sm">Monster</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="glassdoor" className="rounded" />
                                <label htmlFor="glassdoor" className="text-sm">Glassdoor</label>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Job Search Criteria</h4>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Job Title</label>
                                  <Input placeholder="e.g. Frontend Developer" defaultValue="Software Engineer" />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Location</label>
                                  <Input placeholder="e.g. New York, NY" defaultValue="Remote" />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Keywords</label>
                                <Input placeholder="e.g. React, TypeScript" defaultValue="JavaScript, React, Node.js" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <Button className="w-full bg-launchpad-blue hover:bg-launchpad-teal text-white">
                              Start Job Scraping
                            </Button>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              Preview scraped jobs before importing to your dashboard
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Bulk Upload Tool */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Bulk Upload</CardTitle>
                        <CardDescription>Import multiple job listings at once via CSV or Excel file</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <FileSpreadsheet className="h-10 w-10 text-gray-300 mb-2" />
                              <h4 className="font-medium mb-1">Drop your file here</h4>
                              <p className="text-sm text-gray-500 mb-4">
                                Supports CSV, Excel, or XML formats
                              </p>
                              <Button variant="outline" size="sm">
                                Browse Files
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Recent Uploads</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <FileSpreadsheet className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm">tech_jobs_batch.csv</span>
                                </div>
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Imported
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <FileSpreadsheet className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm">march_listings.xlsx</span>
                                </div>
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Imported
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <Button className="w-full bg-launchpad-blue hover:bg-launchpad-teal text-white">
                              Download Template
                            </Button>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              Use our template for easy job data formatting
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Stats Panel */}
                    <Card className="lg:col-span-2">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-500">Jobs Imported (Total)</p>
                            <p className="text-xl font-bold text-launchpad-blue">248</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-500">Last Import</p>
                            <p className="text-sm font-medium">3 days ago</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-500">Data Sources</p>
                            <p className="text-sm font-medium">4 connected</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-500">Auto-Update</p>
                            <p className="text-sm font-medium text-green-600">Enabled (Daily)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Stats Card Component
function StatCard({ title, value, icon, isLoading }: { title: string; value: number; icon: React.ReactNode; isLoading: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500">{title}</p>
              <h3 className="text-xl font-bold mt-1">{value}</h3>
            </div>
            <div className="p-2 rounded-md bg-gray-50">
              {icon}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Pipeline Progress Bar
function PipelineProgressBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-medium">{count}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

// Activity Icon
function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'application':
      return <div className="h-6 w-6 rounded-full bg-launchpad-blue/10 flex items-center justify-center">
        <FileSpreadsheet className="h-3 w-3 text-launchpad-blue" />
      </div>;
    case 'status_change':
      return <div className="h-6 w-6 rounded-full bg-launchpad-green/10 flex items-center justify-center">
        <ChevronRight className="h-3 w-3 text-launchpad-green" />
      </div>;
    case 'interview':
      return <div className="h-6 w-6 rounded-full bg-launchpad-teal/10 flex items-center justify-center">
        <Users className="h-3 w-3 text-launchpad-teal" />
      </div>;
    case 'offer':
      return <div className="h-6 w-6 rounded-full bg-launchpad-orange/10 flex items-center justify-center">
        <FileSpreadsheet className="h-3 w-3 text-launchpad-orange" />
      </div>;
    default:
      return <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
        <FileSpreadsheet className="h-3 w-3 text-gray-400" />
      </div>;
  }
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString();
}

