import { cn } from "@/lib/utils"

/**
 * Renders a skeleton placeholder for loading states.
 *
 * This component returns a div element with default styling classes for an animated loading effect, rounded corners, and a gray background.
 * Custom CSS classes provided via the `className` prop are concatenated with the defaults using the utility function `cn`,
 * and any additional HTML attributes are spread onto the div.
 *
 * @returns A React element representing the skeleton placeholder.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
} 