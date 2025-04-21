import { UIJob } from "./JobsList";
import { ApplicationStatus } from "@/lib/prisma-enums";

interface JobData {
  job_id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  job_type: string;
  tags?: string[];
  website?: string;
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchJobs(filters?: Record<string, string | boolean>): Promise<UIJob[]> {
  try {
    // Construct query parameters
    const queryParams = new URLSearchParams();
    
    // Add filters to the query parameters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(`/api/jobs?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch jobs');
    }
    
    // Transform API response to UIJob format
    const transformedJobs = data.jobs.map((job: JobData) => ({
      id: job.job_id.toString(),
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      jobType: formatJobType(job.job_type),
      experienceLevel: formatExperienceLevel(job.job_type),
      isRemote: job.location?.toLowerCase().includes('remote') || false,
      industry: job.tags?.find((tag: string) => tag !== 'FULLY_REMOTE' && tag !== 'HYBRID' && tag !== 'IN_PERSON') || '',
      salary: "Competitive",
      requirements: job.description?.split('\n').filter((line: string) => line.includes('requirement') || line.includes('qualification')) || [],
      responsibilities: job.description?.split('\n').filter((line: string) => line.includes('responsibilit')) || [],
      benefits: job.description?.split('\n').filter((line: string) => line.includes('benefit') || line.includes('perks')) || [],
      applicationDeadline: job.application_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      companyLogoUrl: "https://placehold.co/150",
      url: job.website || "#",
      qualifications: job.description?.split('\n').filter((line: string) => line.includes('requirement') || line.includes('qualification')) || []
    }));
    
    return transformedJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

export async function saveJob(userId: number, jobId: number, title: string): Promise<boolean> {
  try {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        job_id: jobId,
        status: "INTERESTED",
        position: title
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to save job');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
}

export async function removeJob(userId: number, jobId: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/applications/job?jobId=${jobId}&userId=${userId}`, {
      method: "DELETE",
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to remove job');
    }
    
    return true;
  } catch (error) {
    console.error('Error removing job:', error);
    throw error;
  }
}

export async function submitApplication(
  userId: number, 
  jobId: number, 
  resumeId: number, 
  position: string,
  userData: { firstName: string, lastName: string, email: string },
  coverLetter: string,
  idealCandidate: string
): Promise<{ application: { application_id: number, status: ApplicationStatus } }> {
  try {
    console.log('Submitting application with data:', {
      userId,
      jobId,
      resumeId,
      position,
      userData,
      coverLetter: coverLetter.substring(0, 20) + '...',
      idealCandidate: idealCandidate.substring(0, 20) + '...'
    });

    // Create application
    const applicationResponse = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        job_id: jobId,
        status: ApplicationStatus.APPLIED,
        resume_id: resumeId,
        position: position,
        cover_letter: coverLetter,
        ideal_candidate: idealCandidate
      }),
    });

    if (!applicationResponse.ok) {
      const errorData = await applicationResponse.json();
      console.error('Application submission failed:', errorData);
      
      // Handle specific error cases
      if (errorData.error && errorData.error.includes("already applied")) {
        throw new Error("You have already applied to this job");
      }
      
      throw new Error(errorData.error || 'Failed to create application');
    }
    
    const applicationData = await applicationResponse.json();
    console.log('Application submission response:', applicationData);
    
    if (!applicationData.success) {
      throw new Error(applicationData.error || 'Failed to create application');
    }
    
    // Update user profile if needed
    if (userData.firstName || userData.lastName || userData.email) {
      const profileResponse = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        }),
      });
      
      if (!profileResponse.ok) {
        console.warn('User profile update failed, but application was created');
      }
    }
    
    return { application: applicationData.application };
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
}

// Helper functions
function formatJobType(jobType: string): string {
  if (!jobType) return '';
  const formatted = jobType.replace(/_/g, ' ').toLowerCase();
  return formatted.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatExperienceLevel(jobType: string): string {
  // Basic logic to determine experience level from job type
  if (!jobType) return 'Mid-level';
  
  if (jobType.includes('INTERNSHIP')) {
    return 'Entry-level';
  } else if (jobType.includes('SENIOR')) {
    return 'Senior';
  } else if (jobType.includes('LEAD') || jobType.includes('HEAD')) {
    return 'Executive';
  } else {
    return 'Mid-level';
  }
} 