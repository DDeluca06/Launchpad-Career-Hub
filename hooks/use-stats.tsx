import { useState, useEffect, useCallback } from "react"

interface StatsData {
  totalJobs: number
  totalApplications: number
  activeInterviews: number
  partnerCompanies: number
}

/**
 * Provides job application statistics along with loading and error states.
 *
 * This custom React hook fetches statistics from the server-side API.
 * It manages state for the statistics, a loading indicator, and any potential errors,
 * and returns these values for use in components.
 *
 * @returns An object containing:
 *   - stats: An object with job statistics including total jobs, total applications, active interviews, and partner companies.
 *   - loading: A boolean that is true while data is loading and false once the data has been set.
 *   - error: An Error object if an error occurred during data fetching; otherwise, null.
 *   - refetch: A function to manually trigger a data refresh.
 */
export function useStats() {
  const [stats, setStats] = useState<StatsData>({
    totalJobs: 0,
    totalApplications: 0,
    activeInterviews: 0,
    partnerCompanies: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stats from API
      const response = await fetch('/api/dashboard/stats');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch stats');
      }
      
      // Set the stats with API data
      setStats(data.stats.topStats);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err as Error);
      setLoading(false);

      // Fall back to dummy data in case of error
      setStats({
        totalJobs: 24,
        totalApplications: 156,
        activeInterviews: 18,
        partnerCompanies: 12
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats }
} 