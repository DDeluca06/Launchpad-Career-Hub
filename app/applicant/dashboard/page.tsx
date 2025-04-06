"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
<<<<<<< HEAD
<<<<<<< HEAD
import { Button } from "@/components/ui/basic/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/form/input"
import { Search, Filter, Calendar, Briefcase, PlusCircle, TrendingUp, Flag, Users } from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { Badge } from "@/components/ui/basic/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { cn } from "@/lib/utils"
import { LaunchpadImage } from "@/components/launchpad-image"
=======
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { userService, applicationService, jobService, User, Job } from "@/lib/local-storage"
import { 
  BarChart2, Briefcase, Calendar, ChevronRight, 
  FileSpreadsheet, MapPin, Plus, UserCircle, Users,
  Building, CheckCircle, Clock, Star
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { extendedPalette } from "@/lib/colors"
import { Badge } from "@/components/ui/badge"
>>>>>>> ff472e9 (Draft 2 of Admin/Applicant Pages)
=======
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { userService, applicationService, jobService, User, Job } from "@/lib/local-storage"
import { 
  BarChart2, Briefcase, Calendar, ChevronRight, 
  FileSpreadsheet, MapPin, Plus, UserCircle, Users,
  Building, CheckCircle, Clock, Star
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { extendedPalette } from "@/lib/colors"
import { Badge } from "@/components/ui/badge"
>>>>>>> refs/remotes/origin/Bryan

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

export default function ApplicantDashboard() {
  const [stats, setStats] = useState<ApplicantDashboardStats>({
    totalApplications: 0,
    activeInterviews: 0,
    savedJobs: 0,
    completedAssessments: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (typeof window === 'undefined') return;
      
      setIsLoading(true);
      
      // In a real app, we would fetch user-specific data
      // For now, we'll simulate with mock data
      const applications = applicationService.getAll().slice(0, 5);
      const jobs = jobService.getAll();
      
      // Calculate dashboard stats
      const dashboardStats: ApplicantDashboardStats = {
        totalApplications: 8,
        activeInterviews: 2,
        savedJobs: 5,
        completedAssessments: 3
      };
      
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
      
      setStats(dashboardStats);
      setRecentActivity(mockActivity);
      setRecommendations(mockRecommendations);
      setUpcomingInterviews(mockInterviews);
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
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
            <Button className="gap-2 bg-launchpad-blue hover:bg-launchpad-teal text-white">
              <Plus className="h-4 w-4" />
              Save New Job
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Applications"
            value={stats.totalApplications}
            icon={<Briefcase className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Interviews"
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
            title="Assessments"
            value={stats.completedAssessments}
            icon={<CheckCircle className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />}
            isLoading={isLoading}
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
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Star className="h-5 w-5 text-launchpad-blue" />
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
                          <Badge className="bg-green-100 text-green-600">New</Badge>
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
                      <Badge className="bg-launchpad-lightBlue text-launchpad-blue">
                        {job.matchPercentage}% Match
                      </Badge>
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
        
        {/* Two Column Layout: Recent Activity and Upcoming Interviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>Your latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent>
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
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
          
          {/* Upcoming Interviews */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5 text-launchpad-green" />
                  Upcoming Interviews
                </CardTitle>
                <Link href="/applicant/calendar">
                  <Button variant="ghost" size="sm">View Calendar</Button>
                </Link>
              </div>
              <CardDescription>Your scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-600 mb-1">No interviews scheduled</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    You don't have any upcoming interviews. Keep applying to jobs to get interviews!
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
                          <Button size="sm">Prepare</Button>
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
  )
}

function StatCard({ title, value, icon, isLoading }: { title: string; value: number; icon: React.ReactNode; isLoading: boolean }) {
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
    <Card className="overflow-hidden">
      <div className="h-1 w-full" style={{ backgroundColor: color }}></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-lg font-bold" style={{ color }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
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

