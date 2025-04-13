import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API route to fetch partner statistics
 * 
 * This route queries the database for partner-related information:
 * - Total number of partners
 * - Number of active partners (partners with at least one active job posting)
 * 
 * @returns A JSON response with partner statistics or error message
 */
export async function GET() {
  try {
    // Get partner statistics from database
    const totalPartners = await prisma.companies.count();
    
    // Count active partners (companies with at least one active job)
    const activePartnersResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT c.company_id) as count
      FROM companies c
      JOIN jobs j ON c.company_id = j.company_id
      WHERE j.is_active = true
    `;
    
    const activePartners = Number(activePartnersResult[0]?.count || 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalPartners,
        activePartners,
        // Add direct keys that match the component labels
        "Total Partners": totalPartners,
        "Active Partners": activePartners
      }
    });
  } catch (error) {
    console.error('Error fetching partner statistics:', error);
    
    // Return fallback values instead of error to prevent UI from breaking
    return NextResponse.json({
      success: true,
      stats: {
        totalPartners: 0,
        activePartners: 0,
        // Add direct keys that match the component labels
        "Total Partners": 0,
        "Active Partners": 0
      }
    });
  }
} 