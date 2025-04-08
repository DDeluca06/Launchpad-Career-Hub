"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-launchpad-blue text-white",
        secondary: "bg-launchpad-lightBlue text-launchpad-blue",
        success: "bg-launchpad-green text-white",
        warning: "bg-launchpad-orange text-white",
        danger: "bg-red-500 text-white",
        outline: "border border-launchpad-blue/30 text-launchpad-blue bg-transparent",
        ghost: "bg-transparent text-launchpad-blue hover:bg-launchpad-blue/10",
      },
      size: {
        default: "h-6 px-2.5 py-0.5 text-xs",
        sm: "h-5 px-2 py-0 text-xs",
        lg: "h-7 px-3 py-1 text-sm",
      },
      status: {
        interested: "bg-launchpad-lightBlue text-launchpad-blue",
        applied: "bg-launchpad-blue text-white",
        phoneScreening: "bg-launchpad-green text-white",
        interviewStage: "bg-launchpad-teal text-white",
        finalInterviewStage: "bg-launchpad-darkGreen text-white",
        offerExtended: "bg-launchpad-orange text-white",
        negotiation: "bg-launchpad-brown text-white",
        offerAccepted: "bg-green-600 text-white",
        rejected: "bg-launchpad-darkGray text-white",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Define a type for the status values
export type StatusBadgeVariant = 
  | "interested" 
  | "applied" 
  | "phoneScreening" 
  | "interviewStage" 
  | "finalInterviewStage" 
  | "offerExtended" 
  | "negotiation" 
  | "offerAccepted" 
  | "rejected";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  count?: number;
  dot?: boolean;
}

function Badge({ 
  className, 
  variant, 
  size, 
  status,
  count,
  dot,
  children, 
  ...props 
}: BadgeProps) {
  // If status is provided, it overrides variant
  const finalVariant = status ? undefined : variant;
  
  return (
    <div 
      className={cn(
        badgeVariants({ variant: finalVariant, size, status, className })
      )} 
      {...props}
    >
      {dot && (
        <span className="mr-1.5 h-2 w-2 rounded-full bg-current" />
      )}
      {count !== undefined ? count : children}
    </div>
  )
}

// Specialized badge for job application status
export function StatusBadge({ 
  status, 
  className,
  size = "default",
  ...props 
}: Omit<BadgeProps, 'variant' | 'status'> & { status: StatusBadgeVariant }) {
  return (
    <Badge
      status={status}
      size={size}
      className={cn("capitalize", className)}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
    </Badge>
  );
}

export { Badge, badgeVariants }