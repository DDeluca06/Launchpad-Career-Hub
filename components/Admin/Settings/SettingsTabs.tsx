"use client";

import { User } from "./types";
import { UserAccessManager } from "./UserAccessManager";

interface SettingsTabsProps {
  users: User[];
  currentUserId: number;
  isLoading: boolean;
  onUserUpdate?: (updatedUser: User) => void;
}

/**
 * User management interface for administrator settings
 */
export function SettingsTabs({ 
  users, 
  currentUserId, 
  isLoading, 
  onUserUpdate
}: SettingsTabsProps) {
  return (
    <div className="p-6">
      <UserAccessManager 
        users={users} 
        currentUserId={currentUserId} 
        isLoading={isLoading} 
        onUserUpdate={onUserUpdate}
      />
    </div>
  );
} 