import { cn } from "@/lib/utils"

/**
 * Renders a pulsing skeleton placeholder for loading states.
 *
 * This component returns a <div> element with default animation and styling,
 * which can be extended with additional HTML attributes and custom CSS classes.
 *
 * @param className - Optional CSS classes to customize the component's appearance.
 * @param props - Additional HTML attributes applied to the <div> element.
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