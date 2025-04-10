import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { ChevronRight, UserCircle } from "lucide-react";
import Link from "next/link";
import { extendedPalette } from "@/lib/colors";

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  company: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
}

/**
 * Renders the upcoming interviews section for the admin dashboard.
 * 
 * This component fetches and displays a list of upcoming interviews 
 * from the API, showing details like candidate name, position, company,
 * date, time, and interviewer.
 * 
 * @returns A React component displaying upcoming interviews
 */
export function UpcomingInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/interviews');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch interviews: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch interviews');
        }
        
        setInterviews(data.interviews);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
        
        // Set fallback data if real data fetch fails
        setInterviews([
          {
            id: "1",
            candidateName: "Jamie Rodriguez",
            position: "Web Developer Intern",
            company: "TechPhilly",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0], // 2 days from now
            time: "10:00 AM",
            type: "Technical Interview",
            interviewer: "Sarah Johnson"
          },
          {
            id: "2",
            candidateName: "Alex Johnson",
            position: "Data Science Intern",
            company: "Analytics Co",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0], // 3 days from now
            time: "2:30 PM",
            type: "Behavioral Interview",
            interviewer: "David Miller"
          },
          {
            id: "3",
            candidateName: "Sam Williams",
            position: "UX Design Intern",
            company: "Design Studio",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString().split('T')[0], // 5 days from now
            time: "11:15 AM",
            type: "Portfolio Review",
            interviewer: "Jessica Brown"
          }
        ]);
      }
    };
    
    fetchInterviews();
  }, []);

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Upcoming Interviews</CardTitle>
        <CardDescription>Scheduled interviews for the next 7 days</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {loading ? (
            // Loading state
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-start gap-4 py-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="py-4 text-center text-red-500">
              <p>Could not load interviews</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            // Interview data
            interviews.map((interview) => (
              <div key={interview.id} className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-muted">
                  <div style={{ color: extendedPalette.teal }}>
                    <UserCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {interview.candidateName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {interview.position} at {interview.company}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(interview.date)} at {interview.time}
                    </p>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ 
                      backgroundColor: `${extendedPalette.lightBlue}`,
                      color: `${extendedPalette.teal}`
                    }}>
                      {interview.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    With: {interview.interviewer}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/admin/interviews" className="w-full">
          <Button
            variant="outline"
            className="w-full justify-between group-hover:border-opacity-50 group-hover:bg-muted"
            style={{ borderColor: extendedPalette.primaryBlue, color: extendedPalette.teal }}
          >
            View Details
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 