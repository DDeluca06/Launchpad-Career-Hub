"use client";

import React, { useState, useEffect, FormEvent, useMemo } from "react";
import { format } from "date-fns";
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
import { Badge } from "@/components/ui/basic/badge";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import {
  EVENT_TYPES,
  EXAMPLE_EVENTS,
  generateCalendarDays,
  formatTime,
} from "./constants";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Label } from "@/components/ui/basic/label";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";

// Type for calendar day
type CalendarDay = {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: typeof EXAMPLE_EVENTS;
};

/**
 * Calendar page component specifically for tracking and scheduling interviews.
 */
export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState(EXAMPLE_EVENTS);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isCreateInterviewModalOpen, setIsCreateInterviewModalOpen] = useState(false);
  const [isAddInterviewModalOpen, setIsAddInterviewModalOpen] = useState(false);
  
  // New interview form state
  const [newInterview, setNewInterview] = useState({
    title: "",
    description: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    capacity: 1,
    candidate: "",
    position: "",
  });

  // Use useMemo to prevent recalculation on every render
  const filteredEvents = useMemo(() => 
    events.filter(event => event.type === EVENT_TYPES.INTERVIEW),
    [events]
  );

  // Get selected day's events (interviews only)
  const selectedDateEvents = useMemo(() => 
    selectedDate
      ? filteredEvents.filter((event) => {
          const eventDate = new Date(event.start);
          return (
            eventDate.getDate() === selectedDate.getDate() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getFullYear() === selectedDate.getFullYear()
          );
        })
      : [],
    [selectedDate, filteredEvents]
  );

  // Get upcoming interviews (next 3 interviews from today)
  const upcomingEvents = useMemo(() => 
    [...filteredEvents]
      .filter((event) => new Date(event.start) >= new Date())
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 3),
    [filteredEvents]
  );

  // Get recent interviews (past 3 interviews)
  const recentEvents = useMemo(() => 
    [...filteredEvents]
      .filter((event) => new Date(event.start) < new Date())
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
      .slice(0, 3),
    [filteredEvents]
  );

  // Initialize and load data
  useEffect(() => {
    // Simulate API/database loading
    setTimeout(() => {
      setEvents(EXAMPLE_EVENTS.filter(event => event.type === EVENT_TYPES.INTERVIEW));
      setIsLoading(false);
    }, 800);
  }, []);

  // Generate calendar days
  useEffect(() => {
    const days = generateCalendarDays(currentDate);

    // Create a new array with proper type for events
    const daysWithEvents = days.map((day) => ({
      ...day,
      events: [] as typeof EXAMPLE_EVENTS,
    }));

    // Add events to calendar days (interviews only)
    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.start);
      const eventDay = daysWithEvents.find(
        (day) =>
          day.date.getDate() === eventDate.getDate() &&
          day.date.getMonth() === eventDate.getMonth() &&
          day.date.getFullYear() === eventDate.getFullYear(),
      );

      if (eventDay) {
        eventDay.events = [...eventDay.events, event];
      }
    });

    setCalendarDays(daysWithEvents);
  }, [currentDate, filteredEvents]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Function to determine badge color based on event type
  const getEventBadgeColor = (eventType: EVENT_TYPES) => {
    switch (eventType) {
      case EVENT_TYPES.INTERVIEW:
        return "bg-blue-100 text-blue-700";
      case EVENT_TYPES.WORKSHOP:
        return "bg-green-100 text-green-700";
      case EVENT_TYPES.CAREER_FAIR:
        return "bg-purple-100 text-purple-700";
      case EVENT_TYPES.CAMPUS_EVENT:
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Function to render event card
  const renderEventCard = (event: (typeof EXAMPLE_EVENTS)[number]) => {
    const startTime = formatTime(new Date(event.start));
    const endTime = formatTime(new Date(event.end));

    return (
      <Card
        key={event.id}
        className="mb-4 border-0 shadow-sm hover:shadow transition-shadow"
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge className={cn(getEventBadgeColor(event.type))}>
              {event.type.toString().replace("_", " ")}
            </Badge>
          </div>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {event.attendees} / {event.capacity} Attendees
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Event addition handlers
  const handleAddInterview = (e: FormEvent) => {
    e.preventDefault();
    
    // Create the interview object
    const startDateTime = new Date(`${newInterview.date}T${newInterview.startTime}`);
    const endDateTime = new Date(`${newInterview.date}T${newInterview.endTime}`);
    
    const interviewTitle = newInterview.title || 
      `Interview: ${newInterview.candidate} - ${newInterview.position}`;
    
    const newInterviewObject = {
      id: Math.random().toString(36).substring(2, 9),
      title: interviewTitle,
      description: newInterview.description,
      type: EVENT_TYPES.INTERVIEW,
      location: newInterview.location,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      capacity: newInterview.capacity,
      attendees: 0,
    };
    
    // Add the interview
    setEvents([...events, newInterviewObject]);
    
    // Close the modal
    setIsCreateInterviewModalOpen(false);
    setIsAddInterviewModalOpen(false);
    
    // Reset the form
    resetInterviewForm();
  };
  
  // Reset form function
  const resetInterviewForm = () => {
    setNewInterview({
      title: "",
      description: "",
      location: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
      capacity: 1,
      candidate: "",
      position: "",
    });
  };
  
  // Open add interview modal with the selected date
  const openAddInterviewForDay = () => {
    setNewInterview({
      ...newInterview,
      date: format(selectedDate, "yyyy-MM-dd"),
    });
    setIsAddInterviewModalOpen(true);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="flex flex-col space-y-4 p-6 pb-24">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Interview Calendar</h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              className="bg-launchpad-blue hover:bg-launchpad-teal text-white"
              onClick={() => setIsCreateInterviewModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Schedule Interview
            </Button>
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 h-full">
          {/* Calendar Section */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Month and Year */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-xl">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {/* Days of Week */}
                <div className="grid grid-cols-7 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center py-2 text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    // Count interviews for this day
                    const dayEvents = filteredEvents.filter((event) => {
                      const eventDate = new Date(event.start);
                      return (
                        eventDate.getDate() === day.date.getDate() &&
                        eventDate.getMonth() === day.date.getMonth() &&
                        eventDate.getFullYear() === day.date.getFullYear()
                      );
                    });

                    const isSelected =
                      day.date.getDate() === selectedDate.getDate() &&
                      day.date.getMonth() === selectedDate.getMonth() &&
                      day.date.getFullYear() === selectedDate.getFullYear();

                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[80px] p-1 relative hover:bg-gray-50 transition-colors",
                          !day.isCurrentMonth && "opacity-40",
                          isSelected &&
                            "ring-2 ring-blue-400 bg-blue-50 rounded-md",
                          day.isToday &&
                            !isSelected &&
                            "border border-blue-400 rounded-md",
                        )}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div
                          className={cn(
                            "text-center mb-2 font-medium text-sm",
                            day.isToday && "text-blue-600",
                            isSelected && "text-blue-700",
                          )}
                        >
                          {day.dayOfMonth}
                        </div>
                        {dayEvents.length > 0 && (
                          <div className="flex justify-center">
                            <div className="px-1.5 py-0.5 text-xs rounded-full bg-blue-500 text-white text-center">
                              {dayEvents.length}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Day Interviews */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    Interviews for {format(selectedDate, "MMMM d, yyyy")}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateEvents.length === 0
                      ? "No interviews scheduled for this day"
                      : `${selectedDateEvents.length} interview${selectedDateEvents.length !== 1 ? "s" : ""} scheduled`}
                  </CardDescription>
                </div>
                <Button size="sm" onClick={openAddInterviewForDay}>
                  <Plus className="h-4 w-4 mr-1" /> Add Interview
                </Button>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[400px] p-4">
                {isLoading ? (
                  // Loading skeletons
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
                            <Skeleton className="h-4 w-1/3" />
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                          <Skeleton className="h-9 w-full" />
                        </CardFooter>
                      </Card>
                    ))
                ) : selectedDateEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">No interviews scheduled</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      There are no interviews scheduled for this day.
                    </p>
                    <Button className="mt-4" onClick={openAddInterviewForDay}>
                      <Plus className="h-4 w-4 mr-1" /> Add Interview
                    </Button>
                  </div>
                ) : (
                  selectedDateEvents.map((event) => renderEventCard(event))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Upcoming and Recent Interviews */}
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
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No upcoming interviews
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="mb-4 last:mb-0 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors"
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(event.start), "MMM d")} ·{" "}
                        {formatTime(new Date(event.start))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.location}
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
                <CardDescription>Last 3 interviews</CardDescription>
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
                ) : recentEvents.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No recent interviews
                  </div>
                ) : (
                  recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="mb-4 last:mb-0 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors"
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(event.start), "MMM d")} ·{" "}
                        {formatTime(new Date(event.start))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.location}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-2 border-b">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2 p-4">
                <Button className="w-full justify-start" onClick={() => setIsCreateInterviewModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Schedule Interview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" /> View All Interviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <MultiPurposeModal
        open={isCreateInterviewModalOpen}
        onOpenChange={setIsCreateInterviewModalOpen}
        title="Schedule New Interview"
        size="md"
        showFooter={true}
        primaryActionText="Schedule Interview"
        onPrimaryAction={() => handleAddInterview(new Event('submit') as unknown as FormEvent)}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsCreateInterviewModalOpen(false)}
      >
        <div className="py-4">
          <form onSubmit={handleAddInterview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interview-candidate">Candidate Name</Label>
                <Input
                  id="interview-candidate"
                  value={newInterview.candidate}
                  onChange={(e) => setNewInterview({ ...newInterview, candidate: e.target.value })}
                  placeholder="Enter candidate name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="interview-position">Position</Label>
                <Input
                  id="interview-position"
                  value={newInterview.position}
                  onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                  placeholder="Enter position title"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="interview-title">Interview Title (Optional)</Label>
              <Input
                id="interview-title"
                value={newInterview.title}
                onChange={(e) => setNewInterview({ ...newInterview, title: e.target.value })}
                placeholder="Leave blank to auto-generate from candidate and position"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="interview-date">Date</Label>
                <Input
                  id="interview-date"
                  type="date"
                  value={newInterview.date}
                  onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="interview-start-time">Start Time</Label>
                <Input
                  id="interview-start-time"
                  type="time"
                  value={newInterview.startTime}
                  onChange={(e) => setNewInterview({ ...newInterview, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="interview-end-time">End Time</Label>
                <Input
                  id="interview-end-time"
                  type="time"
                  value={newInterview.endTime}
                  onChange={(e) => setNewInterview({ ...newInterview, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="interview-location">Location</Label>
              <Input
                id="interview-location"
                value={newInterview.location}
                onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                placeholder="Virtual / Office Location / Room Number"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="interview-description">Notes</Label>
              <Textarea
                id="interview-description"
                value={newInterview.description}
                onChange={(e) => setNewInterview({ ...newInterview, description: e.target.value })}
                placeholder="Interview details, preparation notes, questions to ask..."
                className="min-h-[100px]"
              />
            </div>
          </form>
        </div>
      </MultiPurposeModal>

      {/* Add Interview Modal - same as Create but with pre-selected date */}
      <MultiPurposeModal
        open={isAddInterviewModalOpen}
        onOpenChange={setIsAddInterviewModalOpen}
        title={`Add Interview for ${format(selectedDate, "MMMM d, yyyy")}`}
        size="md"
        showFooter={true}
        primaryActionText="Add Interview"
        onPrimaryAction={() => handleAddInterview(new Event('submit') as unknown as FormEvent)}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setIsAddInterviewModalOpen(false)}
      >
        <div className="py-4">
          <form onSubmit={handleAddInterview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-interview-candidate">Candidate Name</Label>
                <Input
                  id="add-interview-candidate"
                  value={newInterview.candidate}
                  onChange={(e) => setNewInterview({ ...newInterview, candidate: e.target.value })}
                  placeholder="Enter candidate name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-interview-position">Position</Label>
                <Input
                  id="add-interview-position"
                  value={newInterview.position}
                  onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                  placeholder="Enter position title"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-interview-title">Interview Title (Optional)</Label>
              <Input
                id="add-interview-title"
                value={newInterview.title}
                onChange={(e) => setNewInterview({ ...newInterview, title: e.target.value })}
                placeholder="Leave blank to auto-generate from candidate and position"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-interview-start-time">Start Time</Label>
                <Input
                  id="add-interview-start-time"
                  type="time"
                  value={newInterview.startTime}
                  onChange={(e) => setNewInterview({ ...newInterview, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-interview-end-time">End Time</Label>
                <Input
                  id="add-interview-end-time"
                  type="time"
                  value={newInterview.endTime}
                  onChange={(e) => setNewInterview({ ...newInterview, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-interview-location">Location</Label>
              <Input
                id="add-interview-location"
                value={newInterview.location}
                onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                placeholder="Virtual / Office Location / Room Number"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="add-interview-description">Notes</Label>
              <Textarea
                id="add-interview-description"
                value={newInterview.description}
                onChange={(e) => setNewInterview({ ...newInterview, description: e.target.value })}
                placeholder="Interview details, preparation notes, questions to ask..."
                className="min-h-[100px]"
              />
            </div>
          </form>
        </div>
      </MultiPurposeModal>
    </DashboardLayout>
  );
}
