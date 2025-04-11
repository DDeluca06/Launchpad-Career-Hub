/**
 * Applicant data with details for UI display
 */
export interface ApplicantWithDetails {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  applications: number;
  status: string;
  createdAt: string;
  program: string;
  isArchived?: boolean;
}

/**
 * Job application details for an applicant
 */
export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
}

/**
 * Data for a new user creation
 */
export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  program: string;
}

/**
 * Statistics about applicants
 */
export interface ApplicantStats {
  total: number;
  unapplied: number;
  interview: number;
  placed: number;
  archived: number;
}

/**
 * Filter options for the applicants page
 */
export interface FilterOptions {
  status: string[];
  program: string[];
  date: string;
  sort?: string;
  sortDir?: 'asc' | 'desc';
  minApplications?: number;
  keywords?: string;
  showInactive?: boolean;
  showArchived?: boolean;
} 