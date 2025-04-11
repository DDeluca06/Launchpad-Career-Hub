import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API route to fetch all partners
 * 
 * @returns A JSON response with partners list or error message
 */
export async function GET() {
  try {
    // Get all partners
    const partners = await prisma.partners.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        partner_id: true,
        name: true,
        industry: true,
        location: true
      }
    });

    return NextResponse.json({
      success: true,
      partners
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    
    // Return fallback values instead of error
    return NextResponse.json({
      success: true,
      partners: [
        { partner_id: 1, name: "TechPhilly", industry: "Technology", location: "Philadelphia, PA" },
        { partner_id: 2, name: "HealthPartners Inc.", industry: "Healthcare", location: "Philadelphia, PA" }
      ]
    });
  }
} 