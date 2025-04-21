import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Badge } from "@/components/ui/basic/badge";
import { Interview } from "./types";
import { cn } from "@/lib/utils";
import { extendedPalette } from "@/lib/colors";

interface InterviewCardProps {
  interview: Interview;
  onEdit?: (interview: Interview) => void;
  onCancel?: (interview: Interview) => void;
  onComplete?: (interview: Interview) => void;
  onStatusUpdate?: (interview: Interview, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') => void;
}

export function InterviewCard({ interview, onEdit, onStatusUpdate }: InterviewCardProps) {
  const getStatusColor = (status: string = 'SCHEDULED') => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Handler functions for the buttons
  const handleComplete = () => {
    onStatusUpdate?.(interview, 'COMPLETED');
  };

  const handleCancel = () => {
    onStatusUpdate?.(interview, 'CANCELLED');
  };

  return (
    <Card className="mb-4 border-0 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{interview.title}</CardTitle>
          <Badge className={cn(getStatusColor(interview.status))}>
            {interview.status || 'SCHEDULED'}
          </Badge>
        </div>
        <CardDescription>{interview.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center">
            <span className="font-medium">Candidate:</span>
            <span className="ml-2">{interview.candidate_name}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Position:</span>
            <span className="ml-2">{interview.position}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {format(new Date(interview.start_time), "h:mm a")} - {format(new Date(interview.end_time), "h:mm a")}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{interview.location || 'No location specified'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        {interview.status === 'SCHEDULED' && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              style={{ borderColor: extendedPalette.primaryBlue, color: extendedPalette.primaryBlue }}
              onClick={() => onEdit?.(interview)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              style={{ borderColor: extendedPalette.primaryGreen, color: extendedPalette.primaryGreen }}
              onClick={handleComplete}
            >
              Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              style={{ borderColor: extendedPalette.primaryOrange, color: extendedPalette.primaryOrange }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
} 