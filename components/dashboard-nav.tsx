"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, Briefcase, BarChart2, Users, Calendar, 
  LogOut, Settings, Building, GraduationCap 
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: number
}

interface DashboardNavProps {
  isAdmin?: boolean
}

export function DashboardNav({ isAdmin = false }: DashboardNavProps) {
  const pathname = usePathname()

  const baseUrl = isAdmin ? "/admin" : "/applicant"

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `${baseUrl}/dashboard`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Jobs",
      href: `${baseUrl}/jobs`,
      icon: <Briefcase className="h-5 w-5" />,
      badge: isAdmin ? 12 : 5,
    },
    ...(isAdmin
      ? [
          {
            title: "Analytics",
            href: `${baseUrl}/analytics`,
            icon: <BarChart2 className="h-5 w-5" />,
          },
          {
            title: "Applicants",
            href: `${baseUrl}/applicants`,
            icon: <Users className="h-5 w-5" />,
            badge: 8,
          },
          {
            title: "Partners",
            href: `${baseUrl}/partners`,
            icon: <Building className="h-5 w-5" />,
          },
        ]
      : []),
    {
      title: "Calendar",
      href: `${baseUrl}/calendar`,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: `${baseUrl}/settings`,
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <nav className="flex flex-col h-full">
      <div className="px-3 py-2">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-4">
          Main
        </div>
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all relative overflow-hidden group",
                  isActive 
                    ? "text-white font-medium" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-launchpad-blue z-0 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                <div className="flex items-center gap-3 z-10 relative">
                  <div className={isActive ? "text-white" : "text-gray-500 group-hover:text-launchpad-blue"}>
                    {item.icon}
                  </div>
                  <span>{item.title}</span>
                </div>
                
                {item.badge && (
                  <span className={cn(
                    "z-10 relative text-xs font-medium rounded-full px-2 py-0.5",
                    isActive 
                      ? "bg-white text-launchpad-blue" 
                      : "bg-launchpad-lightBlue text-launchpad-blue"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-2 text-gray-600 dark:text-gray-300 hover:text-launchpad-blue">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </Link>
        <div className="mt-4 px-3 py-3 bg-launchpad-lightBlue rounded-lg border border-launchpad-blue/20">
          <p className="text-xs text-launchpad-blue font-medium mb-1">Need Help?</p>
          <p className="text-xs text-gray-600">Contact our support team for assistance with your job search journey.</p>
        </div>
      </div>
    </nav>
  )
}

