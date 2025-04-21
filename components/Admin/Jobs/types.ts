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
  application_type: 'INTERNAL' | 'EXTERNAL';
  application_url: string | null;
  partners?: {
    name: string;
    industry?: string;
    location?: string;
    website_url?: string;
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
  keywords: string;
  tags: string[];
  partnerOnly: boolean;
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
  noCard?: boolean;
}

// Available job tags in the system
export const JOB_TAGS = [
  'Fully Remote', 'Hybrid', 'In Person', 'Front End', 'Back End', 
  'Full Stack', 'Non Profit', 'Start Up', 'Education', 'Healthcare', 
  'Fintech', 'Marketing', 'Data Science', 'Cybersecurity', 'UX UI Design', 
  'IT', 'Product Management', 'Game Development', 'AI ML', 'Cloud Computing', 
  'DevOps', 'Business Analysis', 'Social Media'
] as JobTag[];

// Available job types in the system
export const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'APPRENTICESHIP', 'INTERNSIP'] as JobType[];

// For new job creation
export interface NewJob {
  title: string;
  company_id: number;
  company?: string;
  location: string;
  job_type: JobType;
  description: string;
  website: string;
  tags: JobTag[];
  partner_id?: number | null;
} 
