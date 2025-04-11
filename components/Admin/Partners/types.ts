/**
 * Types for Partners components
 */

/**
 * Partner interface matching our database schema
 */
export interface Partner {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  websiteUrl: string;
  logoUrl?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Extended Partner with additional UI properties
 */
export interface ExtendedPartner extends Partner {
  partner_id?: number;
  is_archived?: boolean;
  jobs_available?: number;
  applicants?: number;
  applicants_hired?: number;
  partnership_start?: string;
  website?: string;
  logo_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  _count?: {
    jobs?: number;
  };
  jobs?: {
    job_id: number;
    title: string;
    company: string;
    archived: boolean;
    created_at?: string | Date;
  }[];
}

/**
 * New Partner for creation
 */
export interface NewPartner {
  name: string;
  description: string;
  industry: string;
  location: string;
  websiteUrl: string;
  logoUrl?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

/**
 * Partner Filter Interface
 */
export interface PartnerFilterInterface {
  industries: string[];
  locations: string[];
  keywords: string;
}

/**
 * Partner Details Props
 */
export interface PartnerDetailsProps {
  partner: ExtendedPartner | null;
  jobsCount: Record<number, number>;
  isLoading: boolean;
  onEdit: (partner: ExtendedPartner) => void;
  onArchive: () => void;
}

/**
 * Partner List Props
 */
export interface PartnerListProps {
  partners: ExtendedPartner[];
  selectedPartner: ExtendedPartner | null;
  onSelectPartner: (partner: ExtendedPartner) => void;
  jobsCount: Record<number, number>;
  isLoading: boolean;
  searchQuery: string;
}

/**
 * Available Industries
 */
export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Government",
  "Manufacturing",
  "Retail",
  "Transportation",
  "Nonprofit",
  "Design",
  "Marketing",
  "Legal",
  "Construction",
  "Hospitality",
  "Agriculture",
  "Entertainment",
];

export interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner?: Partner;
  onSuccess: () => void;
}

export interface PartnerFormData {
  name: string;
  description: string;
  industry: string;
  location: string;
  websiteUrl: string;
  logoUrl?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
} 