"use client"

import { ReactNode, useEffect } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { initializeSampleData } from '@/lib/local-storage'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize sample data on client-side
    if (typeof window !== 'undefined') {
      initializeSampleData()
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
} 