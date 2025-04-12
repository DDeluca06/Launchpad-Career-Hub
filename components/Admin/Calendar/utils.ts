import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { Interview, CalendarDay } from "./types";

export function generateCalendarDays(currentDate: Date, interviews: Interview[] = []): CalendarDay[] {
  // Get the start and end dates for the calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate all days in the calendar grid
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map(date => {
    // Get interviews for this day
    const dayInterviews = interviews.filter(interview => {
      const interviewDate = new Date(interview.start_time);
      return (
        interviewDate.getDate() === date.getDate() &&
        interviewDate.getMonth() === date.getMonth() &&
        interviewDate.getFullYear() === date.getFullYear()
      );
    });

    return {
      date,
      dayOfMonth: date.getDate(),
      isCurrentMonth: isSameMonth(date, currentDate),
      isToday: isToday(date),
      interviews: dayInterviews,
    };
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
} 