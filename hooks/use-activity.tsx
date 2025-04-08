import { useState, useEffect } from "react"

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
 * Custom React hook to simulate fetching user activity data.
 *
 * This hook manages activity state including an array of activity objects,
 * a loading indicator, and any error encountered during the simulated API call.
 * It uses a one-second timeout to mimic data loading and returns dummy data.
 *
 * @returns An object with:
 *  - activities: an array of activity objects.
 *  - loading: a boolean indicating whether data is being loaded.
 *  - error: an Error object if the simulation fails, otherwise null.
 *
 * @remarks
 * Replace the dummy data and timeout simulation with a real API call when the backend is integrated.
 */
export function useActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Simulate API call with a delay
    const timeout = setTimeout(() => {
      try {
        // DUMMY DATA - Replace with actual API call when backend is set up
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
        ]
        setActivities(dummyData)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }, 1000) // Simulate loading delay

    return () => clearTimeout(timeout)
  }, [])

  return { activities, loading, error }
} 