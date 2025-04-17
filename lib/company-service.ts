import { prisma } from './prisma';

// Company interface matching our schema
export interface Company {
  company_id: number;
  name: string;
  description?: string | null;
  website?: string | null;
  industry?: string | null;
  location?: string | null;
  logo_url?: string | null;
  is_partner: boolean;
  created_at?: Date | null;
  updated_at?: Date | null;
}

// For creating a new company
export interface NewCompany {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  logo_url?: string;
  is_partner: boolean;
}

/**
 * Fetches all companies from the database
 */
export async function fetchCompanies() {
  try {
    const companies = await prisma.companies.findMany({
      orderBy: { name: 'asc' },
    });
    return companies;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}

/**
 * Fetches a single company by ID
 */
export async function getCompanyById(id: number) {
  try {
    const company = await prisma.companies.findUnique({
      where: { company_id: id },
    });
    return company;
  } catch (error) {
    console.error(`Error fetching company with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches companies that match the given name (case-insensitive)
 * Used for preventing duplicates
 */
export async function findCompanyByName(name: string) {
  try {
    // Use a case-insensitive search
    const companies = await prisma.companies.findMany({
      where: {
        name: {
          mode: 'insensitive',
          equals: name,
        },
      },
    });
    return companies;
  } catch (error) {
    console.error(`Error finding company with name ${name}:`, error);
    throw error;
  }
}

/**
 * Creates a new company
 */
export async function createCompany(companyData: NewCompany) {
  try {
    // First check if a company with this name already exists (case insensitive)
    const existingCompanies = await findCompanyByName(companyData.name);
    
    if (existingCompanies.length > 0) {
      // Return the existing company if one is found
      return {
        success: false,
        message: `A company with the name "${companyData.name}" already exists`,
        company: existingCompanies[0],
      };
    }
    
    // Create the company if no duplicates exist
    const company = await prisma.companies.create({
      data: companyData,
    });
    
    return {
      success: true,
      message: 'Company created successfully',
      company,
    };
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

/**
 * Updates an existing company
 */
export async function updateCompany(id: number, companyData: Partial<NewCompany>) {
  try {
    // If name is being updated, check for duplicates
    if (companyData.name) {
      const existingCompanies = await findCompanyByName(companyData.name);
      
      // If we found a company with this name that's not the one we're updating
      const duplicate = existingCompanies.find((c: { company_id: number }) => c.company_id !== id);
      
      if (duplicate) {
        return {
          success: false,
          message: `A company with the name "${companyData.name}" already exists`,
          company: duplicate,
        };
      }
    }
    
    const company = await prisma.companies.update({
      where: { company_id: id },
      data: companyData,
    });
    
    return {
      success: true,
      message: 'Company updated successfully',
      company,
    };
  } catch (error) {
    console.error(`Error updating company with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Links a company to a partner
 */
export async function linkCompanyToPartner(companyId: number, partnerId: number) {
  try {
    const company = await prisma.companies.update({
      where: { company_id: companyId },
      data: { is_partner: true },
    });
    
    return {
      success: true,
      message: 'Company linked to partner successfully',
      company,
    };
  } catch (error) {
    console.error(`Error linking company ${companyId} to partner ${partnerId}:`, error);
    throw error;
  }
} 