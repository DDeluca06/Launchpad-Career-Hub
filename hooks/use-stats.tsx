import { useState, useEffect } from "react"

interface StatsData {
  totalJobs: number
  totalApplicants: number
  activeInterviews: number
  offersSent: number
}

/**
 * Custom React hook that simulates fetching and managing job application statistics.
 *
 * This hook initializes statistics with default values and simulates an API call by
 * setting dummy data after an 800ms delay. It returns the current statistics along with
 * loading and error states to support UI feedback during data fetching.
 *
 * @returns An object containing:
 * - stats: current job application statistics,
 * - loading: a boolean indicating whether the data is being loaded,
 * - error: an Error instance if data fetching fails, or null otherwise.
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