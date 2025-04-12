"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/basic/button";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { extendedPalette } from "@/lib/colors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Import our custom components
import { CalendarGrid } from "@/components/Admin/Calendar/CalendarGrid";
import { InterviewCard } from "@/components/Admin/Calendar/InterviewCard";
import { InterviewFormModal } from "@/components/Admin/Calendar/InterviewFormModal";
import { generateCalendarDays } from "@/components/Admin/Calendar/utils";
import { Interview as ApiInterview, NewInterview as ApiNewInterview } from "@/components/Admin/Calendar/types";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
}

function CalendarContent() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [interviews, setInterviews] = useState<ApiInterview[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editInterview, setEditInterview] = useState<ApiInterview | undefined>();

  // Calculate calendar days with interviews
  const calendarDays = generateCalendarDays(currentDate, interviews);

  // Get selected day's interviews
  const selectedDateInterviews = interviews.filter((interview) => {
    const interviewDate = new Date(interview.start_time);
    return (
      interviewDate.getDate() === selectedDate.getDate() &&
      interviewDate.getMonth() === selectedDate.getMonth() &&
      interviewDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Get upcoming interviews (next 3 scheduled interviews)
  const upcomingInterviews = interviews
    .filter((interview) => new Date(interview.start_time) >= new Date() && interview.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3);

  // Get recent interviews (last 3 completed interviews)
  const recentInterviews = interviews
    .filter((interview) => interview.status === 'COMPLETED')
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
    .slice(0, 3);

  // Load interviews for the current month
  const loadInterviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await fetch(
        `/api/interviews?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();

      if (data.success) {
        setInterviews(data.data);
        if (data.users) {
          setUsers(data.users);
        }
      }
    } catch (error) {
      console.error("Failed to load interviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate]);

  // Load interviews when the month changes
  useEffect(() => {
    loadInterviews();
  }, [currentDate, loadInterviews]);

  // Handle interview creation
  const handleCreateInterview = async (data: ApiNewInterview | Partial<ApiInterview>) => {
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        loadInterviews();
      }
    } catch (error) {
      console.error("Failed to create interview:", error);
    }
  };

  // Handle interview update
  const handleUpdateInterview = async (data: ApiNewInterview | Partial<ApiInterview>) => {
    try {
      const response = await fetch("/api/interviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        loadInterviews();
      }
    } catch (error) {
      console.error("Failed to update interview:", error);
    }
  };

  // Handle interview status update
  const handleStatusUpdate = async (interview: ApiInterview, status: string) => {
    try {
      const response = await fetch("/api/interviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interview_id: interview.interview_id, status }),
      });

      const data = await response.json();
      if (data.success) {
        loadInterviews();
      }
    } catch (error) {
      console.error("Failed to update interview status:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-6 pb-24">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6" style={{ color: extendedPalette.primaryBlue }} />
          <h1 className="text-2xl font-bold" style={{ color: extendedPalette.primaryBlue }}>
            Interview Calendar
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button
            className="text-white"
            style={{ backgroundColor: extendedPalette.primaryBlue }}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Schedule Interview
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const prevMonth = new Date(currentDate);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            setCurrentDate(prevMonth);
          }}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            setCurrentDate(new Date());
            setSelectedDate(new Date());
          }}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setCurrentDate(nextMonth);
          }}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 h-full">
        {/* Calendar Section */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Calendar Grid */}
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            calendarDays={calendarDays}
            onDateSelect={setSelectedDate}
          />

          {/* Selected Day Interviews */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  Interviews for {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
                <CardDescription>
                  {selectedDateInterviews.length === 0
                    ? "No interviews scheduled for this day"
                    : `${selectedDateInterviews.length} interview${selectedDateInterviews.length !== 1 ? "s" : ""} scheduled`}
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                onClick={() => setIsCreateModalOpen(true)}
                style={{ backgroundColor: extendedPalette.primaryBlue }}
                className="text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Interview
              </Button>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[400px] p-4">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="mb-4 border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : selectedDateInterviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No interviews scheduled</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    There are no interviews scheduled for this day.
                  </p>
                  <Button 
                    className="mt-4 text-white"
                    style={{ backgroundColor: extendedPalette.primaryBlue }}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Interview
                  </Button>
                </div>
              ) : (
                selectedDateInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.interview_id}
                    interview={interview}
                    onEdit={setEditInterview}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Interviews */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Next 3 scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <InterviewCard
                  key={interview.interview_id}
                  interview={interview}
                  onEdit={setEditInterview}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
              {upcomingInterviews.length === 0 && (
                <p className="text-sm text-gray-500">No upcoming interviews</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Interviews */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Last 3 completed interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentInterviews.map((interview) => (
                <InterviewCard
                  key={interview.interview_id}
                  interview={interview}
                  onEdit={setEditInterview}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
              {recentInterviews.length === 0 && (
                <p className="text-sm text-gray-500">No recent interviews</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interview Form Modal */}
      <InterviewFormModal
        open={isCreateModalOpen || !!editInterview}
        onOpenChange={() => {
          setIsCreateModalOpen(false);
          setEditInterview(undefined);
        }}
        onSubmit={editInterview ? handleUpdateInterview : handleCreateInterview}
        selectedDate={selectedDate}
        editInterview={editInterview}
        users={users}
      />
    </div>
  );
}

export default function CalendarPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    }
  });
  const router = useRouter();

  if (status === "loading") {
    return (
      <DashboardLayout isAdmin>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout isAdmin>
      <CalendarContent />
    </DashboardLayout>
  );
}