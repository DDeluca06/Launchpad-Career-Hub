import type React from "react";
import "@/app/globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Homepage - Job Portal",
  description:
    "Your gateway to career opportunities. Explore job listings, manage applications, and connect with top employers through the Launchpad Job Portal.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jobportal.launchpadphilly.org/",
    title: "Homepage - Job Portal",
    description:
      "Your gateway to career opportunities. Explore job listings, manage applications, and connect with top employers through the Launchpad Job Portal.",
    siteName: "Job Portal",
  },
  twitter: {
    card: "summary_large_image",
    site: "@LaunchpadPhilly",
  },
  alternates: {
    canonical: "https://jobportal.launchpadphilly.org/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <header className="flex items-center justify-center py-4"></header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "./globals.css";
