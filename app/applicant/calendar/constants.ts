// Event Types
export enum EVENT_TYPES {
  INTERVIEW = "INTERVIEW",
  APPLICATION = "APPLICATION",
  EVENT = "EVENT",
  REMINDER = "REMINDER"
}

// Type for calendar events
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  start: Date;
  end: Date;
  time?: string;
  endTime?: string;
  type: EVENT_TYPES;
  location?: string;
  company?: string;
  jobTitle?: string;
  description?: string;
  attendees?: number;
  important?: boolean;
  allDay?: boolean;
}

// Example events data
export const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Interview with TechCorp",
    date: new Date(),
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
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
];

/**
 * Generates an array of days for the calendar
 * @param date The reference date to generate calendar for (usually current month)
 * @returns Array of calendar days with their properties
 */
export function generateCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  // Last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  // Total days in month
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Today's date for comparison
  const today = new Date();
  const isToday = (date: Date) => 
    date.getDate() === today.getDate() && 
    date.getMonth() === today.getMonth() && 
    date.getFullYear() === today.getFullYear();
  
  const calendarDays = [];
  
  // Add days from previous month to fill the first row
  const daysFromPrevMonth = firstDayOfWeek;
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  
  for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
    const date = new Date(year, month - 1, i);
    calendarDays.push({
      date,
      dayOfMonth: i,
      isCurrentMonth: false,
      isToday: isToday(date)
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    calendarDays.push({
      date,
      dayOfMonth: i,
      isCurrentMonth: true,
      isToday: isToday(date)
    });
  }
  
  // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
  const totalCalendarCells = 42;
  const daysFromNextMonth = totalCalendarCells - calendarDays.length;
  
  for (let i = 1; i <= daysFromNextMonth; i++) {
    const date = new Date(year, month + 1, i);
    calendarDays.push({
      date,
      dayOfMonth: i,
      isCurrentMonth: false,
      isToday: isToday(date)
    });
  }
  
  return calendarDays;
}

/**
 * Format a time to 12-hour format with AM/PM
 * @param date Date object to format
 * @returns Formatted time string
 */
export function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
} 