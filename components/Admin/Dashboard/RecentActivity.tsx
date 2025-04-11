import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Avatar, AvatarFallback } from "@/components/ui/basic/avatar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ActivityIcon } from "./ActivityIcon";
import { formatRelativeTime } from "./utils";
import { useActivity } from "@/hooks/use-activity";

/**
 * Renders the Recent Activity section for the admin dashboard.
 *
 * This component displays a card with a list of recent user activities across the platform.
 * It fetches data using the useActivity hook and handles loading and error states.
 * Each activity includes an icon, title, description, timestamp, and user information.
 * 
 * @returns A React component displaying the recent activity card
 */
export function RecentActivity() {
  const { activities, loading: activitiesLoading } = useActivity();

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        <CardDescription>Latest actions across the platform</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-4">
          {activitiesLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-none">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                  {activity.user && (
                    <div className="flex items-center mt-1">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{activity.user.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Link href="/admin/activities" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          View all activity
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
} 