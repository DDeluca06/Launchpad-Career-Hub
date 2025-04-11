import { Partner, NewPartner } from "./types";

/**
 * Fetch all partners from the API
 * @returns A list of partners
 */
export async function getPartners(): Promise<Partner[]> {
  try {
    const response = await fetch("/api/partners");
    
    if (!response.ok) {
      throw new Error(`Error fetching partners: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch partners:", error);
    throw error;
  }
}

/**
 * Fetch a partner by ID
 * @param id The partner ID
 * @returns The partner data
 */
export async function getPartnerById(id: string): Promise<Partner> {
  try {
    const response = await fetch(`/api/partners/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching partner: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch partner with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new partner
 * @param partnerData The partner data to create
 * @returns The created partner
 */
export async function createPartner(partnerData: NewPartner): Promise<Partner> {
  try {
    const response = await fetch("/api/partners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partnerData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating partner: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to create partner:", error);
    throw error;
  }
}

/**
 * Update an existing partner
 * @param partnerData The partner data to update
 * @returns The updated partner
 */
export async function updatePartner(partnerData: Partner): Promise<Partner> {
  try {
    const { id } = partnerData;
    
    const response = await fetch(`/api/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partnerData),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating partner: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to update partner:", error);
    throw error;
  }
}

/**
 * Delete a partner
 * @param id The partner ID to delete
 * @returns void
 */
export async function deletePartner(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/partners/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting partner: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Failed to delete partner with ID ${id}:`, error);
    throw error;
  }
} 