"use client";

import { Suspense } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import {
  BarChart2,
  Briefcase,
  Building,
  Calendar,
  ChevronRight,
  FileSpreadsheet,
  UserCircle,
  Users,
} from "lucide-react";
import { extendedPalette } from "@/lib/colors";
import { useStats } from "@/hooks/use-stats";
import { useActivity } from "@/hooks/use-activity";

// Define Activity and User interfaces
interface User {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  type: "application" | "status_change" | "interview" | "offer";
  title: string;
  description: string;
  timestamp: string;
  user?: User;
}

/**
 * Renders a skeleton loading state for a statistic card.
 *
 * This component displays placeholder skeletons that mimic the layout of a fully rendered statistic card,
 * providing a visual indicator that data is being loaded.
 *
 * @returns A JSX element representing the loading state of a statistic card.
 */
function StatCardLoading() {
  return (
    <Card className="p-4 bg-card border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </Card>
  );
}

/**
 * Renders a responsive grid of loading skeleton cards for a dashboard section.
 *
 * This component displays four placeholder loading cards arranged in a grid layout,
 * providing visual feedback while the dashboard data is being fetched.
 */
function DashboardSectionLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <StatCardLoading key={i} />
        ))}
    </div>
  );
}

/**
 * Renders a loading skeleton for the recent activities section.
 *
 * Displays 5 placeholder rows that simulate an activity item with an avatar and text lines,
 * providing a visual cue while actual activity data is being fetched.
 */
function ActivityLoading() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
    </div>
  );
}

/**
 * Displays a grid of statistic cards for job and application metrics.
 *
 * Fetches data using the custom `useStats` hook and conditionally renders:
 * - A loading skeleton via `<DashboardSectionLoading />` while statistics are loading.
 * - An error message if data retrieval fails.
 * - A responsive grid of `<StatCard />` components showing "Total Jobs", "Total Applicants",
 *   "Active Interviews", and "Offers Sent" with appropriate icons and colors.
 */
function StatsOverview() {
  const { stats, loading, error } = useStats();

  if (loading) return <DashboardSectionLoading />;
  if (error) return <div>Error loading stats</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Jobs"
        value={stats.totalJobs}
        icon={
          <Briefcase
            className="h-5 w-5"
            style={{ color: extendedPalette.primaryBlue }}
          />
        }
      />
      <StatCard
        title="Total Applicants"
        value={stats.totalApplicants}
        icon={
          <Users
            className="h-5 w-5"
            style={{ color: extendedPalette.primaryGreen }}
          />
        }
      />
      <StatCard
        title="Active Interviews"
        value={stats.activeInterviews}
        icon={
          <UserCircle
            className="h-5 w-5"
            style={{ color: extendedPalette.teal }}
          />
        }
      />
      <StatCard
        title="Offers Sent"
        value={stats.offersSent}
        icon={
          <FileSpreadsheet
            className="h-5 w-5"
            style={{ color: extendedPalette.primaryOrange }}
          />
        }
      />
    </div>
  );
}

/**
 * Renders a card displaying a statistic with a title, numeric value, and an associated icon.
 *
 * This component presents a statistic in a visually appealing card layout. It accepts a descriptive title,
 * the statistic's numeric value, and an icon to provide visual context.
 *
 * @param title - The label for the statistic.
 * @param value - The numeric value of the statistic.
 * @param icon - A React element representing the statistic's icon.
 *
 * @example
 * <StatCard title="Total Jobs" value={42} icon={<JobIcon />} />
 */
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className="rounded-full p-3 bg-muted">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Renders a dashboard section card that summarizes key metrics.
 *
 * The card includes a colored top border, a header with an icon and title, a descriptive text,
 * a grid displaying various statistics, and a footer with a button linking to additional details.
 *
 * @param title - The section title displayed in the card header.
 * @param description - A brief description of the section's content.
 * @param icon - An icon or React node representing the section.
 * @param href - The URL or route path for the "View Details" link.
 * @param stats - An array of objects containing a label and value for each statistic.
 * @param color - The accent color used for the top border and statistic values.
 *
 * @returns The rendered dashboard section card element.
 */
function DashboardSection({
  title,
  description,
  icon,
  href,
  stats,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  stats: { label: string; value: string }[];
  color: string;
}) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200 bg-card">
      <div className="h-1 w-full" style={{ backgroundColor: color }}></div>
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
            {icon}
            {title}
          </CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold" style={{ color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={href} className="w-full">
          <Button
            variant="outline"
            className="w-full justify-between group-hover:border-opacity-50 group-hover:bg-muted"
          >
            View Details
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

/**
 * Renders a styled icon corresponding to an activity type.
 *
 * The component displays a circular container with a background color and an icon that represents
 * the provided activity type. Recognized types include 'application', 'status_change', 'interview', and 'offer'.
 * If an unrecognized type is provided, it defaults to the 'application' icon and color.
 *
 * @param type - A string that designates the activity type.
 * @returns A JSX element containing the appropriately styled icon.
 */
