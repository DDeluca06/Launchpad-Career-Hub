export type SubStage =
  | 'phone_screening'
  | 'interview_stage'
  | 'final_interview_stage'
  | 'negotiation'
  | 'offer_extended'
  | 'accepted'
  | 'rejected'
  | null;

export type Stage =
  | 'interested'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'referrals';

// Task type definition for the Kanban board
export interface JobApplication {
  id: string;
  title: string;
  company: string;
  description: string;
  stage: Stage;
  subStage: SubStage;
  status: 'interested' | 'applied' | 'interview' | 'offer' | 'referrals';
  date?: string;
  tags?: string[];
  archived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  logo?: string;
  location?: string;
  salary?: string;
  url?: string;
  notes?: string;
}
