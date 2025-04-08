import { cn } from "@/lib/utils"

/**
 * Renders a skeleton loading placeholder.
 *
 * This component returns a <div> element styled with default classes that create a pulsing animation,
 * rounded corners, and a gray background. Additional HTML attributes and class names provided via props
 * allow further customization of the element.
 *
 * @param className - Optional additional class names merged with the default skeleton styling.
 * @param props - Additional HTML attributes applied to the container div.
 *
 * @returns A <div> element styled as a skeleton loading placeholder.
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