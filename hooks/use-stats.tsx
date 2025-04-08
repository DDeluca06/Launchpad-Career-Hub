import { useState, useEffect } from "react"

interface StatsData {
  totalJobs: number
  totalApplicants: number
  activeInterviews: number
  offersSent: number
}

/**
 * Custom hook that simulates fetching job statistics.
 *
 * Initializes job statistics with default values and sets a loading state while simulating an API call. After an 800-millisecond delay,
 * the hook updates the statistics with dummy data representing job application metrics. If an error occurs during the simulated fetch,
 * it is captured and reflected in the returned state.
 *
 * @returns An object containing:
 *   - stats: The current job statistics.
 *   - loading: A flag indicating if data is still loading.
 *   - error: The error encountered during the fetch, if any.
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