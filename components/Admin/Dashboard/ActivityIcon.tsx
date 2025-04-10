import { Briefcase, Calendar, Clock, FileSpreadsheet, ArrowUpRight } from "lucide-react";

interface ActivityIconProps {
  type: string;
}

/**
 * Activity type icon mapping component that renders an appropriate icon based on activity type.
 * 
 * @param type - The type of activity to determine which icon to display.
 * @returns A React component with the appropriate icon for the given activity type.
 */
export function ActivityIcon({ type }: ActivityIconProps) {
  switch (type) {
    case 'application':
      return <Briefcase className="h-5 w-5 text-blue-500" />;
    case 'status_change':
      return <ArrowUpRight className="h-5 w-5 text-green-500" />;
    case 'interview':
      return <Calendar className="h-5 w-5 text-purple-500" />;
    case 'offer':
      return <FileSpreadsheet className="h-5 w-5 text-orange-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
} 