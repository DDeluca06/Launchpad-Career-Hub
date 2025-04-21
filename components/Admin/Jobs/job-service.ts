import { NewJob } from "./types";

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
    console.error(`Fetching jobs with archived=${archived} and includeApplications=true`);
    
    // Add a timeout for the fetch operation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`/api/jobs?archived=${archived}&includeApplications=true`, {
      signal: controller.signal
    });
    
    // Clear the timeout once we have a response
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`API returned status: ${response.status}`);
      const errorText = await response.text().catch(() => 'No error text available');
      console.error(`Error details: ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if data.jobs exists and is an array
    if (!data.jobs || !Array.isArray(data.jobs)) {
      console.error('API returned invalid jobs data:', data);
      return [];
    }
    
    console.log(`Successfully fetched ${data.jobs.length} jobs`);
    return data.jobs;
  } catch (error: Error | unknown) {
    // Handle timeout error specifically
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Fetch timeout: The request took too long to complete');
    } else {
      console.error('Error fetching jobs by status:', error);
    }
    // Return empty array instead of logging error
    return [];
  }
}

export async function createJob(jobData: NewJob) {
  try {
    // Prepare the data for the API
    // If we have a company name, use it, otherwise use a fallback based on company_id
    const transformedData = {
      title: jobData.title,
      company: jobData.company || `Company ID: ${jobData.company_id}`, // Fallback if company name not provided
      job_type: jobData.job_type,
      description: jobData.description,
      location: jobData.location,
      website: jobData.website,
      partner_id: jobData.partner_id,
      tags: jobData.tags
    };
    
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
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
    // Transform the data to match what the API expects
    const transformedData = {
      title: jobData.title,
      company: jobData.company, // The company name is needed for the API
      job_type: jobData.job_type,
      description: jobData.description,
      location: jobData.location,
      website: jobData.website,
      partner_id: jobData.partner_id,
      tags: jobData.tags
    };
    
    const response = await fetch(`/api/jobs?id=${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
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