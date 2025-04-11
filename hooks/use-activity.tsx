import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  name: string
}

interface Activity {
  id: string
  type: 'application' | 'status_change' | 'interview' | 'offer'
  title: string
  description: string
  timestamp: string
  user?: User
}

/**
 * Custom React hook to fetch user activity data from the server API.
 *
 * This hook manages activity state including an array of activity objects,
 * a loading indicator, and any error encountered during the data fetching.
 *
 * @returns An object with:
 *  - activities: an array of activity objects.
 *  - loading: a boolean indicating whether data is being loaded.
 *  - error: an Error object if the fetching fails, otherwise null.
 *  - refetch: function to manually trigger a data refetch.
 */
export function useActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch activities from API
      const response = await fetch('/api/dashboard/activities');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch activities');
      }
      
      // Set activities with API data
      setActivities(data.activities);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching activity data:", err);
      setError(err as Error);
      setLoading(false);
      
      // Fall back to dummy data in case of error
      const dummyData: Activity[] = [
        {
          id: "act1",
          type: "application",
          title: "New Application Received",
          description: "Alicia Thomas applied for Web Development Internship",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          user: { id: "user1", name: "Alicia Thomas" }
        },
        {
          id: "act2",
          type: "interview",
          title: "Interview Scheduled",
          description: "Technical interview with Michael Rodriguez",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          user: { id: "user2", name: "Michael Rodriguez" }
        },
        {
          id: "act3",
          type: "status_change",
          title: "Application Status Updated",
          description: "James Wilson moved to second round interview",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          user: { id: "user3", name: "James Wilson" }
        },
        {
          id: "act4",
          type: "offer",
          title: "Offer Sent",
          description: "Offer sent to Jasmine Clark for UX Design position",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          user: { id: "user4", name: "Jasmine Clark" }
        },
        {
          id: "act5",
          type: "application",
          title: "New Application Received",
          description: "Taylor Brown applied for Data Science Internship",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 28 hours ago
          user: { id: "user5", name: "Taylor Brown" }
        }
      ];
      setActivities(dummyData);
    }
  }, []);
  
  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return { activities, loading, error, refetch: fetchActivity }
}

/**
 * Helper function to generate appropriate titles for different activity types
 */
function getActivityTitle(type: 'application' | 'status_change' | 'interview' | 'offer', status: string): string {
  switch (type) {
    case 'application':
      return 'New Application Received';
    case 'interview':
      return 'Interview Scheduled';
    case 'offer':
      return 'Offer Sent';
    case 'status_change':
      return `Application Status Updated to ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    default:
      return 'Activity Updated';
  }
} 