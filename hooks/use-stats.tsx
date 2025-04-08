import { useState, useEffect } from "react"

interface StatsData {
  totalJobs: number
  totalApplicants: number
  activeInterviews: number
  offersSent: number
}

/**
 * Provides job application statistics along with loading and error states.
 *
 * This custom React hook initializes statistics data and simulates an API call
 * by using a timeout to update the statistics after a delay of 800 milliseconds.
 * It manages state for the statistics, a loading indicator, and any potential errors,
 * and returns these values for use in components.
 *
 * @returns An object containing:
 *   - stats: An object with job statistics including total jobs, total applicants, active interviews, and offers sent.
 *   - loading: A boolean that is true while data is loading and false once the data has been set.
 *   - error: An Error object if an error occurred during the simulated data fetching; otherwise, null.
 */
export function useStats() {
  const [stats, setStats] = useState<StatsData>({
    totalJobs: 0,
    totalApplicants: 0,
    activeInterviews: 0,
    offersSent: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Simulate API call with a delay
    const timeout = setTimeout(() => {
      try {
        // DUMMY DATA - Replace with actual API call when backend is set up
        const dummyData: StatsData = {
          totalJobs: 24,
          totalApplicants: 156,
          activeInterviews: 18,
          offersSent: 7
        }
        setStats(dummyData)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }, 800) // Simulate loading delay

    return () => clearTimeout(timeout)
  }, [])

  return { stats, loading, error }
} 