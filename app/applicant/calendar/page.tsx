"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Badge } from "@/components/ui/basic/badge"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Plus, Users, Briefcase, Building, Bell, Building2, FileText } from "lucide-react"
import { EVENT_TYPES, SAMPLE_EVENTS, generateCalendarDays, formatTime, CalendarEvent } from "./constants"
import { Skeleton } from "@/components/ui/feedback/skeleton"
import { extendedPalette } from "@/lib/colors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"

// Type for calendar day
type CalendarDay = {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export default function ApplicantCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month')
  
  // Get selected day's events
  const selectedDateEvents = selectedDate 
    ? events.filter(event => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        )
      }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    : []
  
  // Initialize and load data
  useEffect(() => {
    // Simulate API/database loading
    setTimeout(() => {
      setEvents(SAMPLE_EVENTS)
      setIsLoading(false)
    }, 800)
  }, [])
  
  // Generate calendar days
  useEffect(() => {
    const days = generateCalendarDays(currentDate)
    
    // Create a new array with proper type for events
    const daysWithEvents = days.map(day => ({
      ...day,
      events: [] as CalendarEvent[]
    }))
    
    // Add events to calendar days
    events.forEach(event => {
      const eventDate = new Date(event.date)
      const eventDay = daysWithEvents.find(day => 
        day.date.getDate() === eventDate.getDate() &&
        day.date.getMonth() === eventDate.getMonth() &&
        day.date.getFullYear() === eventDate.getFullYear()
      )
      
      if (eventDay) {
        eventDay.events = [...eventDay.events, event]
      }
    })
    
    setCalendarDays(daysWithEvents)
  }, [currentDate, events])
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentDate(prevMonth)
  }
  
  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentDate(nextMonth)
  }
  
  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }
  
  // Get upcoming events (next 3 events from today)
  const upcomingEvents = [...events]
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
    
  // Events by type
  const interviewEvents = events.filter(e => e.type === EVENT_TYPES.INTERVIEW)
  const applicationEvents = events.filter(e => e.type === EVENT_TYPES.APPLICATION)
  const workshopEvents = events.filter(e => e.type === EVENT_TYPES.EVENT)
  const reminderEvents = events.filter(e => e.type === EVENT_TYPES.REMINDER)

  // Function to determine badge color based on event type
  const getEventBadgeColor = (eventType: EVENT_TYPES) => {
    switch(eventType) {
      case EVENT_TYPES.INTERVIEW:
        return "bg-green-100 text-green-700"
      case EVENT_TYPES.APPLICATION:
        return "bg-blue-100 text-blue-700"
      case EVENT_TYPES.EVENT:
        return "bg-orange-100 text-orange-700"
      case EVENT_TYPES.REMINDER:
        return "bg-teal-100 text-teal-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }
  
  // Function to get color for event type (from color palette)
  const getEventColor = (type: EVENT_TYPES) => {
    switch(type) {
      case EVENT_TYPES.INTERVIEW:
        return extendedPalette.primaryGreen
      case EVENT_TYPES.APPLICATION:
        return extendedPalette.primaryBlue
      case EVENT_TYPES.EVENT:
        return extendedPalette.primaryOrange
      case EVENT_TYPES.REMINDER:
        return extendedPalette.teal
      default:
        return extendedPalette.darkGray
    }
  }

  // Function to render event card
  const renderEventCard = (event: CalendarEvent) => {
    return (
      <Card key={event.id} className="mb-4 border-0 shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base">{event.title}</CardTitle>
            <Badge className={cn(getEventBadgeColor(event.type))}>
              {event.type.toString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {event.allDay 
                  ? "All day" 
                  : `${event.time || formatTime(event.start)}${event.endTime ? ` - ${event.endTime}` : ''}`
                }
              </span>
            </div>
            {event.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{event.location}</span>
              </div>
            )}
            {event.company && (
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  {event.company}
                  {event.jobTitle && ` • ${event.jobTitle}`}
                </span>
              </div>
            )}
            {event.type === EVENT_TYPES.INTERVIEW && (
              <div className="flex items-center mb-2">
                <Building2 className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm">{event.company}</span>
              </div>
            )}
            {event.type === EVENT_TYPES.APPLICATION && (
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm">Application due for {event.company}</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description || "Don&apos;t forget about this important event!"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4 p-6 pb-24">
        {/* Calendar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-gray-700" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Career Calendar</h1>
              <p className="text-gray-500 text-sm">
                Track your interviews, application deadlines, and career events
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'month' | 'agenda')}
              className="bg-gray-100 rounded-md p-1"
            >
              <TabsList className="grid grid-cols-2 h-8">
                <TabsTrigger value="month" className="text-xs h-6 data-[state=active]:text-gray-900">
                  Month
                </TabsTrigger>
                <TabsTrigger value="agenda" className="text-xs h-6 data-[state=active]:text-gray-900">
                  Agenda
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex space-x-2">
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
            
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'month' | 'agenda')}>
          <TabsContent value="month">
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
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => {
                        const isSelected = day.date.getDate() === selectedDate.getDate() &&
                          day.date.getMonth() === selectedDate.getMonth() &&
                          day.date.getFullYear() === selectedDate.getFullYear();

                        return (
                          <div
                            key={index}
                            className={cn(
                              "min-h-[80px] p-1 relative hover:bg-gray-50 transition-colors cursor-pointer",
                              !day.isCurrentMonth && "opacity-40",
                              isSelected && "ring-2 ring-blue-400 bg-blue-50 rounded-md",
                              day.isToday && !isSelected && "border border-blue-400 rounded-md",
                            )}
                            onClick={() => setSelectedDate(day.date)}
                          >
                            <div className={cn(
                              "text-center mb-1 font-medium text-sm",
                              day.isToday && "text-blue-600",
                              isSelected && "text-blue-700"
                            )}>
                              {day.dayOfMonth}
                            </div>
                            
                            {/* Day Events */}
                            <div className="space-y-1 overflow-hidden">
                              {day.events.slice(0, 3).map((event) => (
                                <div 
                                  key={event.id}
                                  className="text-xs px-1 py-0.5 rounded truncate"
                                  style={{ 
                                    backgroundColor: `${getEventColor(event.type)}20`,
                                    color: getEventColor(event.type)
                                  }}
                                >
                                  {event.title}
                                </div>
                              ))}
                              
                              {day.events.length > 3 && (
                                <div className="text-xs text-gray-500 px-1 text-center">
                                  +{day.events.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Day Events */}
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Events for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                      <CardDescription>
                        {selectedDateEvents.length === 0 
                          ? "No events scheduled for this day"
                          : `${selectedDateEvents.length} event${selectedDateEvents.length !== 1 ? 's' : ''} scheduled`
                        }
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Event
                    </Button>
                  </CardHeader>
                  <CardContent className="overflow-auto max-h-[400px] p-4">
                    {isLoading ? (
                      // Loading skeletons
                      Array(3).fill(0).map((_, i) => (
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
                        <h3 className="text-lg font-medium">No events scheduled</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          There are no events scheduled for this day.
                        </p>
                        <Button className="mt-4">
                          <Plus className="h-4 w-4 mr-1" /> Schedule an Event
                        </Button>
                      </div>
                    ) : (
                      selectedDateEvents.map(event => renderEventCard(event))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar: Event Overview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Events */}
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-2 border-b">
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Your next scheduled activities</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="mb-4 last:mb-0">
                          <Skeleton className="h-5 w-3/4 mb-1" />
                          <Skeleton className="h-4 w-1/2 mb-1" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      ))
                    ) : upcomingEvents.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No upcoming events
                      </div>
                    ) : (
                      upcomingEvents.map(event => (
                        <div 
                          key={event.id} 
                          className="mb-4 last:mb-0 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors"
                          onClick={() => setSelectedDate(new Date(event.date))}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(event.date), "MMM d")} • {event.time || formatTime(event.start)}
                          </div>
                          <Badge className={cn("text-xs mt-1", getEventBadgeColor(event.type))}>
                            {event.type.toString()}
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Event Categories */}
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-2 border-b">
                    <CardTitle>Event Categories</CardTitle>
                    <CardDescription>Summary by event type</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <EventCategoryCard 
                        title="Interviews" 
                        count={interviewEvents.length}
                        color={getEventColor(EVENT_TYPES.INTERVIEW)}
                        icon={<Users className="h-4 w-4" />}
                      />
                      
                      <EventCategoryCard 
                        title="Applications" 
                        count={applicationEvents.length}
                        color={getEventColor(EVENT_TYPES.APPLICATION)}
                        icon={<Briefcase className="h-4 w-4" />}
                      />
                      
                      <EventCategoryCard 
                        title="Career Events" 
                        count={workshopEvents.length}
                        color={getEventColor(EVENT_TYPES.EVENT)}
                        icon={<CalendarIcon className="h-4 w-4" />}
                      />
                      
                      <EventCategoryCard 
                        title="Reminders" 
                        count={reminderEvents.length}
                        color={getEventColor(EVENT_TYPES.REMINDER)}
                        icon={<Bell className="h-4 w-4" />}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-2 border-b">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-2 p-4">
                    <Button className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" /> Add Interview
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" /> Set Application Reminder
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="agenda">
            <div className="grid grid-cols-1 gap-6">
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-2 border-b">
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>All your scheduled activities</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {isLoading ? (
                    // Loading skeletons
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="py-4 border-b last:border-0">
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-5 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))
                  ) : events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium">No events scheduled</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        You don&apos;t have any upcoming events.
                      </p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-1" /> Add New Event
                      </Button>
                    </div>
                  ) : (
                    // Group events by date
                    Object.entries(
                      events
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .reduce((groups, event) => {
                          const date = format(new Date(event.date), 'yyyy-MM-dd');
                          if (!groups[date]) {
                            groups[date] = [];
                          }
                          groups[date].push(event);
                          return groups;
                        }, {} as Record<string, CalendarEvent[]>)
                    ).map(([dateKey, dateEvents]) => (
                      <div key={dateKey} className="mb-6 last:mb-0">
                        <h3 className="text-base font-medium mb-3 pb-2 border-b">
                          {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                        </h3>
                        <div className="space-y-3">
                          {dateEvents.map(event => (
                            <div 
                              key={event.id}
                              className="p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-4"
                              style={{ borderLeftColor: getEventColor(event.type) }}
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium">{event.title}</h4>
                                <Badge className={getEventBadgeColor(event.type)}>
                                  {event.type.toString()}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {event.allDay 
                                    ? "All day" 
                                    : `${event.time || formatTime(event.start)}${event.endTime ? ` - ${event.endTime}` : ''}`
                                  }
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.company && (
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Building className="h-3 w-3 mr-1" />
                                  <span>
                                    {event.company}
                                    {event.jobTitle && ` • ${event.jobTitle}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

// Event Category Card component
function EventCategoryCard({ title, count, icon, color }: {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="h-8 w-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <div style={{ color }}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-lg font-bold" style={{ color }}>
          {count}
        </span>
      </div>
    </div>
  )
}
