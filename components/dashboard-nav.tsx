"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/basic/button"
import { motion } from "framer-motion"
import { extendedPalette } from "@/lib/colors"
import { 
  LayoutDashboard, Briefcase, BarChart2, Users, MessageSquare, Calendar, 
  LogOut, Settings, GraduationCap, HelpCircle
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: number
  color?: string
}

interface NavSectionProps {
  title: string
  items: NavItem[]
  pathname: string
}

interface DashboardNavProps {
  isAdmin?: boolean
}

function NavSection({ title, items, pathname }: NavSectionProps) {
  return (
    <div className="px-3 py-2">
      <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-4">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          const itemColor = item.color || extendedPalette.primaryBlue;
          
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all duration-150 ease-in-out relative overflow-hidden group",
                isActive 
                  ? "text-white font-medium shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId={`nav-indicator-${title}`}
                  className="absolute inset-0 z-0 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ backgroundColor: itemColor }}
                />
              )}
              
              <div className="flex items-center gap-3 z-10 relative">
                <div className={cn(
                  "flex items-center justify-center w-5 h-5",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                )}>
                  {React.cloneElement(item.icon as React.ReactElement, { 
                    className: "h-4 w-4",
                    style: isActive ? { color: 'white' } : { color: itemColor }
                  })}
                </div>
                <span className={cn(
                  isActive ? "" : "group-hover:translate-x-0.5 transition-transform duration-150"
                )}>
                  {item.title}
                </span>
              </div>
              
              {item.badge && (
                <span className={cn(
                  "z-10 relative text-[10px] font-semibold rounded-full px-1.5 py-0.5 flex items-center justify-center min-w-[1.25rem]",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  )
}

export function DashboardNav({ isAdmin = false }: DashboardNavProps) {
  const pathname = usePathname()
  const baseUrl = isAdmin ? "/admin" : "/applicant"

  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `${baseUrl}/dashboard`,
      icon: <LayoutDashboard />,
      color: extendedPalette.primaryBlue
    },
    {
      title: "Jobs",
      href: `${baseUrl}/jobs`,
      icon: <Briefcase />,
      badge: isAdmin ? 12 : 5,
      color: extendedPalette.primaryGreen
    }
  ];

  const adminSectionItems: NavItem[] = isAdmin ? [
    {
      title: "Analytics",
      href: `${baseUrl}/analytics`,
      icon: <BarChart2 />,
      color: extendedPalette.teal
    },
    {
      title: "Applicants",
      href: `${baseUrl}/applicants`,
      icon: <Users />,
      badge: 8,
      color: extendedPalette.primaryOrange
    },
    {
      title: "Partners",
      href: `${baseUrl}/partners`,
      icon: <MessageSquare />,
      color: extendedPalette.brown
    },
  ] : [];

  const studentSectionItems: NavItem[] = isAdmin ? [] : [
    {
      title: "Learning",
      href: `${baseUrl}/learning`,
      icon: <GraduationCap />,
      badge: 2,
      color: extendedPalette.primaryOrange
    },
    {
      title: "Events",
      href: `${baseUrl}/events`,
      icon: <Calendar />,
      badge: 1,
      color: extendedPalette.teal
    },
  ];

  const utilityItems: NavItem[] = [
    {
      title: "Calendar",
      href: `${baseUrl}/calendar`,
      icon: <Calendar />,
      color: extendedPalette.primaryGreen
    },
    {
      title: "Settings",
      href: `${baseUrl}/settings`,
      icon: <Settings />,
      color: extendedPalette.darkGray
    },
  ];

  return (
    <nav className="flex flex-col h-full">
      <div className="py-2">
        <NavSection title="Main" items={mainNavItems} pathname={pathname} />
        
        {isAdmin && adminSectionItems.length > 0 && (
          <NavSection title="Management" items={adminSectionItems} pathname={pathname} />
        )}
        
        {!isAdmin && studentSectionItems.length > 0 && (
          <NavSection title="Resources" items={studentSectionItems} pathname={pathname} />
        )}
        
        <NavSection title="Utilities" items={utilityItems} pathname={pathname} />
      </div>
      
      <div className="mt-auto px-4 pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors px-3 py-2"
          >
            <LogOut className="h-4 w-4 group-hover:text-red-600 transition-colors" />
            <span className="group-hover:translate-x-0.5 transition-transform duration-150">Log Out</span>
          </Button>
        </Link>
        <div className="mt-4 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
          <div className="flex gap-2.5 items-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-1.5 flex-shrink-0">
              <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mb-0.5">Need Help?</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">Contact our support team for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

