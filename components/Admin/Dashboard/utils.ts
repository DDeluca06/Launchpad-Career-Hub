/**
 * Formats a date string into a human-readable relative time description.
 *
 * This function calculates the elapsed time between the provided date and the current moment, returning:
 * - "Just now" for differences under 60 seconds,
 * - a minute-based representation (e.g., "5m ago") for differences under 60 minutes,
 * - an hour-based representation (e.g., "2h ago") for differences under 24 hours,
 * - or a locale-specific date string for older dates.
 *
 * @param dateString - A valid date string to format.
 * @returns A human-readable string representing the relative time since the given date.
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  return date.toLocaleDateString();
} 