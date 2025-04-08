"use client"

import { Suspense } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { Skeleton } from "@/components/ui/feedback/skeleton"
import { BarChart2, Briefcase, Building, Calendar, ChevronRight, 
  FileSpreadsheet, UserCircle, Users
} from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { useStats } from "@/hooks/use-stats"
import { useActivity } from "@/hooks/use-activity"

// Define Activity and User interfaces
interface User {
  id: string
  name: string
}

interface Activity {
  id: string
  type: 'application' | 'status_change' | 'interview' | 'offer'
  title: string
  description: string
  timestamp: string
  user?: User
}

/**
 * Displays a loading skeleton for a statistic card.
 *
 * This component renders a card containing placeholder elements for the title, value, and icon,
 * providing a visual cue that the statistic data is currently being loaded.
 */
function StatCardLoading() {
  return (
    <Card className="p-4 bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </Card>
  )
}

/**
 * Renders a responsive grid of StatCardLoading placeholders for dashboard sections.
 *
 * This component displays four loading skeleton cards arranged in a grid layout,
 * providing a visual indication that the dashboard content is being loaded.
 */
function DashboardSectionLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <StatCardLoading key={i} />
      ))}
    </div>
  )
}

/**
 * Renders loading skeletons for recent activity items.
 *
 * This component displays five skeleton placeholders that simulate the layout of an activity entry,
 * each with an icon and two text lines, to indicate that the activity data is still loading.
 */
