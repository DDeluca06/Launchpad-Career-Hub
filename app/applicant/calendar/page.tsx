"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Plus,
  Users,
  Building,
  Briefcase,
  Bookmark,
  GraduationCap,
  ListTodo,
  Calendar
} from "lucide-react"
import { extendedPalette } from "@/lib/colors"

// Example event types
const EVENT_TYPES = {
  INTERVIEW: "interview",
  APPLICATION: "application",
  EVENT: "event",
  REMINDER: "reminder"
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  start: Date
  end: Date
  startTime?: string
  endTime?: string
  time?: string
  type: string
  location?: string
  company?: string
  jobTitle?: string
  description?: string
  important?: boolean
  allDay?: boolean
  attendees?: number
}

// Helper function to generate days for the calendar
const generateCalendarDays = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday
  
  // Calculate starting day for calendar (might be in previous month)
  let startDate = new Date(firstDayOfMonth)
  startDate.setDate(1 - startingDayOfWeek)
  
  const days: Array<{
    date: Date;
    dayOfMonth: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: CalendarEvent[];
  }> = []
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    const isCurrentMonth = currentDate.getMonth() === month
    const isToday = 
      currentDate.getDate() === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()
    
    days.push({
      date: currentDate,
      dayOfMonth: currentDate.getDate(),
      isCurrentMonth,
      isToday,
      events: []
    })
  }
  
  return days
}

