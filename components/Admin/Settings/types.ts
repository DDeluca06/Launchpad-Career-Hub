/**
 * User interface for the settings components
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  program: string;
}

/**
 * Base props for any settings content component
 */
export interface SettingsContentProps {
  isLoading?: boolean;
}

/**
 * Props for the user access settings
 */
export interface UserAccessSettingsProps extends SettingsContentProps {
  users: User[];
  currentUserId: number;
  onUserUpdate?: (updatedUser: User) => void;
}

/**
 * Common types for settings components
 */

export interface ProfileSettingsProps {
  isLoading?: boolean;
}

export interface SecuritySettingsProps {
  isLoading?: boolean;
}

export interface NotificationSettingsProps {
  isLoading?: boolean;
}

export interface AppearanceSettingsProps {
  isLoading?: boolean;
} 