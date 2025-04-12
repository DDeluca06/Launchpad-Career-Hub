import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Interview } from "./types";
import { extendedPalette } from "@/lib/colors";

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  interviews: Interview[];
}

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  calendarDays: CalendarDay[];
  onDateSelect: (date: Date) => void;
}

export function CalendarGrid({ currentDate, selectedDate, calendarDays, onDateSelect }: CalendarGridProps) {
  return (
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
            const isSelected =
              day.date.getDate() === selectedDate.getDate() &&
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
                onClick={() => onDateSelect(day.date)}
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
                {day.interviews.length > 0 && (
                  <div className="flex justify-center">
                    <div 
                      className="px-1.5 py-0.5 text-xs rounded-full text-white text-center"
                      style={{ backgroundColor: extendedPalette.primaryBlue }}
                    >
                      {day.interviews.length}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 