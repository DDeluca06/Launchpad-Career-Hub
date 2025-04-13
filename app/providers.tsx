"use client";

import { ReactNode, createContext, useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { getClientSession } from "@/lib/auth-client";
import { SessionProvider } from "next-auth/react";

// Define the session and user types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

interface Session {
  user: User | null;
}

// Create an auth context for Better Auth
export const AuthContext = createContext<{
  session: Session | null;
  loading: boolean;
}>({
  session: null,
  loading: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        console.error("Session loading...");
        const sessionData = await getClientSession();
        console.error("Session loaded:", sessionData);
        
        // Check if we have a valid user in the session
        if (sessionData?.user?.id) {
          setSession(sessionData);
          console.error("Valid user found in session:", sessionData.user.id);
        } else {
          console.error("No valid user in session, showing login form");
          setSession(null);
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
    
    // Watch for URL changes that might indicate a need to refresh the session
    const handleRouteChange = () => {
      const url = window.location.href;
      if (url.includes('t=')) {
        loadSession();
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    
    // Refresh session periodically
    const interval = setInterval(loadSession, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <SessionProvider>
      <AuthContext.Provider value={{ session, loading }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthContext.Provider>
    </SessionProvider>
  );
}
