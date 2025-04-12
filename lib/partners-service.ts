// Partner interface matching our database schema
export interface Partner {
  partner_id: number;
  name: string;
  description?: string;
  industry?: string;
  location?: string;
  website?: string;
  status?: 'active' | 'archived';
  is_archived?: boolean;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  partnership_start?: string;
  jobs_available?: number;
  applicants?: number;
  applicants_hired?: number;
}

// Partner API service
class PartnerService {
  private readonly apiUrl = '/api/partners';
  
  // Get all partners
  async getAll(): Promise<Partner[]> {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching partners:', data.error);
        return [];
      }
      
      return data.partners || [];
    } catch (error) {
      console.error('Error fetching partners:', error);
      return [];
    }
  }
  
  // Get a partner by ID
  async getById(id: number): Promise<Partner | null> {
    try {
      const response = await fetch(`${this.apiUrl}?partner_id=${id}`);
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching partner:', data.error);
        return null;
      }
      
      return data.partner || null;
    } catch (error) {
      console.error('Error fetching partner:', error);
      return null;
    }
  }
  
  // Create a new partner
  async create(partner: Omit<Partner, 'partner_id'>): Promise<Partner | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(partner)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error creating partner:', data.error);
        return null;
      }
      
      return data.partner || null;
    } catch (error) {
      console.error('Error creating partner:', error);
      return null;
    }
  }
  
  // Update a partner
  async update(id: number, partner: Partial<Partner>): Promise<Partner | null> {
    try {
      const response = await fetch(`${this.apiUrl}?partner_id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(partner)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error updating partner:', data.error);
        return null;
      }
      
      return data.partner || null;
    } catch (error) {
      console.error('Error updating partner:', error);
      return null;
    }
  }
  
  // Delete a partner
  async delete(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}?partner_id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error deleting partner:', data.error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting partner:', error);
      return false;
    }
  }
  
  // Toggle archive status (archive or restore)
  async toggleArchiveStatus(id: number): Promise<Partner | null> {
    try {
      // First get the current partner
      const partner = await this.getById(id);
      if (!partner) {
        return null;
      }
      
      // Toggle the archive status
      const updatedPartner = await this.update(id, {
        is_archived: !partner.is_archived
      });
      
      return updatedPartner;
    } catch (error) {
      console.error('Error toggling archive status:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const partnerService = new PartnerService(); 