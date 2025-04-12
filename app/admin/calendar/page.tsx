"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/basic/button";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { extendedPalette } from "@/lib/colors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Skeleton } from "@/components/ui/feedback/skeleton";

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

export default function CalendarPage() {
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
  const handleCreateInterview = async (interview: ApiNewInterview) => {
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interview),
      });

      const data = await response.json();
      if (data.success) {
        loadInterviews();
      }
    } catch (error) {
      console.error("Failed to create interview:", error);
    }
  };

  // Handle interview update
  const handleUpdateInterview = async (interview: Partial<ApiInterview>) => {
    try {
      const response = await fetch("/api/interviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interview),
      });

      const data = await response.json();
      if (data.success) {
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
    <DashboardLayout isAdmin>
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
                      onEdit={(interview) => {
                        setEditInterview(interview);
                        setIsCreateModalOpen(true);
                      }}
                      onComplete={(interview) => handleStatusUpdate(interview, 'COMPLETED')}
                      onCancel={(interview) => handleStatusUpdate(interview, 'CANCELLED')}
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
              <CardHeader className="pb-2 border-b">
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Next 3 scheduled interviews</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="mb-4 last:mb-0">
                        <Skeleton className="h-5 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    ))
                ) : upcomingInterviews.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No upcoming interviews
                  </div>
                ) : (
                  upcomingInterviews.map((interview) => (
                    <div
                      key={interview.interview_id}
                      className="mb-4 last:mb-0 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedDate(new Date(interview.start_time));
                      }}
                    >
                      <div className="font-medium">
                        {interview.title || `${interview.candidate_name} - ${interview.position}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(interview.start_time), "MMM d")} ·{" "}
                        {format(new Date(interview.start_time), "h:mm a")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {interview.location}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Interviews */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-2 border-b">
                <CardTitle>Recent Interviews</CardTitle>
                <CardDescription>Last 3 completed interviews</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="mb-4 last:mb-0">
                        <Skeleton className="h-5 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    ))
                ) : recentInterviews.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No recent interviews
                  </div>
                ) : (
                  recentInterviews.map((interview) => (
                    <div
                      key={interview.interview_id}
                      className="mb-4 last:mb-0 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedDate(new Date(interview.start_time));
                      }}
                    >
                      <div className="font-medium">
                        {interview.title || `${interview.candidate_name} - ${interview.position}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(interview.start_time), "MMM d")} ·{" "}
                        {format(new Date(interview.start_time), "h:mm a")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {interview.location}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Interview Form Modal */}
      <InterviewFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={(data) => {
          if (editInterview) {
            // Convert component Interview type to API Interview type
            const apiData: Partial<ApiInterview> = {
              ...data,
              start_time: (data.start_time as Date).toISOString(),
              end_time: (data.end_time as Date).toISOString(),
              description: data.description || null,
            };
            handleUpdateInterview(apiData);
          } else {
            // Convert component NewInterview type to API NewInterview type
            const apiData: ApiNewInterview = {
              title: data.title as string,
              description: data.description || undefined,
              start_time: (data.start_time as Date).toISOString(),
              end_time: (data.end_time as Date).toISOString(),
              location: data.location as string,
              candidate_name: data.candidate_name as string,
              position: data.position as string,
            };
            handleCreateInterview(apiData);
          }
        }}
        selectedDate={selectedDate}
        editInterview={editInterview ? {
          ...editInterview,
          start_time: new Date(editInterview.start_time),
          end_time: new Date(editInterview.end_time),
          description: editInterview.description || "",
        } : undefined}
        users={users}
      />
    </DashboardLayout>
  );
}