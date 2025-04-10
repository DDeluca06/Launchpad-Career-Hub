import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

// Import enum types from Prisma schema
type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'APPRENTICESHIP' | 'INTERNSHIP';

// Valid job tags list as a constant
const JOB_TAGS = [
  'FULLY_REMOTE', 'HYBRID', 'IN_PERSON', 'FRONT_END', 'BACK_END', 'FULL_STACK',
  'NON_PROFIT', 'START_UP', 'EDUCATION', 'HEALTHCARE', 'FINTECH', 'MARKETING',
  'DATA_SCIENCE', 'CYBERSECURITY', 'UX_UI_DESIGN', 'IT', 'PRODUCT_MANAGEMENT',
  'GAME_DEVELOPMENT', 'AI_ML', 'CLOUD_COMPUTING', 'DEVOPS', 'BUSINESS_ANALYSIS',
  'SOCIAL_MEDIA'
];

/**
 * GET request handler to fetch a single job by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Fetch the job with application counts
    const job = await prisma.jobs.findUnique({
      where: { job_id: id },
      include: {
        _count: {
          select: {
            applications: true
          }
        },
        partners: true,
        applications: {
          select: {
            application_id: true,
            status: true,
            applied_at: true,
            users: {
              select: {
                user_id: true,
                first_name: true,
                last_name: true,
              }
            }
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Format the job for the frontend
    const formattedJob = {
      job_id: job.job_id,
      job_type: job.job_type,
      title: job.title,
      description: job.description,
      company: job.company || job.partners?.name || 'Unknown Company',
      website: job.website,
      location: job.location,
      partner_id: job.partner_id,
      created_at: job.created_at?.toISOString(),
      tags: job.tags,
      applications: job.applications,
      applicationCount: job._count.applications,
      partner: job.partners ? {
        name: job.partners.name,
        industry: job.partners.industry,
        location: job.partners.location
      } : null
    };

    return NextResponse.json({ success: true, job: formattedJob });
  } catch (error) {
    console.error(`Error fetching job ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler to update a job by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Check if job exists
    const existingJob = await prisma.jobs.findUnique({
      where: { job_id: id }
    });

    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Format tags to ensure they're valid JobTag enum values
    let tags = [];
    if (Array.isArray(body.tags)) {
      tags = body.tags.filter((tag: string) => 
        JOB_TAGS.includes(tag.toUpperCase().replace(/[- /]/g, '_'))
      ).map((tag: string) => tag.toUpperCase().replace(/[- /]/g, '_'));
    }

    // Update the job
    const updatedJob = await prisma.jobs.update({
      where: { job_id: id },
      data: {
        title: body.title || undefined,
        job_type: body.job_type as JobType || undefined,
        description: body.description || undefined,
        company: body.company || undefined,
        website: body.website || undefined,
        location: body.location || undefined,
        partner_id: body.partner_id || undefined,
        tags: tags.length > 0 ? tags : undefined,
        archived: body.archived !== undefined ? Boolean(body.archived) : undefined
      }
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error(`Error updating job ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler to delete a job by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await prisma.jobs.findUnique({
      where: { job_id: id }
    });

    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Delete the job
    await prisma.jobs.delete({
      where: { job_id: id }
    });

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error(`Error deleting job ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    );
  }
} 