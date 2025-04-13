"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/basic/card";
import { AuthContext } from "@/app/providers";
import { toast } from "@/components/ui/feedback/use-toast";
import { extendedPalette } from "@/lib/colors";
import { SettingsHeader } from "@/components/Admin/Settings/SettingsHeader";
import { SettingsTabs } from "@/components/Admin/Settings/SettingsTabs";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  program: string;
}

/**
 * Renders a simplified admin settings page with theme selection and user access management.
 */
export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session, loading } = useContext(AuthContext);
  const router = useRouter();

  // Protect route - redirect if not admin
  useEffect(() => {
    if (!loading && (!session?.user || !session?.user?.isAdmin)) {
      router.push('/login');
    }
  }, [session, loading, router]);

  // Load users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      fetchUsers();
    }
  }, [session, fetchUsers]);

  // Handle user updates
  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <DashboardLayout isAdmin={true}>
      <div className="container py-6 px-4 mx-auto pb-24">
        <SettingsHeader 
          title="Settings"
          description="Manage your admin preferences and user access"
        />

        <Card 
          className="border shadow-lg overflow-hidden"
          style={{ borderColor: extendedPalette.lightBlue }}
        >
          <CardHeader 
            className="border-b"
            style={{ 
              backgroundColor: extendedPalette.offWhite,
              borderColor: extendedPalette.lightBlue 
            }}
          >
            <CardTitle 
              className="text-lg"
              style={{ color: extendedPalette.primaryBlue }}
            >
              Admin Settings
            </CardTitle>
            <CardDescription style={{ color: extendedPalette.darkGray }}>
              Customize your admin experience and manage user access
            </CardDescription>
          </CardHeader>

          <SettingsTabs 
            users={users}
            currentUserId={parseInt(session.user.id)}
            isLoading={isLoading}
            defaultTab="appearance"
            onUserUpdate={handleUserUpdate}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
