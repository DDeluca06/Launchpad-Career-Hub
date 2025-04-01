"use client"

import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { LaunchpadImage } from "@/components/ui/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { motion } from "framer-motion"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  isAdmin?: boolean
}

export function DashboardLayout({ children, isAdmin = false }: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-20 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="p-4 border-b flex items-center justify-center">
                  <LaunchpadImage imageId="newLogo" width={120} height={48} className="h-8 w-auto" />
                </div>
                <DashboardNav isAdmin={isAdmin} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center">
              <LaunchpadImage 
                imageId="newLogo" 
                width={130} 
                height={52} 
                className="h-8 w-auto hidden md:block" 
              />
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            <h1 className="text-xl font-bold hidden md:block text-gray-800 dark:text-gray-100">
              {isAdmin ? "Admin Portal" : "Applicant Portal"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-launchpad-orange"></span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="bg-launchpad-blue text-white">
                {isAdmin ? "AD" : "US"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block fixed h-[calc(100vh-4rem)] w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 overflow-y-auto">
          <DashboardNav isAdmin={isAdmin} />
        </aside>
        <main className="flex-1 overflow-auto md:ml-64">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-[calc(100vh-4rem)]"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

