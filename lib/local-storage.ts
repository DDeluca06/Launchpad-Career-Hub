// Job type definition from our schema
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'APPRENTICESHIP' | 'INTERNSHIP';

// Job interface that matches the expected structure used in the dashboard
export interface Job {
  job_id: number;
  title: string;
  company: string;
  location?: string;
  job_type?: JobType;
  description?: string;
  companyLogo?: string;
  tags?: string[];
  salary?: string;
  created_at?: string;
}

// LocalStorage service for job management
class JobService {
  private readonly storageKey = 'launchpad_jobs';

  constructor() {
    // Initialize with mock data if storage is empty
    if (typeof window !== 'undefined' && !localStorage.getItem(this.storageKey)) {
      this.initMockData();
    }
  }

  // Get all jobs
  getAll(): Job[] {
    if (typeof window === 'undefined') return [];
    
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Get a specific job by ID
  getById(id: number): Job | undefined {
    return this.getAll().find(job => job.job_id === id);
  }

  // Save a job
  save(job: Job): Job {
    const jobs = this.getAll();
    
    // Update if exists, otherwise add
    const index = jobs.findIndex(j => j.job_id === job.job_id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      // Generate a new ID if none exists
      if (!job.job_id) {
        job.job_id = Math.max(0, ...jobs.map(j => j.job_id)) + 1;
      }
      jobs.push(job);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(jobs));
    return job;
  }

  // Delete a job
  delete(id: number): void {
    const jobs = this.getAll();
    const filtered = jobs.filter(job => job.job_id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  // Initialize with mock data for demonstration
  private initMockData(): void {
    const mockJobs: Job[] = [
      {
        job_id: 1,
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Philadelphia, PA (Remote)",
        job_type: "FULL_TIME",
        description: "Building modern web applications using React and Next.js",
        tags: ["FRONT_END", "FULLY_REMOTE"],
        salary: "$80,000 - $100,000",
        created_at: new Date().toISOString()
      },
      {
        job_id: 2,
        title: "UX Designer",
        company: "Design Studio",
        location: "Boston, MA (On-site)",
        job_type: "FULL_TIME",
        description: "Design user interfaces and experiences for web and mobile applications",
        tags: ["UX_UI_DESIGN", "IN_PERSON"],
        salary: "$75,000 - $95,000",
        created_at: new Date().toISOString()
      },
      {
        job_id: 3,
        title: "Backend Engineer",
        company: "Data Inc.",
        location: "New York, NY (Hybrid)",
        job_type: "FULL_TIME",
        description: "Develop and maintain server-side applications and databases",
        tags: ["BACK_END", "HYBRID"],
        salary: "$90,000 - $120,000",
        created_at: new Date().toISOString()
      },
      {
        job_id: 4,
        title: "Product Manager",
        company: "Web Solutions",
        location: "Philadelphia, PA (On-site)",
        job_type: "FULL_TIME",
        description: "Lead product development and roadmap planning",
        tags: ["PRODUCT_MANAGEMENT", "IN_PERSON"],
        salary: "$95,000 - $115,000",
        created_at: new Date().toISOString()
      }
    ];

    localStorage.setItem(this.storageKey, JSON.stringify(mockJobs));
  }
}

// Export a singleton instance
export const jobService = new JobService(); 