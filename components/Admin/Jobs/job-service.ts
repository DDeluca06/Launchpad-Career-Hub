import { ExtendedJob, NewJob } from "./types";

/**
 * Fetches job listings from the API
 */
export async function fetchJobs() {
  try {
    const response = await fetch('/api/jobs');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

/**
 * Fetches jobs with archived filter
 */
export async function fetchJobsByArchiveStatus(archived: boolean = false) {
  try {
    const response = await fetch(`/api/jobs?archived=${archived}&includeApplications=true`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.jobs;
  } catch (error) {
    console.error('Error fetching jobs by status:', error);
    
    // Return fallback data if API fails
    return generateFallbackJobs(archived);
  }
}

/**
 * Generates fallback job data when API is unavailable
 */
function generateFallbackJobs(archived: boolean = false): ExtendedJob[] {
  // Create some mock jobs for development/fallback
  const mockJobs: ExtendedJob[] = [
    {
      job_id: 1,
      title: "Frontend Developer",
      company: "TechCo",
      description: "Building modern web applications using React and Next.js",
      location: "Philadelphia, PA (Remote)",
      website: "https://example.com/jobs/1",
      job_type: "FULL_TIME",
      archived: false,
      created_at: new Date(),
      tags: ["FRONT_END", "FULLY_REMOTE"],
      _count: { applications: 5 },
      partner_id: null
    },
    {
      job_id: 2,
      title: "Data Science Intern",
      company: "Analytics Inc",
      description: "Assist with data analysis and machine learning projects",
      location: "New York, NY (Hybrid)",
      website: "https://example.com/jobs/2",
      job_type: "INTERNSHIP",
      archived: false,
      created_at: new Date(),
      tags: ["DATA_SCIENCE", "HYBRID"],
      _count: { applications: 3 },
      partner_id: null
    },
    {
      job_id: 3,
      title: "UX Designer",
      company: "Design Studio",
      description: "Design user interfaces and experiences for web and mobile applications",
      location: "Boston, MA (On-site)",
      website: "https://example.com/jobs/3",
      job_type: "FULL_TIME",
      archived: true,
      created_at: new Date(),
      tags: ["UX_UI_DESIGN", "IN_PERSON"],
      _count: { applications: 0 },
      partner_id: null
    }
  ];
  
  // Filter by archived status
  return mockJobs.filter(job => job.archived === archived);
}

/**
 * Creates a new job listing
 */
export async function createJob(jobData: NewJob) {
  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

/**
 * Updates an existing job
 */
export async function updateJob(jobId: number, jobData: Partial<NewJob>) {
  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

/**
 * Archives or unarchives a job
 */
export async function toggleJobArchive(jobId: number, archived: boolean) {
  try {
    const response = await fetch(`/api/jobs?id=${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ archived }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling job archive status:', error);
    throw error;
  }
}

/**
 * Gets job applications count
 */
export async function getApplicationCount(jobId: number) {
  try {
    const response = await fetch(`/api/jobs/${jobId}/applications/count`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error getting application count:', error);
    return 0; // Default to 0 if error
  }
} 