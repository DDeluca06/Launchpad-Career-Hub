export interface Interview {
  interview_id: number;
  user_id: number;
  title: string;
  description: string | null;
  location: string;
  start_time: string;
  end_time: string;
  candidate_name: string;
  position: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface NewInterview {
  title: string;
  description?: string;
  location: string;
  start_time: string;
  end_time: string;
  candidate_name: string;
  position: string;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  interviews: Interview[];
} 