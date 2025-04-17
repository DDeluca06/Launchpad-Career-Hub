import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API route to fetch company statistics
 * 
 * This route queries the database for company-related information:
 * - Total number of companies
 * - Number of active companies (companies with at least one active job posting)
 * 
 * @returns A JSON response with company statistics or error message
 */
export async function GET() {
  try {
    // Get company statistics from database
    const totalCompanies = await prisma.companies.count({
      where: {
        is_partner: true
      }
    });
    
    // Count active companies (companies with at least one active job)
    const activeCompaniesResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT c.company_id) as count
      FROM companies c
      JOIN jobs j ON c.name = j.company
      WHERE j.archived = false
      AND c.is_partner = true
    `;
    
    const activeCompanies = Number(activeCompaniesResult[0]?.count || 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalCompanies,
        activeCompanies,
        // Add direct keys that match the component labels
        "Total Partners": totalCompanies,
        "Active Partners": activeCompanies
      }
    });
  } catch (error) {
    console.error('Error fetching company statistics:', error);
    
    // Return fallback values instead of error to prevent UI from breaking
    return NextResponse.json({
      success: true,
      stats: {
        totalCompanies: 0,
        activeCompanies: 0,
        // Add direct keys that match the component labels
        "Total Partners": 0,
        "Active Partners": 0
      }
    });
  }
} 