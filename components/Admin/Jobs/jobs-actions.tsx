import { JobType, JobTag } from './types';

// Define a type for the job import structure
interface ImportableJob {
  title: string;
  company_id: number;
  location: string;
  job_type: JobType;
  description: string;
  website: string;
  tags: JobTag[];
  partner_id?: number | null;
  logo?: string;
  salary?: string;
  application_link?: string;
  remote_status?: string;
  created_at?: string | Date;
}

export async function importJobs(jobs: ImportableJob[]) {
  try {
    const response = await fetch('/api/admin/jobs/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        jobs: jobs.map(job => ({
          ...job,
          partner_id: job.partner_id || null // Include partner_id or set to null
        })) 
      }),
    });

    if (!response.ok) {
      throw new Error('Error importing jobs');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error importing jobs:', error);
    throw error;
  }
} 