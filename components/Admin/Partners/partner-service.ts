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
  // Create some mock partners for development/fallback
  const mockPartners: ExtendedPartner[] = [
    {
      id: "1",
      name: "Tech Innovators",
      description: "A leading technology company focused on web development and AI solutions.",
      industry: "Technology",
      location: "Philadelphia, PA",
      websiteUrl: "techinnovators.com",
      logoUrl: "",
      contactName: "Sarah Johnson",
      contactEmail: "sjohnson@techinnovators.com",
      contactPhone: "(215) 555-1234",
      createdAt: "2021-03-15",
      updatedAt: "2022-01-10",
      _count: { jobs: 8 },
      jobs: [
        {
          job_id: 1,
          title: "Frontend Developer",
          company: "Tech Innovators",
          archived: false
        }
      ]
    },
    {
      id: "2",
      name: "Creative Solutions",
      description: "Digital design and creative agency specializing in UX/UI design.",
      industry: "Design",
      location: "Philadelphia, PA",
      websiteUrl: "creativesolutions.co",
      logoUrl: "",
      contactName: "Michael Chen",
      contactEmail: "mchen@creativesolutions.com",
      contactPhone: "(215) 555-5678",
      createdAt: "2020-11-01",
      updatedAt: "2022-01-05",
      _count: { jobs: 4 },
      jobs: [
        {
          job_id: 2,
          title: "UX Designer",
          company: "Creative Solutions",
          archived: false
        }
      ]
    },
    {
      id: "3",
      name: "DataWorks",
      description: "Data analytics and machine learning services for businesses.",
      industry: "Data Science",
      location: "King of Prussia, PA",
      websiteUrl: "dataworks.io",
      logoUrl: "",
      contactName: "Alicia Rodriguez",
      contactEmail: "arodriguez@dataworks.io",
      contactPhone: "(610) 555-9876",
      createdAt: "2022-01-10",
      updatedAt: "2022-02-15",
      _count: { jobs: 6 },
      jobs: [
        {
          job_id: 3,
          title: "Data Scientist",
          company: "DataWorks",
          archived: true
        }
      ]
    }
  ];
  
  // Filter by archived status based on jobs
  return mockPartners.filter(partner => 
    partner.jobs?.some(job => job.archived === archived) || false
  );
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
export const updatePartner = async (id: string, partnerData: Partial<NewPartner>): Promise<ExtendedPartner> => {
  try {
    const response = await fetch(`/api/partners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partnerData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to update partner');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating partner with id ${id}:`, error);
    throw error;
  }
};

/**
 * Gets job count for a partner
 */
export const getJobsCount = async (partnerId: string): Promise<number> => {
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
export const togglePartnerArchive = async (partnerId: string, archived: boolean): Promise<ExtendedPartner> => {
  try {
    const response = await fetch(`/api/partners/${partnerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ archived }), // Update property name to match backend
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling partner archive status:', error);
    throw error;
  }
};

// Fetch a single partner by ID
export const fetchPartnerById = async (id: string): Promise<ExtendedPartner> => {
  try {
    const response = await fetch(`/api/partners/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch partner');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching partner with id ${id}:`, error);
    throw error;
  }
};

// Delete a partner
export const deletePartner = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/partners/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to delete partner');
    }
  } catch (error) {
    console.error(`Error deleting partner with id ${id}:`, error);
    throw error;
  }
}; 