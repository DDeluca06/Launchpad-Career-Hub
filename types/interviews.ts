export interface Interview {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location: string;
  applicant_id: string;
  job_id: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

export type NewInterview = Omit<Interview, 'id' | 'status' | 'created_at' | 'updated_at'>; 