import type React from "react"
import "@/app/globals.css"
import { Providers } from "./providers"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Launchpad Career Hub",
  description: "Find and manage job applications for Launchpad program participants",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <header className="flex items-center justify-center py-4">
          {/* Logo removed from here */}
        </header>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'