"use client"

import { createContext, useContext, useEffect } from "react"
import { initializeSampleData } from "@/lib/local-storage"

interface StorageContextType {
  initialized: boolean
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function useStorage() {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}

export function StorageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize sample data when the app starts
    if (typeof window !== 'undefined') {
      initializeSampleData()
    }
  }, [])

  return (
    <StorageContext.Provider value={{ initialized: true }}>
      {children}
    </StorageContext.Provider>
  )
} 