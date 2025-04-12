import { ExtendedPartner, NewPartner } from "./types";

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
export const fetchPartnersByArchiveStatus = async (isArchived: boolean) => {
  try {
    const response = await fetch(`/api/partners?archived=${isArchived}`);
    if (!response.ok) {
      throw new Error('Failed to fetch partners');
    }
    const data = await response.json();
    return data.partners;
  } catch (error) {
    console.error('Error fetching partners:', error);
    throw error;
  }
};

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