// Event Types
export enum EVENT_TYPES {
  INTERVIEW = "INTERVIEW",
  WORKSHOP = "WORKSHOP",
  CAREER_FAIR = "CAREER_FAIR",
  CAMPUS_EVENT = "CAMPUS_EVENT"
}

// Example events data
export const EXAMPLE_EVENTS = [
  {
    id: "e1",
    title: "Backend Developer Interview",
    description: "Technical interview for the backend developer position with Acme Corp.",
    type: EVENT_TYPES.INTERVIEW,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 10, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 11, 30).toISOString(),
    location: "Virtual (Zoom)",
    attendees: 3,
    capacity: 4
  },
  {
    id: "e2",
    title: "Resume Building Workshop",
    description: "Learn how to craft an effective resume that stands out to recruiters.",
    type: EVENT_TYPES.WORKSHOP,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 4, 14, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 4, 16, 0).toISOString(),
    location: "Career Center, Room 201",
    attendees: 24,
    capacity: 30
  },
  {
    id: "e3",
    title: "Spring Career Fair",
    description: "Annual career fair with over 50 companies from tech, finance, and healthcare sectors.",
    type: EVENT_TYPES.CAREER_FAIR,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10, 9, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10, 17, 0).toISOString(),
    location: "Student Union, Grand Hall",
    attendees: 312,
    capacity: 500
  },
  {
    id: "e4",
    title: "Tech Talk: AI in Healthcare",
    description: "Guest speaker from MedTech discussing applications of AI in modern healthcare.",
    type: EVENT_TYPES.CAMPUS_EVENT,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 15, 30).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 17, 0).toISOString(),
    location: "Science Building, Auditorium",
    attendees: 87,
    capacity: 120
  },
  {
    id: "e5",
    title: "Frontend Developer Interview",
    description: "Technical interview for the frontend developer position with TechStart Inc.",
    type: EVENT_TYPES.INTERVIEW,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2, 11, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2, 12, 30).toISOString(),
    location: "Virtual (Microsoft Teams)",
    attendees: 2,
    capacity: 3
  },
  {
    id: "e6",
    title: "Networking Skills Seminar",
    description: "Learn effective networking techniques for career development.",
    type: EVENT_TYPES.WORKSHOP,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7, 13, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7, 15, 0).toISOString(),
    location: "Business School, Room 305",
    attendees: 18,
    capacity: 25
  },
  {
    id: "e7",
    title: "Data Science Info Session",
    description: "Information session about data science career paths and opportunities.",
    type: EVENT_TYPES.CAMPUS_EVENT,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 14, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 15, 30).toISOString(),
    location: "Math Building, Room 112",
    attendees: 45,
    capacity: 60
  },
  {
    id: "e8",
    title: "Product Manager Interview",
    description: "Interview for the associate product manager position with GrowthCo.",
    type: EVENT_TYPES.INTERVIEW,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 9, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 30).toISOString(),
    location: "Virtual (Google Meet)",
    attendees: 4,
    capacity: 5
  },
  {
    id: "e9",
    title: "LinkedIn Optimization Workshop",
    description: "Learn how to maximize your LinkedIn profile for job searching and networking.",
    type: EVENT_TYPES.WORKSHOP,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7, 10, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7, 12, 0).toISOString(),
    location: "Online Webinar",
    attendees: 56,
    capacity: 100
  },
  {
    id: "e10",
    title: "Tech Startup Mixer",
    description: "Networking event with local tech startups and entrepreneurs.",
    type: EVENT_TYPES.CAREER_FAIR,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 15, 18, 0).toISOString(),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 15, 20, 30).toISOString(),
    location: "Innovation Center, Main Hall",
    attendees: 78,
    capacity: 150
  }
];

/**
 * Generates a calendar grid for a month based on a reference date.
 *
 * This function constructs a 6x7 (42-cell) array of day objects for calendar display.
 * The grid includes days from the previous and next months as needed to fill all cells.
 * Each day object contains:
 * - the actual date,
 * - the day number,
 * - a flag indicating if it belongs to the current month, and
 * - a flag indicating if it represents today's date.
 *
 * @param date - The reference date used to determine the month for the calendar.
 * @returns An array of 42 day objects representing the calendar grid.
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
 * Converts a Date object into a 12-hour time string with an AM/PM indicator.
 *
 * This function extracts the hour and minute components of the provided Date,
 * converts the hour from 24-hour to 12-hour format (with 0 hours formatted as 12),
 * and pads the minutes with a leading zero when necessary.
 *
 * @param date - The Date object representing the time to format.
 * @returns The formatted time as a string in 12-hour notation (e.g., "3:05 PM").
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