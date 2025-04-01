"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: "default" | "pills" | "underline"
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
    pills: "inline-flex h-10 items-center justify-center gap-1 rounded-md p-1 text-gray-500",
    underline: "inline-flex h-10 items-center justify-center gap-4 border-b border-gray-200 text-gray-500",
  }
  
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: "default" | "pills" | "underline"
  icon?: React.ReactNode
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = "default", icon, children, ...props }, ref) => {
  const variantClasses = {
    default: "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-launchpad-blue data-[state=active]:shadow-sm",
    pills: "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-launchpad-blue data-[state=active]:text-white",
    underline: "inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-1 py-2.5 text-sm font-medium ring-offset-background transition-all hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-launchpad-blue data-[state=active]:text-launchpad-blue"
  }
  
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative",
        variantClasses[variant || "default"],
        className
      )}
      {...props}
    >
      {variant === "pills" && (props as any)["data-state"] === "active" && (
        <motion.span
          className="absolute inset-0 bg-launchpad-blue rounded-full"
          layoutId="tab-pill-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ zIndex: -1 }}
        />
      )}
      <div className="flex items-center gap-2 z-10">
        {icon && <span className="h-4 w-4">{icon}</span>}
        {children}
      </div>
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} 