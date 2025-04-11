// Job-related types and interfaces for the Admin Jobs page

// Job type enum values
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'APPRENTICESHIP' | 'INTERNSHIP';

// Job tag enum values
export type JobTag = 'FULLY_REMOTE' | 'HYBRID' | 'IN_PERSON' | 'FRONT_END' | 'BACK_END' | 
              'FULL_STACK' | 'NON_PROFIT' | 'START_UP' | 'EDUCATION' | 'HEALTHCARE' | 
              'FINTECH' | 'MARKETING' | 'DATA_SCIENCE' | 'CYBERSECURITY' | 'UX_UI_DESIGN' | 
              'IT' | 'PRODUCT_MANAGEMENT' | 'GAME_DEVELOPMENT' | 'AI_ML' | 'CLOUD_COMPUTING' | 
              'DEVOPS' | 'BUSINESS_ANALYSIS' | 'SOCIAL_MEDIA';

// Extended Job type with additional UI-specific properties
export interface ExtendedJob {
  job_id: number;
  job_type: JobType;
  title: string;
  description: string | null;
  company: string;
  website: string | null;
  location: string | null;
  partner_id: number | null;
  created_at: Date | null;
  tags: JobTag[];
  partners?: {
    name: string;
  } | null;
  archived: boolean;
  // Add this for application count
  _count?: {
    applications: number;
  };
  // Add this for applications list
  applications?: Array<{
    application_id: number;
    status: string;
    applied_at: string | Date;
    users?: {
      user_id: number;
      first_name: string;
      last_name: string;
    };
  }>;
}

// Job filter interface for filtering jobs
export interface JobFilterInterface {
  jobTypes: string[];
  locations: string[];
  remoteOnly: boolean;
  salary: [number, number];
  experienceLevel: string;
  keywords: string;
  tags: string[];
  programs: string[];
}

// Job list component props
export interface JobListProps {
  jobs: ExtendedJob[];
  selectedJob: ExtendedJob | null;
  onSelectJob: (job: ExtendedJob) => void;
  applicationsCount: Record<string, number>;
  isLoading: boolean;
  searchQuery: string;
}

// Job details component props
export interface JobDetailsProps {
  job: ExtendedJob | null;
  applicationsCount: Record<string, number>;
  isLoading: boolean;
  onEdit: (job: ExtendedJob) => void;
  onArchive: () => void;
}

// Available job tags in the system
export const JOB_TAGS = [
  'FULLY_REMOTE', 'HYBRID', 'IN_PERSON', 'FRONT_END', 'BACK_END', 
  'FULL_STACK', 'NON_PROFIT', 'START_UP', 'EDUCATION', 'HEALTHCARE', 
  'FINTECH', 'MARKETING', 'DATA_SCIENCE', 'CYBERSECURITY', 'UX_UI_DESIGN', 
  'IT', 'PRODUCT_MANAGEMENT', 'GAME_DEVELOPMENT', 'AI_ML', 'CLOUD_COMPUTING', 
  'DEVOPS', 'BUSINESS_ANALYSIS', 'SOCIAL_MEDIA'
] as JobTag[];

// Available job types in the system
export const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'APPRENTICESHIP', 'INTERNSHIP'] as JobType[];

// For new job creation
export interface NewJob {
  title: string;
  company: string;
  location: string;
  job_type: JobType;
  description: string;
  website: string;
  tags: JobTag[];
  partner_id?: number | null;
} 