function ActivityIcon({ type }: { type: string }) {
  let icon;
  let color;

  switch (type) {
    case "application":
      icon = <FileSpreadsheet className="h-5 w-5" />;
      color = extendedPalette.primaryBlue;
      break;
    case "status_change":
      icon = <ChevronRight className="h-5 w-5" />;
      color = extendedPalette.primaryGreen;
      break;
    case "interview":
      icon = <UserCircle className="h-5 w-5" />;
      color = extendedPalette.teal;
      break;
    case "offer":
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
 * Formats a date string into a human-readable relative time description.
 *
 * This function calculates the elapsed time between the provided date and the current moment, returning:
 * - "just now" for differences under 60 seconds,
 * - a minute-based representation (e.g., "5m ago") for differences under 60 minutes,
 * - an hour-based representation (e.g., "2h ago") for differences under 24 hours,
 * - a day-based representation (e.g., "3d ago") for differences under 7 days, or
 * - a locale-specific date string for older dates.
 *
 * @param dateString - A valid date string.
 * @returns A human-readable string representing the relative time since the given date.
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
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
 * Renders the recent activity section for the admin dashboard.
 *
 * This component uses the `useActivity` hook to fetch and display a list of recent activities. During data fetching, it shows a loading skeleton via the `ActivityLoading` component, and displays an error message if the fetch fails.
 *
 * Each activity is rendered in a card that includes an icon denoting the activity type, the activity's title, description, and a formatted relative timestamp. If user information is available, the user's avatar is also displayed.
 */
function RecentActivitySection() {
  const { activities, loading, error } = useActivity();

  if (loading) return <ActivityLoading />;
  if (error)
    return <div className="text-destructive">Error loading activities</div>;

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
        <CardDescription className="text-muted-foreground">
          Latest updates from your hiring pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-muted">
                <ActivityIcon type={activity.type} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Renders the admin dashboard layout.
 *
 * This component provides an interface for administrators to monitor key metrics and activities.
 * It displays a header, a statistics overview, several dashboard sections detailing student progress,
 * internship opportunities, applications, partnerships, events, and mentor programs, as well as a recent activity feed.
 * Child components are loaded asynchronously using React's Suspense with appropriate skeleton loaders.
 */
export default function AdminDashboard() {
  return (
    <DashboardLayout isAdmin>
      <div className="container py-8 px-4 mx-auto space-y-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: extendedPalette.primaryBlue }}
          >
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Connecting Philadelphia high school students with tech opportunities
          </p>
        </div>

        {/* Stats Overview with Suspense */}
        <Suspense fallback={<DashboardSectionLoading />}>
          <StatsOverview />
        </Suspense>

        {/* Main Dashboard Sections with Suspense */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense
            fallback={
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <DashboardSectionLoading key={i} />
                ))}
              </>
            }
          >
            <DashboardSection
              title="Student Progress"
              description="Track student growth and achievements"
              icon={
                <BarChart2
                  className="h-6 w-6"
                  style={{ color: extendedPalette.primaryBlue }}
                />
              }
              href="/admin/analytics"
              stats={[
                { label: "Workshops Completed", value: "24" },
                { label: "Projects Submitted", value: "68" },
                { label: "Avg Progress", value: "78%" },
              ]}
              color={extendedPalette.primaryBlue}
            />

            <DashboardSection
              title="Internship Opportunities"
              description="Manage local tech internships for students"
              icon={
                <Briefcase
                  className="h-6 w-6"
                  style={{ color: extendedPalette.primaryGreen }}
                />
              }
              href="/admin/jobs"
              stats={[
                { label: "Active Positions", value: "15" },
                { label: "Applications", value: "42" },
                { label: "Placements", value: "8" },
              ]}
              color={extendedPalette.primaryGreen}
            />

            <DashboardSection
              title="Student Applications"
              description="Review and manage student applications"
              icon={
                <Users
                  className="h-6 w-6"
                  style={{ color: extendedPalette.teal }}
                />
              }
              href="/admin/applicants"
              stats={[
                { label: "Total Students", value: "156" },
                { label: "In Interview", value: "23" },
                { label: "New Today", value: "5" },
              ]}
              color={extendedPalette.teal}
            />

            <DashboardSection
              title="Partner Companies"
              description="Manage Philadelphia tech partnerships"
              icon={
                <Building
                  className="h-6 w-6"
                  style={{ color: extendedPalette.brown }}
                />
              }
              href="/admin/partners"
              stats={[
                { label: "Total Partners", value: "12" },
                { label: "Active Programs", value: "4" },
                { label: "Mentors", value: "18" },
              ]}
              color={extendedPalette.brown}
            />

            <DashboardSection
              title="Workshops & Events"
              description="Schedule tech workshops and career events"
              icon={
                <Calendar
                  className="h-6 w-6"
                  style={{ color: extendedPalette.primaryOrange }}
                />
              }
              href="/admin/calendar"
              stats={[
                { label: "Upcoming Events", value: "7" },
                { label: "This Week", value: "3" },
                { label: "Workshops", value: "12" },
              ]}
              color={extendedPalette.primaryOrange}
            />

            <DashboardSection
              title="Mentor Program"
              description="Connect students with industry mentors"
              icon={
                <UserCircle
                  className="h-6 w-6"
                  style={{ color: extendedPalette.darkGray }}
                />
              }
              href="/admin/settings"
              stats={[
                { label: "Active Mentors", value: "18" },
                { label: "Mentees", value: "54" },
                { label: "Sessions", value: "32" },
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
  );
}
