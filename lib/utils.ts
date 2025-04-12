import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a specified format.
 * 
 * @param date - A date string, Date object, or timestamp
 * @param format - Optional format specification ('short', 'long', or custom options)
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | number, format: 'short' | 'long' | Intl.DateTimeFormatOptions = 'short'): string {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (format === 'short') {
    return dateObj.toLocaleDateString();
  } else if (format === 'long') {
    return dateObj.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } else {
    return dateObj.toLocaleDateString(undefined, format);
  }
}
