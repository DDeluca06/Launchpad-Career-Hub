"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

const cardVariants = cva(
  "rounded-lg border bg-white text-card-foreground shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        primary: "border-l-4 border-l-launchpad-blue border-t border-r border-b border-gray-200",
        success: "border-l-4 border-l-launchpad-green border-t border-r border-b border-gray-200",
        warning: "border-l-4 border-l-launchpad-orange border-t border-r border-b border-gray-200",
        danger: "border-l-4 border-red-500 border-t border-r border-b border-gray-200",
        ghost: "border-transparent shadow-none bg-transparent",
      },
      size: {
        default: "",
        sm: "p-3",
        lg: "p-6",
      },
      hover: {
        true: "hover:shadow-md hover:border-launchpad-blue/30",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: true,
    },
  }
)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof cardVariants> & 
  { animated?: boolean }
>(({ className, variant, size, hover, animated = false, ...props }, ref) => {
  
  const cardClassName = cn(cardVariants({ variant, size, hover, className }));
  
  if (animated) {
    // Using type assertion to avoid TypeScript errors with motion.div props
    return (
      <motion.div
        ref={ref}
        className={cardClassName}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props as {}}
      />
    );
  }
  
  return (
    <div
      ref={ref}
      className={cardClassName}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { 
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent 
}; 