function ActivityLoading() {
  return (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Renders a dashboard overview of statistics.
 *
 * This component fetches statistics using the `useStats` hook and conditionally displays:
 * - A loading skeleton via `DashboardSectionLoading` if data is being fetched.
 * - An error message if the fetch fails.
 * - A responsive grid of `StatCard` components with details such as total jobs,
 *   total applicants, active interviews, and offers sent once data is available.
 *
 * @returns A React element representing the statistics overview section.
 */
function StatsOverview() {
  const { stats, loading, error } = useStats()

  if (loading) return <DashboardSectionLoading />
  if (error) return <div>Error loading stats</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <StatCard 
        title="Total Jobs"
        value={stats.totalJobs}
        icon={<Briefcase className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />}
      />
      <StatCard 
        title="Total Applicants"
        value={stats.totalApplicants}
        icon={<Users className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />}
      />
      <StatCard 
        title="Active Interviews"
        value={stats.activeInterviews}
        icon={<UserCircle className="h-5 w-5" style={{ color: extendedPalette.teal }} />}
      />
      <StatCard 
        title="Offers Sent"
        value={stats.offersSent}
        icon={<FileSpreadsheet className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />}
      />
    </div>
  )
}

/**
 * Renders a card displaying a statistic with a title, numeric value, and icon.
 *
 * This component renders a styled card that presents a statistic. The card includes
 * a title, its corresponding numeric value, and an accompanying icon within a rounded container.
 *
 * @param title - The label for the statistic.
 * @param value - The numeric value to display.
 * @param icon - A React node that renders the icon associated with the statistic.
 */
function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="rounded-full p-3 bg-gray-50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Renders a dashboard section card featuring a header, statistics grid, and a footer with a navigation button.
 *
 * The card starts with an accent-colored top border defined by the provided color and includes:
 * - A header displaying the icon and title alongside a description.
 * - A content area that lays out each statistic (with label and value) in a grid, where each value is styled using the accent color.
 * - A footer containing a "View Details" button that navigates to the specified URL.
 *
 * @param title - The section title displayed in the header.
 * @param description - A short description of the section.
 * @param icon - An icon element representing the section.
 * @param href - The URL to navigate to when the "View Details" button is clicked.
 * @param stats - An array of statistics, each with a label and value.
 * @param color - The accent color used for the top border and statistic values.
 *
 * @returns The rendered dashboard section card.
 */
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
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200 bg-white">
      <div className="h-1 w-full" style={{ backgroundColor: color }}></div>
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-lg font-bold" style={{ color }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={href} className="w-full">
          <Button 
            variant="outline" 
            className="w-full justify-between group-hover:border-opacity-50 group-hover:bg-gray-50"
          >
            View Details
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

/**
 * Renders an activity icon with a colored background based on the activity type.
 *
 * Supported activity types determine the displayed icon and color:
 * - "application": Shows a FileSpreadsheet icon with a primary blue color.
 * - "status_change": Shows a ChevronRight icon with a primary green color.
 * - "interview": Shows a UserCircle icon with a teal color.
 * - "offer": Shows a FileSpreadsheet icon with a primary orange color.
 * Any other value defaults to the FileSpreadsheet icon with a primary blue color.
 *
 * @param type - The activity type that influences the icon and styling.
 *
 * @returns A JSX element containing the styled activity icon.
 */
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

/**
 * Converts a date string into a human-readable relative time.
 *
 * This function calculates the elapsed time from the provided date to the current time and returns:
 * - "just now" if less than 60 seconds have passed,
 * - "Xm ago" if less than 60 minutes have passed,
 * - "Xh ago" if less than 24 hours have passed,
 * - "Xd ago" if less than 7 days have passed,
 * - Otherwise, it returns the locale-specific date representation.
 *
 * @param dateString - The date string to format.
 * @returns A string representing the relative time from the given date to now.
 */
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

/**
 * Renders the Recent Activity section of the admin dashboard.
 *
 * This component retrieves recent activity data using the custom hook and displays each activity as a card.
 * While the data is loading, a loading skeleton is shown; if an error occurs, an error message is displayed.
 * Each activity card features an icon corresponding to the activity type, a title, a description, a relative timestamp,
 * and, if available, a user avatar.
 */
function RecentActivitySection() {
  const { activities, loading, error } = useActivity()

  if (loading) return <ActivityLoading />
  if (error) return <div>Error loading activities</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Button variant="outline" size="sm" className="text-sm">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      {activities.map((activity: Activity) => (
        <Card key={activity.id} className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <ActivityIcon type={activity.type} />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{activity.title}</h4>
                <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                <time className="text-xs text-gray-400">{formatRelativeTime(activity.timestamp)}</time>
              </div>
              {activity.user && (
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={`/avatars/${activity.user.id}.png`} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Renders the administrative dashboard page.
 *
 * This component composes the admin dashboard layout by displaying a header,
 * a statistics overview, various dashboard sections for metrics like student progress,
 * internship opportunities, applications, partner companies, workshops & events, and the mentor program,
 * as well as a recent activity feed. It uses React's Suspense component to provide loading skeletons
 * while data is being fetched.
 *
 * @returns The React element representing the admin dashboard.
 */
export default function AdminDashboard() {
  return (
    <DashboardLayout isAdmin>
      <div className="container py-8 px-4 mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: extendedPalette.primaryBlue }}>
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Connecting Philadelphia high school students with tech opportunities</p>
        </div>
        
        {/* Stats Overview with Suspense */}
        <Suspense fallback={<DashboardSectionLoading />}>
          <StatsOverview />
        </Suspense>
        
        {/* Main Dashboard Sections with Suspense */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => <DashboardSectionLoading key={i} />)}
            </>
          }>
            <DashboardSection
              title="Student Progress"
              description="Track student growth and achievements"
              icon={<BarChart2 className="h-6 w-6" style={{ color: extendedPalette.primaryBlue }} />}
              href="/admin/analytics"
              stats={[
                { label: "Workshops Completed", value: "24" },
                { label: "Projects Submitted", value: "68" },
                { label: "Avg Progress", value: "78%" }
              ]}
              color={extendedPalette.primaryBlue}
            />
            
            <DashboardSection
              title="Internship Opportunities"
              description="Manage local tech internships for students"
              icon={<Briefcase className="h-6 w-6" style={{ color: extendedPalette.primaryGreen }} />}
              href="/admin/jobs"
              stats={[
                { label: "Active Positions", value: "15" },
                { label: "Applications", value: "42" },
                { label: "Placements", value: "8" }
              ]}
              color={extendedPalette.primaryGreen}
            />
            
            <DashboardSection
              title="Student Applications"
              description="Review and manage student applications"
              icon={<Users className="h-6 w-6" style={{ color: extendedPalette.teal }} />}
              href="/admin/applicants"
              stats={[
                { label: "Total Students", value: "156" },
                { label: "In Interview", value: "23" },
                { label: "New Today", value: "5" }
              ]}
              color={extendedPalette.teal}
            />
            
            <DashboardSection
              title="Partner Companies"
              description="Manage Philadelphia tech partnerships"
              icon={<Building className="h-6 w-6" style={{ color: extendedPalette.brown }} />}
              href="/admin/partners"
              stats={[
                { label: "Total Partners", value: "12" },
                { label: "Active Programs", value: "4" },
                { label: "Mentors", value: "18" }
              ]}
              color={extendedPalette.brown}
            />
            
            <DashboardSection
              title="Workshops & Events"
              description="Schedule tech workshops and career events"
              icon={<Calendar className="h-6 w-6" style={{ color: extendedPalette.primaryOrange }} />}
              href="/admin/calendar"
              stats={[
                { label: "Upcoming Events", value: "7" },
                { label: "This Week", value: "3" },
                { label: "Workshops", value: "12" }
              ]}
              color={extendedPalette.primaryOrange}
            />
            
            <DashboardSection
              title="Mentor Program"
              description="Connect students with industry mentors"
              icon={<UserCircle className="h-6 w-6" style={{ color: extendedPalette.darkGray }} />}
              href="/admin/settings"
              stats={[
                { label: "Active Mentors", value: "18" },
                { label: "Mentees", value: "54" },
                { label: "Sessions", value: "32" }
              ]}
              color={extendedPalette.darkGray}
            />
          </Suspense>
        </div>
        
        {/* Recent Activity with Suspense */}
        <div>
          <Suspense fallback={<ActivityLoading />}>
            <RecentActivitySection />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}