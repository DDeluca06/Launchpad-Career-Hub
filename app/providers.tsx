"use client";

import { ReactNode, createContext, useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { getClientSession } from "@/lib/auth-client";

// Create an auth context for Better Auth
export const AuthContext = createContext<{
  session: any;
  loading: boolean;
}>({
  session: null,
  loading: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        console.log('Loading session data...');
        const sessionData = await getClientSession();
        console.log('Session data loaded:', sessionData);
        setSession(sessionData);
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
    
    // Watch for URL changes that might indicate a need to refresh the session
    const handleRouteChange = () => {
      const url = window.location.href;
      if (url.includes('t=')) {
        console.log('Detected timestamp parameter, refreshing session...');
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
  );
}
