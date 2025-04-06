"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { userService, applicationService, jobService, User, Job, partnerService } from "@/lib/local-storage"
import { 
  BarChart2, Briefcase, Building, Calendar, ChevronRight, 
  FileSpreadsheet, MapPin, Plus, UserCircle, Users
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { extendedPalette } from "@/lib/colors"

// Define interfaces for the dashboard data
interface DashboardStats {
  totalJobs: number;
  totalApplicants: number;
  totalApplications: number; 
  activeInterviews: number;
  offersSent: number;
  filledPositions: number;
  totalPartners: number;
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
    filledPositions: 0,
    totalPartners: 0
  });
  
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
      const partners = partnerService ? partnerService.getAll() : [];
      
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
        ).length,
        totalPartners: partners.length
      };
      
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Jobs"
            value={stats.totalJobs}
            icon={<Briefcase className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Applicants"
            value={stats.totalApplicants}
            icon={<Users className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Active Interviews"
            value={stats.activeInterviews}
            icon={<UserCircle className="h-5 w-5" style={{ color: extendedPalette.teal }} />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Offers Sent"
            value={stats.offersSent}
            icon={<FileSpreadsheet className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />}
            isLoading={isLoading}
          />
        </div>
        
        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Analytics Section */}
          <DashboardSection
            title="Analytics"
            description="View detailed metrics and reports"
            icon={<BarChart2 className="h-6 w-6" style={{ color: extendedPalette.primaryBlue }} />}
            href="/admin/analytics"
            stats={[
              { label: "Applications This Week", value: "34" },
              { label: "Placement Rate", value: "68%" },
              { label: "Avg Time to Hire", value: "18 days" }
            ]}
            color={extendedPalette.primaryBlue}
          />
          
          {/* Jobs Section */}
          <DashboardSection
            title="Job Management"
            description="Manage job listings and applications"
            icon={<Briefcase className="h-6 w-6" style={{ color: extendedPalette.primaryGreen }} />}
            href="/admin/jobs"
            stats={[
              { label: "Active Jobs", value: String(stats.totalJobs) },
              { label: "New Applications", value: "12" },
              { label: "Filled Positions", value: String(stats.filledPositions) }
            ]}
            color={extendedPalette.primaryGreen}
          />
          
          {/* Applicants Section */}
          <DashboardSection
            title="Applicant Tracking"
            description="Review and manage applications"
            icon={<Users className="h-6 w-6" style={{ color: extendedPalette.teal }} />}
            href="/admin/applicants"
            stats={[
              { label: "Total Applicants", value: String(stats.totalApplicants) },
              { label: "Interviewing", value: String(stats.activeInterviews) },
              { label: "New Today", value: "5" }
            ]}
            color={extendedPalette.teal}
          />
          
          {/* Partners Section */}
          <DashboardSection
            title="Partner Organizations"
            description="Manage employer partnerships"
            icon={<Building className="h-6 w-6" style={{ color: extendedPalette.brown }} />}
            href="/admin/partners"
            stats={[
              { label: "Total Partners", value: String(stats.totalPartners || 8) },
              { label: "Active Programs", value: "4" },
              { label: "Hiring Partners", value: "6" }
            ]}
            color={extendedPalette.brown}
          />
          
          {/* Calendar Section */}
          <DashboardSection
            title="Events Calendar"
            description="Schedule and manage events"
            icon={<Calendar className="h-6 w-6" style={{ color: extendedPalette.primaryOrange }} />}
            href="/admin/calendar"
            stats={[
              { label: "Upcoming Events", value: "7" },
              { label: "This Week", value: "3" },
              { label: "Interviews", value: "12" }
            ]}
            color={extendedPalette.primaryOrange}
          />
          
          {/* Settings Section */}
          <DashboardSection
            title="System Settings"
            description="Configure system preferences"
            icon={<UserCircle className="h-6 w-6" style={{ color: extendedPalette.darkGray }} />}
            href="/admin/settings"
            stats={[
              { label: "User Accounts", value: "18" },
              { label: "Admin Users", value: "4" },
              { label: "Last Update", value: "Today" }
            ]}
            color={extendedPalette.darkGray}
                  />
                </div>
          
          {/* Recent Activity */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
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
      icon = <FileSpreadsheet className="h-5 w-5" />;
      color = extendedPalette.primaryBlue;
      break;
    case 'status_change':
      icon = <ChevronRight className="h-5 w-5" />;
      color = extendedPalette.primaryGreen;
      break;
    case 'interview':
      icon = <UserCircle className="h-5 w-5" />;
      color = extendedPalette.teal;
      break;
    case 'offer':
      icon = <FileSpreadsheet className="h-5 w-5" />;
      color = extendedPalette.primaryOrange;
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

