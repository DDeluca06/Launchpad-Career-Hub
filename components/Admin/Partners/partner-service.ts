import { ExtendedPartner, NewPartner, Partner } from "./types";

/**
 * Fetches partner listings from the API
 */
export const fetchPartners = async (): Promise<ExtendedPartner[]> => {
  try {
    const response = await fetch('/api/partners');
    
    if (!response.ok) {
      throw new Error('Failed to fetch partners');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching partners:', error);
    throw error;
  }
};

/**
 * Fetches partners with archived filter
 */
export const fetchPartnersByArchiveStatus = async (archived: boolean = false): Promise<ExtendedPartner[]> => {
  try {
    const response = await fetch(`/api/partners?is_archived=${archived}&includeJobs=true`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.partners;
  } catch (error) {
    console.error('Error fetching partners by status:', error);
    return generateFallbackPartners(archived);
  }
};

/**
 * Generates fallback partner data when API is unavailable
 */
function generateFallbackPartners(archived: boolean = false): ExtendedPartner[] {
  return [
    {
      partner_id: 1,
      name: "Tech Innovators Inc.",
      description: "Leading technology solutions provider",
      industry: "Technology",
      location: "San Francisco, CA",
      website_url: "https://techinnovators.com",
      contact_name: "John Smith",
      contact_email: "john@techinnovators.com",
      contact_phone: "+1 (555) 123-4567",
      created_at: new Date("2024-01-15").toISOString(),
      updated_at: new Date("2024-01-15").toISOString(),
      _count: {
        jobs: 5,
      },
      jobs_available: 5,
      applicants: 25,
      applicants_hired: 3,
      partnership_start: new Date("2024-01-01").toISOString(),
      jobs: [
        {
          job_id: 1,
          title: "Software Engineer",
          company: "Tech Innovators Inc.",
          archived: false,
          created_at: new Date("2024-01-15").toISOString(),
        },
      ],
    },
    {
      partner_id: 2,
      name: "Global Finance Group",
      description: "International financial services firm",
      industry: "Finance",
      location: "New York, NY",
      website_url: "https://globalfinance.com",
      contact_name: "Sarah Johnson",
      contact_email: "sarah@globalfinance.com",
      contact_phone: "+1 (555) 987-6543",
      created_at: new Date("2024-01-10").toISOString(),
      updated_at: new Date("2024-01-10").toISOString(),
      _count: {
        jobs: 3,
      },
      jobs_available: 3,
      applicants: 15,
      applicants_hired: 1,
      partnership_start: new Date("2024-01-01").toISOString(),
      jobs: [
        {
          job_id: 2,
          title: "Financial Analyst",
          company: "Global Finance Group",
          archived: false,
          created_at: new Date("2024-01-10").toISOString(),
        },
      ],
    },
    {
      partner_id: 3,
      name: "Healthcare Solutions Ltd",
      description: "Healthcare technology and services",
      industry: "Healthcare",
      location: "Boston, MA",
      website_url: "https://healthcaresolutions.com",
      contact_name: "Michael Brown",
      contact_email: "michael@healthcaresolutions.com",
      contact_phone: "+1 (555) 456-7890",
      created_at: new Date("2024-01-05").toISOString(),
      updated_at: new Date("2024-01-05").toISOString(),
      _count: {
        jobs: 4,
      },
      jobs_available: 4,
      applicants: 20,
      applicants_hired: 2,
      partnership_start: new Date("2024-01-01").toISOString(),
      jobs: [
        {
          job_id: 3,
          title: "Healthcare Data Analyst",
          company: "Healthcare Solutions Ltd",
          archived: false,
          created_at: new Date("2024-01-05").toISOString(),
        },
      ],
    },
  ];
}

/**
 * Creates a new partner
 */
export const createPartner = async (partnerData: NewPartner): Promise<ExtendedPartner> => {
  try {
    const response = await fetch('/api/partners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partnerData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to create partner');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating partner:', error);
    throw error;
  }
};

/**
 * Updates an existing partner
 */
export const updatePartner = async (partnerId: number, partnerData: Partial<NewPartner>): Promise<ExtendedPartner> => {
  try {
    const response = await fetch(`/api/partners?partner_id=${partnerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partnerData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update partner');
    }
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update partner');
    }
    
    return data.partner;
  } catch (error) {
    console.error(`Error updating partner with id ${partnerId}:`, error);
    throw error;
  }
};

/**
 * Gets job count for a partner
 */
export const getJobsCount = async (partnerId: number): Promise<number> => {
  try {
    const response = await fetch(`/api/partners/${partnerId}/jobs/count`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error getting job count:', error);
    return 0; // Default to 0 if error
  }
};

/**
 * Archives or unarchives a partner
 */
export const togglePartnerArchive = async (partnerId: number, archived: boolean): Promise<ExtendedPartner> => {
  try {
    const response = await fetch(`/api/partners?partner_id=${partnerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_archived: archived }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update partner archive status');
    }
    
    return data.partner;
  } catch (error) {
    console.error('Error toggling partner archive status:', error);
    throw error;
  }
};

// Fetch a single partner by ID
export const fetchPartnerById = async (partnerId: number): Promise<ExtendedPartner> => {
  try {
    const response = await fetch(`/api/partners?partner_id=${partnerId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch partner');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching partner with id ${partnerId}:`, error);
    throw error;
  }
};

// Delete a partner
export const deletePartner = async (partnerId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/partners?partner_id=${partnerId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to delete partner');
    }
  } catch (error) {
    console.error(`Error deleting partner with id ${partnerId}:`, error);
    throw error;
  }
}; 