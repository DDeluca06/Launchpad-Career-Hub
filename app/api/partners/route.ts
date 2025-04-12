import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Partner {
  partner_id: number;
  name: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  website_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: Date;
  updated_at: Date;
  is_archived: boolean;
  jobs?: {
    job_id: number;
    title: string;
    company: string;
    location: string | null;
    job_type: string | null;
    created_at: Date;
    _count?: {
      applications: number;
    };
  }[];
}

/**
 * API route to fetch all partners or a specific partner by ID
 * 
 * @param req Request object with optional partner_id query parameter
 * @returns A JSON response with partners list, single partner, or error message
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partner_id');
    
    if (partnerId) {
      // Get specific partner
      const id = parseInt(partnerId);
      if (isNaN(id)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid partner ID'
        }, { status: 400 });
      }
      
      const partner = await prisma.partners.findUnique({
        where: { partner_id: id },
        include: {
          jobs: searchParams.get('jobs') === 'true' ? {
            where: { archived: false },
            select: {
              job_id: true,
              title: true,
              company: true,
              location: true,
              job_type: true,
              created_at: true,
              _count: {
                select: {
                  applications: true
                }
              }
            },
            orderBy: {
              created_at: 'desc'
            }
          } : undefined
        }
      });
      
      if (!partner) {
        return NextResponse.json({
          success: false,
          error: 'Partner not found'
        }, { status: 404 });
      }
      
      // Add default status field based on is_archived
      const partnerWithStatus = {
        ...partner,
        status: partner.is_archived ? 'archived' : 'active',
        jobs: partner.jobs?.map((job: { 
          job_id: number;
          title: string;
          company: string;
          location: string;
          job_type: string;
          created_at: string;
          _count?: { applications: number };
        }) => ({
          job_id: job.job_id,
          title: job.title,
          company: job.company || partner.name,
          location: job.location,
          job_type: job.job_type || 'Full-time',
          created_at: job.created_at,
          applications_count: job._count?.applications || 0
        }))
      };
      
      return NextResponse.json({
        success: true,
        partner: partnerWithStatus
      });
    } else {
      // Get all partners
      const partners = await prisma.partners.findMany({
        orderBy: {
          name: 'asc'
        },
        include: {
          jobs: {
            where: { archived: false },
            select: {
              job_id: true,
              title: true,
              company: true,
              archived: true,
              created_at: true
            }
          }
        }
      });
      
      // Add default status field based on is_archived for each partner
      const partnersWithStatus = partners.map((partner: Partner) => ({
        ...partner,
        status: partner.is_archived ? 'archived' : 'active'
      }));

      return NextResponse.json({
        success: true,
        partners: partnersWithStatus
      });
    }
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch partners'
    }, { status: 500 });
  }
}

/**
 * API route to create a new partner
 * 
 * @param req Request with partner data
 * @returns A JSON response with created partner or error message
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const is_archived = body.status === 'archived';
    
    const partner = await prisma.partners.create({
      data: {
        name: body.name,
        description: body.description,
        industry: body.industry,
        location: body.location,
        jobs_available: body.jobs_available || 0,
        applicants: body.applicants || 0,
        applicants_hired: body.applicants_hired || 0,
        is_archived: is_archived
      }
    });

    // Add status field for response
    const partnerWithStatus = {
      ...partner,
      status: is_archived ? 'archived' : 'active'
    };
    
    return NextResponse.json({
      success: true,
      partner: partnerWithStatus
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create partner'
    }, { status: 500 });
  }
}

/**
 * API route to update a partner
 * 
 * @param req Request with partner data and partner_id query parameter
 * @returns A JSON response with updated partner or error message
 */
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partner_id');
    
    if (!partnerId) {
      return NextResponse.json({
        success: false,
        error: 'Partner ID is required'
      }, { status: 400 });
    }
    
    const id = parseInt(partnerId);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid partner ID'
      }, { status: 400 });
    }
    
    const body = await req.json();
    
    // Check if partner exists
    const existingPartner = await prisma.partners.findUnique({
      where: { partner_id: id }
    });
    
    if (!existingPartner) {
      return NextResponse.json({
        success: false,
        error: 'Partner not found'
      }, { status: 404 });
    }
    
    // Map status to is_archived
    const is_archived = body.status === 'archived';
    
    // Update partner
    const updatedPartner = await prisma.partners.update({
      where: { partner_id: id },
      data: {
        name: body.name,
        description: body.description,
        industry: body.industry,
        location: body.location,
        jobs_available: body.jobs_available !== undefined ? body.jobs_available : undefined,
        applicants: body.applicants !== undefined ? body.applicants : undefined,
        applicants_hired: body.applicants_hired !== undefined ? body.applicants_hired : undefined,
        is_archived: is_archived,
        jobs: {
          updateMany: {
            where: { partner_id: id },
            data: { archived: is_archived }
          }
        }
      },
      include: {
        jobs: true
      }
    });
    
    // Add status field for response
    const updatedPartnerWithStatus = {
      ...updatedPartner,
      status: is_archived ? 'archived' : 'active'
    };
    
    return NextResponse.json({
      success: true,
      partner: updatedPartnerWithStatus
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update partner'
    }, { status: 500 });
  }
}

/**
 * API route to delete a partner
 * 
 * @param req Request with partner_id query parameter
 * @returns A JSON response with success or error message
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partner_id');
    
    if (!partnerId) {
      return NextResponse.json({
        success: false,
        error: 'Partner ID is required'
      }, { status: 400 });
    }
    
    const id = parseInt(partnerId);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid partner ID'
      }, { status: 400 });
    }
    
    // Check if partner exists
    const existingPartner = await prisma.partners.findUnique({
      where: { partner_id: id }
    });
    
    if (!existingPartner) {
      return NextResponse.json({
        success: false,
        error: 'Partner not found'
      }, { status: 404 });
    }
    
    // Delete partner
    await prisma.partners.delete({
      where: { partner_id: id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete partner'
    }, { status: 500 });
  }
} 