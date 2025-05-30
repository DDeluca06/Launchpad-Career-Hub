  import type React from "react";
  import "@/app/globals.css";
  import { Providers } from "./providers";
  import type { Metadata } from "next";
  import { Inter } from "next/font/google";

  const inter = Inter({ subsets: ["latin"] });

  export const metadata: Metadata = {
    title: "Launchpad Job Portal",
    description: "Discover jobs and manage your job applications with the Launchpad Career Hub",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://jobportal.launchpadphilly.org/",
      title: "Homepage - Job Portal",
      description:
        "Your gateway to career opportunities. Explore job listings, manage applications, and connect with top employers through the Launchpad Job Portal.",
      siteName: "Launchpad Job Portal",
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
        <head>
          <script dangerouslySetInnerHTML={{
            __html: `
              // Prevent form submissions that might cause page refresh
              document.addEventListener('submit', function(e) {
                // Only prevent default for forms without explicit action
                if (!e.target.action) {
                  e.preventDefault();
                  console.log('Form submission prevented');
                }
              });
              
              // Catch any navigation attempts from buttons
              document.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON' && !e.target.type) {
                  e.target.type = 'button'; // Default to button type
                }
              });
            `
          }} />
        </head>
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }

  import "./globals.css";
