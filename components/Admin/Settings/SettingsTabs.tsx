"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { Sun, UserCircle } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { UserAccessManager } from "./UserAccessManager";
import { extendedPalette } from "@/lib/colors";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  program: string;
}

interface SettingsTabsProps {
  users: User[];
  currentUserId: number;
  isLoading: boolean;
  defaultTab?: string;
  onUserUpdate?: (updatedUser: User) => void;
}

export function SettingsTabs({ 
  users, 
  currentUserId, 
  isLoading, 
  defaultTab = "appearance",
  onUserUpdate
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList 
        className="mx-6 mt-4 mb-0 border-b w-[400px]"
        style={{ backgroundColor: extendedPalette.offWhite, borderColor: extendedPalette.lightBlue }}
      >
        <TabsTrigger
          value="appearance"
          className="flex gap-2 items-center data-[state=active]:shadow-sm"
          style={{ 
            color: activeTab === "appearance" ? extendedPalette.primaryBlue : extendedPalette.darkGray,
            backgroundColor: activeTab === "appearance" ? "white" : "transparent"
          }}
        >
          <Sun className="h-4 w-4" />
          Appearance
        </TabsTrigger>
        <TabsTrigger
          value="userAccess"
          className="flex gap-2 items-center data-[state=active]:shadow-sm"
          style={{ 
            color: activeTab === "userAccess" ? extendedPalette.primaryBlue : extendedPalette.darkGray,
            backgroundColor: activeTab === "userAccess" ? "white" : "transparent"
          }}
        >
          <UserCircle className="h-4 w-4" />
          User Access
        </TabsTrigger>
      </TabsList>

      <TabsContent value="appearance" className="p-6 pt-6">
        <ThemeSwitcher />
      </TabsContent>

      <TabsContent value="userAccess" className="px-6 pt-6 pb-6">
        <UserAccessManager 
          users={users} 
          currentUserId={currentUserId} 
          isLoading={isLoading} 
          onUserUpdate={onUserUpdate}
        />
      </TabsContent>
    </Tabs>
  );
} 