// Helper to format dates
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ApplicantCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Array<{
    date: Date;
    dayOfMonth: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: CalendarEvent[];
  }>>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  
  // Get events for selected date
  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    )
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  
  // Load calendar data
  useEffect(() => {
    // Simulate loading data from API/localStorage
    setTimeout(() => {
      const today = new Date()
      
      const sampleEvents: CalendarEvent[] = [
        {
          id: "1",
          title: "Interview with TechCorp",
          date: today,
          start: new Date(today.setHours(10, 0, 0, 0)),
          end: new Date(today.setHours(11, 30, 0, 0)),
          time: "10:00 AM",
          endTime: "11:30 AM",
          type: EVENT_TYPES.INTERVIEW,
          location: "Online (Zoom)",
          company: "TechCorp",
          jobTitle: "Junior Developer",
          description: "Technical interview with the engineering team",
          important: true
        },
        {
          id: "2",
          title: "Application Deadline: Frontend Developer",
          date: new Date(new Date().setDate(new Date().getDate() + 2)),
          start: new Date(new Date().setDate(new Date().getDate() + 2)),
          end: new Date(new Date().setDate(new Date().getDate() + 2)),
          type: EVENT_TYPES.APPLICATION,
          company: "InnoSoft",
          jobTitle: "Frontend Developer",
          description: "Last day to submit your application",
          allDay: true
        },
        {
          id: "3",
          title: "Tech Resume Workshop",
          date: new Date(new Date().setDate(new Date().getDate() + 3)),
          start: new Date(new Date().setDate(new Date().getDate() + 3)),
          end: new Date(new Date().setDate(new Date().getDate() + 3)),
          time: "2:00 PM",
          endTime: "4:00 PM",
          type: EVENT_TYPES.EVENT,
          location: "Philadelphia Public Library",
          description: "Learn how to optimize your tech resume",
          attendees: 32
        },
        {
          id: "4",
          title: "Follow up with DataViz Inc.",
          date: new Date(new Date().setDate(new Date().getDate() + 1)),
          start: new Date(new Date().setDate(new Date().getDate() + 1)),
          end: new Date(new Date().setDate(new Date().getDate() + 1)),
          type: EVENT_TYPES.REMINDER,
          company: "DataViz Inc.",
          description: "Send a follow-up email after the phone screen"
        },
        {
          id: "5",
          title: "DevOps Position Interview",
          date: new Date(new Date().setDate(new Date().getDate() + 4)),
          start: new Date(new Date().setDate(new Date().getDate() + 4)),
          end: new Date(new Date().setDate(new Date().getDate() + 4)),
          time: "11:00 AM",
          endTime: "12:00 PM",
          type: EVENT_TYPES.INTERVIEW,
          location: "1600 Market St, Philadelphia",
          company: "CloudScale",
          jobTitle: "Junior DevOps Engineer",
          description: "First-round on-site interview"
        },
        {
          id: "6",
          title: "Philadelphia Tech Job Fair",
          date: new Date(new Date().setDate(new Date().getDate() + 7)),
          start: new Date(new Date().setDate(new Date().getDate() + 7)),
          end: new Date(new Date().setDate(new Date().getDate() + 7)),
          time: "10:00 AM",
          endTime: "4:00 PM",
          type: EVENT_TYPES.EVENT,
          location: "Philadelphia Convention Center",
          description: "Bring copies of your resume and dress professionally",
          attendees: 120
        }
      ]
      
      setEvents(sampleEvents)
      setIsLoading(false)
    }, 1000)
  }, [])
  
  useEffect(() => {
    const days = generateCalendarDays(currentDate)
    
    // Add events to calendar days
    events.forEach(event => {
      const eventDate = new Date(event.date)
      const eventDay = days.find(day => 
        day.date.getDate() === eventDate.getDate() &&
        day.date.getMonth() === eventDate.getMonth() &&
        day.date.getFullYear() === eventDate.getFullYear()
      )
      
      if (eventDay) {
        eventDay.events = [...eventDay.events, event]
      }
    })
    
    setCalendarDays(days)
  }, [currentDate, events])
  
  // Helper to get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' })
  }
  
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
  
  // Get color for event type
  const getEventColor = (type: string) => {
    switch (type) {
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
  
  // Get event type icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case EVENT_TYPES.INTERVIEW:
        return <Users className="h-4 w-4" />
      case EVENT_TYPES.APPLICATION:
        return <Briefcase className="h-4 w-4" />
      case EVENT_TYPES.EVENT:
        return <CalendarIcon className="h-4 w-4" />
      case EVENT_TYPES.REMINDER:
        return <Clock className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }
  
  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Calendar</h1>
            <p className="text-gray-500 mt-1">
              Keep track of interviews, application deadlines, and events
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <div className="flex items-center border rounded overflow-hidden">
              <Button variant="ghost" size="sm" onClick={goToPreviousMonth} className="border-r rounded-none">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1.5 text-sm font-medium">
                {getMonthName(currentDate)} {currentDate.getFullYear()}
              </div>
              <Button variant="ghost" size="sm" onClick={goToNextMonth} className="border-l rounded-none">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center border rounded overflow-hidden">
              <Button 
                variant={viewMode === 'month' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('month')} 
                className="rounded-none"
              >
                Month
              </Button>
              <Button 
                variant={viewMode === 'week' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('week')} 
                className="border-l rounded-none"
              >
                Week
              </Button>
              <Button 
                variant={viewMode === 'day' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('day')} 
                className="border-l rounded-none"
              >
                Day
              </Button>
            </div>
            <Button className="ml-2" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Calendar */}
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 auto-rows-fr">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "border rounded overflow-hidden h-24 p-1 relative",
                      day.isCurrentMonth ? "bg-white" : "bg-gray-50/50 opacity-40",
                      day.isToday && "border-blue-400",
                      selectedDate && 
                        day.date.getDate() === selectedDate.getDate() && 
                        day.date.getMonth() === selectedDate.getMonth() && 
                        day.date.getFullYear() === selectedDate.getFullYear() && 
                        "ring-2 ring-offset-1 ring-blue-500",
                    )}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <div className="text-xs font-medium p-1">
                      {day.dayOfMonth}
                    </div>
                    
                    {/* Events */}
                    <div className="space-y-1 overflow-hidden">
                      {day.events.slice(0, 3).map((event: any) => (
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
                        <div className="text-xs text-gray-500 px-1">
                          +{day.events.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Selected Day Events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                
                <Badge className="font-normal py-1">
                  {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    </div>
                  ))}
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <CalendarIcon className="h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-sm font-medium text-gray-600 mb-1">No events scheduled</h3>
                  <p className="text-xs text-gray-500 text-center max-w-xs">
                    There are no events scheduled for this day. Click the "Add Event" button to add one.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={cn(
                        "p-3 rounded-lg",
                        "border-l-4"
                      )}
                      style={{ 
                        backgroundColor: `${getEventColor(event.type)}10`,
                        borderLeftColor: getEventColor(event.type)
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium">{event.title}</h3>
                        {event.important && (
                          <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.allDay ? (
                          <span>All day</span>
                        ) : (
                          <span>
                            {event.time} {event.endTime ? `- ${event.endTime}` : ''}
                          </span>
                        )}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.company && (
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <Building className="h-3 w-3 mr-1" />
                          <span>{event.company}{event.jobTitle ? ` • ${event.jobTitle}` : ''}</span>
                        </div>
                      )}
                      {event.description && (
                        <p className="text-xs text-gray-600 mt-2">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex mt-3">
                        <Button size="sm" variant="outline" className="text-xs h-7 mr-2">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            
            <Separator />
            
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-3">
                {events
                  .filter(event => 
                    new Date(event.date).getTime() > new Date().getTime() &&
                    !(
                      new Date(event.date).getDate() === selectedDate.getDate() &&
                      new Date(event.date).getMonth() === selectedDate.getMonth() &&
                      new Date(event.date).getFullYear() === selectedDate.getFullYear()
                    )
                  )
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 3)
                  .map((event) => (
                    <div 
                      key={event.id} 
                      className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => setSelectedDate(new Date(event.date))}
                    >
                      <div 
                        className="w-2 h-full rounded-full"
                        style={{ backgroundColor: getEventColor(event.type) }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium truncate">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                          {event.time && (
                            <span className="ml-1">• {event.time}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Event Categories */}
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">Event Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <EventCategoryCard 
              title="Interviews" 
              count={events.filter(e => e.type === EVENT_TYPES.INTERVIEW).length}
              icon={<Users className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.INTERVIEW)}
            />
            <EventCategoryCard 
              title="Applications" 
              count={events.filter(e => e.type === EVENT_TYPES.APPLICATION).length}
              icon={<Briefcase className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.APPLICATION)}
            />
            <EventCategoryCard 
              title="Events" 
              count={events.filter(e => e.type === EVENT_TYPES.EVENT).length}
              icon={<Calendar className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.EVENT)}
            />
            <EventCategoryCard 
              title="Reminders" 
              count={events.filter(e => e.type === EVENT_TYPES.REMINDER).length}
              icon={<Clock className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.REMINDER)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function EventCategoryCard({ title, count, icon, color }: {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="mr-4">
            <div 
              className="p-2 rounded"
              style={{ backgroundColor: `${color}20` }}
            >
              <div style={{ color }}>
                {icon}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-xl font-bold" style={{ color }}>
              {count}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
