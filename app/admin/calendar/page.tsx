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
  Copy,
  Download, 
  GraduationCap,
  List, 
  MapPin, 
  MoreVertical, 
  Plus, 
  User,
  User2, 
  UserCircle, 
  Users 
} from "lucide-react"
import { extendedPalette } from "@/lib/colors"

// Example event types
const EVENT_TYPES = {
  INTERVIEW: "interview",
  WORKSHOP: "workshop",
  CAREER_FAIR: "career_fair",
  INFO_SESSION: "info_session",
  NETWORKING: "networking",
  OTHER: "other"
}

// Example events data
const EXAMPLE_EVENTS = [
  {
    id: 1,
    title: "Frontend Development Workshop",
    description: "Learn about modern React development practices",
    type: EVENT_TYPES.WORKSHOP,
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    location: "Virtual",
    attendees: 12,
    capacity: 25
  },
  {
    id: 2,
    title: "Tech Innovators Interview",
    description: "Technical interview with Jordan Lee",
    type: EVENT_TYPES.INTERVIEW,
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    location: "Conference Room A",
    attendees: 2,
    interviewee: {
      name: "Jordan Lee",
      position: "Frontend Developer",
      avatar: "/placeholder-user.jpg"
    }
  },
  {
    id: 3,
    title: "Spring Career Fair",
    description: "Annual career fair with 15+ tech companies",
    type: EVENT_TYPES.CAREER_FAIR,
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
    allDay: true,
    location: "Main Hall",
    attendees: 85,
    capacity: 150
  },
  {
    id: 4,
    title: "DataWorks Info Session",
    description: "Learn about careers in data science",
    type: EVENT_TYPES.INFO_SESSION,
    start: new Date(new Date().setHours(new Date().getHours() + 26)),
    end: new Date(new Date().setHours(new Date().getHours() + 27)),
    location: "Room 302",
    attendees: 18,
    capacity: 30,
    company: "DataWorks"
  },
  {
    id: 5,
    title: "Backend Engineering Interview",
    description: "Technical interview with Alex Johnson",
    type: EVENT_TYPES.INTERVIEW,
    start: new Date(new Date().setHours(15, 30, 0, 0)),
    end: new Date(new Date().setHours(16, 30, 0, 0)),
    location: "Conference Room B",
    attendees: 2,
    interviewee: {
      name: "Alex Johnson",
      position: "Backend Engineer",
      avatar: "/placeholder-user.jpg"
    }
  },
  {
    id: 6,
    title: "Networking Mixer",
    description: "Network with local tech professionals",
    type: EVENT_TYPES.NETWORKING,
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    start_time: "18:00",
    end_time: "20:00",
    location: "City View Lounge",
    attendees: 32,
    capacity: 50
  },
  {
    id: 7,
    title: "UX Design Principles",
    description: "Workshop on core UX principles and practices",
    type: EVENT_TYPES.WORKSHOP,
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    start_time: "13:00",
    end_time: "15:00",
    location: "Design Lab",
    attendees: 15,
    capacity: 20
  }
]

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
  
  const days = []
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    const isCurrentMonth = currentDate.getMonth() === month
    const isToday = 
      currentDate.getDate() === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()
    
    // Find events for this day
    const dayEvents = EXAMPLE_EVENTS.filter(event => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      )
    })
    
    days.push({
      date: currentDate,
      dayOfMonth: currentDate.getDate(),
      isCurrentMonth,
      isToday,
      events: dayEvents
    })
  }
  
  return days
}

// Helper to format dates
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [isLoading, setIsLoading] = useState(false)
  
  // Get events for selected date
  const selectedDateEvents = EXAMPLE_EVENTS.filter(event => {
    const eventDate = new Date(event.start)
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    )
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  
  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentDate))
  }, [currentDate])
  
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
        return extendedPalette.primaryBlue
      case EVENT_TYPES.WORKSHOP:
        return extendedPalette.primaryGreen
      case EVENT_TYPES.CAREER_FAIR:
        return extendedPalette.primaryOrange
      case EVENT_TYPES.INFO_SESSION:
        return extendedPalette.teal
      case EVENT_TYPES.NETWORKING:
        return extendedPalette.brown
      default:
        return extendedPalette.darkGray
    }
  }
  
  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar & Events</h1>
            <p className="text-gray-500 mt-1">Schedule and manage interviews, workshops, and events</p>
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
            <Button className="ml-2" size="sm" style={{ backgroundColor: extendedPalette.primaryBlue }}>
              <Plus className="h-4 w-4 mr-1" /> New Event
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
              {selectedDateEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <CalendarIcon className="h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-sm font-medium text-gray-600 mb-1">No events scheduled</h3>
                  <p className="text-xs text-gray-500 text-center max-w-xs">
                    There are no events scheduled for this day. Click the "New Event" button to add one.
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
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.allDay ? (
                          <span>All day</span>
                        ) : (
                          <span>
                            {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                          </span>
                        )}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.type === EVENT_TYPES.INTERVIEW && event.interviewee && (
                        <div className="flex items-center mt-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={event.interviewee.avatar} alt={event.interviewee.name} />
                            <AvatarFallback>{event.interviewee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-medium">{event.interviewee.name}</div>
                            <div className="text-xs text-gray-500">{event.interviewee.position}</div>
                          </div>
                        </div>
                      )}
                      {(event.attendees || event.capacity) && (
                        <div className="flex items-center text-xs text-gray-600 mt-2">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{event.attendees} {event.capacity ? `/ ${event.capacity}` : ''} attendees</span>
                        </div>
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
                {EXAMPLE_EVENTS
                  .filter(event => 
                    new Date(event.start).getTime() > new Date().getTime() &&
                    !(
                      new Date(event.start).getDate() === selectedDate.getDate() &&
                      new Date(event.start).getMonth() === selectedDate.getMonth() &&
                      new Date(event.start).getFullYear() === selectedDate.getFullYear()
                    )
                  )
                  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                  .slice(0, 3)
                  .map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div 
                        className="w-2 h-full rounded-full"
                        style={{ backgroundColor: getEventColor(event.type) }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium truncate">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(event.start).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <EventCategoryCard 
              title="Interviews" 
              count={EXAMPLE_EVENTS.filter(e => e.type === EVENT_TYPES.INTERVIEW).length}
              icon={<User2 className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.INTERVIEW)}
            />
            <EventCategoryCard 
              title="Workshops" 
              count={EXAMPLE_EVENTS.filter(e => e.type === EVENT_TYPES.WORKSHOP).length}
              icon={<GraduationCap className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.WORKSHOP)}
            />
            <EventCategoryCard 
              title="Career Fairs" 
              count={EXAMPLE_EVENTS.filter(e => e.type === EVENT_TYPES.CAREER_FAIR).length}
              icon={<Users className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.CAREER_FAIR)}
            />
            <EventCategoryCard 
              title="Info Sessions" 
              count={EXAMPLE_EVENTS.filter(e => e.type === EVENT_TYPES.INFO_SESSION).length}
              icon={<Copy className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.INFO_SESSION)}
            />
            <EventCategoryCard 
              title="Networking" 
              count={EXAMPLE_EVENTS.filter(e => e.type === EVENT_TYPES.NETWORKING).length}
              icon={<User className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.NETWORKING)}
            />
            <EventCategoryCard 
              title="Other Events" 
              count={EXAMPLE_EVENTS.filter(e => e.type === EVENT_TYPES.OTHER).length}
              icon={<List className="h-4 w-4" />}
              color={getEventColor(EVENT_TYPES.OTHER)}
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