"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { KanbanPage } from "@/components/kanban";
import { Button } from "@/components/ui/basic/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar";
import { Badge } from "@/components/ui/basic/badge";
import { extendedPalette } from "@/lib/colors";
import {
  Briefcase,
  Building2,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  Users,
  FileCheck,
  CheckSquare,
  Send,
  Save
} from "lucide-react";
import { applicationService, Job } from "@/lib/local-storage";

// Define interfaces for the dashboard data
interface ApplicantDashboardStats {
  totalApplications: number;
  activeInterviews: number;
  savedJobs: number;
  completedAssessments: number;
}

interface RecentActivity {
  id: number;
  type: 'application' | 'status_change' | 'interview' | 'offer' | 'interested';
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
  const [isLoading, setIsLoading] = useState(true);

  // Job statistics for analytics and future dashboard enhancements
  const [jobStats, setJobStats] = useState({
    total: 0,
    applied: 0,
    interested: 0,
    rejected: 0,
  });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Load applications from local storage
        const applications = applicationService.getAll();

        // Update stats
        setStats({
          totalApplications: applications.length,
          activeInterviews: applications.filter((app) => app.status === 'interview').length,
          savedJobs: applications.filter((app) => app.status === 'saved').length,
          completedAssessments: Math.floor(Math.random() * 10),
        });

        // Job stats
        setJobStats({
          total: applications.length,
          applied: applications.filter((app) => app.status === 'applied').length,
          interested: applications.filter((app) => app.status === 'saved').length,
          rejected: applications.filter((app) => app.status === 'rejected').length,
        });

        // Generate recent activity
        const activity = generateRecentActivity();
        setRecentActivity(activity);

        // Generate recommendations
        const recommendations = generateJobRecommendations();
        setRecommendations(recommendations);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Generate recent activity based on applications
  const generateRecentActivity = (): RecentActivity[] => {
    const activity: RecentActivity[] = [];

    // Add some sample activities
    activity.push({
      id: 1,
      type: 'application',
      title: 'Applied to Software Engineer position',
      description: 'You submitted your application to Google',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    });

    activity.push({
      id: 2,
      type: 'status_change',
      title: 'Application status changed',
      description: 'Your application at Amazon moved to Interview stage',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    });

    activity.push({
      id: 3,
      type: 'interview',
      title: 'Interview scheduled',
      description: 'Technical interview with Microsoft on April 15, 2025',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    });

    activity.push({
      id: 4,
      type: 'offer',
      title: 'Received job offer',
      description: 'You received an offer from Netflix for Senior Developer role',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    });

    activity.push({
      id: 5,
      type: 'interested',
      title: 'Marked a job as interested',
      description: 'You marked Product Manager position at Facebook as interested',
      timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    });

    return activity;
  };

  // Generate job recommendations
  const generateJobRecommendations = (): JobRecommendation[] => {
    const recommendations: JobRecommendation[] = [];

    // Add some sample recommendations
    recommendations.push({
      id: 1,
      title: "Senior Frontend Developer",
      company: "Google",
      location: "Mountain View, CA",
      matchPercentage: 95,
      isNew: true,
    });

    recommendations.push({
      id: 2,
      title: "Full Stack Engineer",
      company: "Microsoft",
      location: "Redmond, WA",
      matchPercentage: 88,
      isNew: true,
    });

    recommendations.push({
      id: 3,
      title: "React Developer",
      company: "Facebook",
      location: "Menlo Park, CA",
      matchPercentage: 82,
      isNew: false,
    });

    recommendations.push({
      id: 4,
      title: "Software Engineer",
      company: "Amazon",
      location: "Seattle, WA",
      matchPercentage: 78,
      isNew: false,
    });

    return recommendations;
  };

  // Helper function to format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  };

  // Activity icon component based on activity type
  function ActivityIcon({ type }: { type: 'application' | 'status_change' | 'interview' | 'offer' | 'interested' }) {
    const iconClass = "h-5 w-5";

    switch (type) {
      case 'application':
        return <Send className={`${iconClass} text-blue-500`} />;
      case 'status_change':
        return <CheckSquare className={`${iconClass} text-purple-500`} />;
      case 'interview':
        return <MessageSquare className={`${iconClass} text-amber-500`} />;
      case 'offer':
        return <FileCheck className={`${iconClass} text-green-500`} />;
      case 'interested':
        return <Save className={`${iconClass} text-gray-500`} />;
      default:
        return <Clock className={`${iconClass} text-gray-500`} />;
    }
  }

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto pb-24">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex space-x-2">
              <Button variant="outline" className="hidden md:flex">
                <Star className="mr-2 h-4 w-4" />
                Interested Jobs
              </Button>
              <Button>
                Find Jobs
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">



        </div>

        {/* Kanban Task Board */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>

            </div>
          </div>
          <KanbanPage />
        </div>

        {/* Two Column Layout: Recent Activity and Job Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <Card className="border border-gray-200 shadow-sm h-full">
            <CardHeader className="pb-2 border-b bg-gray-50">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>Your latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent className="p-4 overflow-auto max-h-[400px]">
              <ul className="space-y-4">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="mt-0.5 bg-gray-100 p-1.5 rounded-full">
                      <ActivityIcon type={activity.type} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-4 py-2">
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>

          {/* Job Recommendations */}
          <Card className="border border-gray-200 shadow-sm h-full">
            <CardHeader className="pb-2 border-b bg-gray-50">
              <CardTitle className="text-lg font-medium">Recommended Jobs</CardTitle>
              <CardDescription>Based on your profile and preferences</CardDescription>
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
                        <Building2 className="h-3.5 w-3.5 mr-1" />
                        {job.company}
                        <span className="mx-1.5">•</span>
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {job.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{job.matchPercentage}% match</div>
                      <Button variant="outline" size="sm" className="mt-2">View Job</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button variant="outline" className="w-full">
                View All Recommendations
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </DashboardLayout>
  );
}

// Stats Card Component
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
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="mt-1 flex items-baseline">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold">{value}</h3>
                  {suffix && <span className="ml-1 text-sm text-gray-500">{suffix}</span>}
                </>
              )}
            </div>
            {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
