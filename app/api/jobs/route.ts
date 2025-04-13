import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobType, JobTag } from '@/lib/prisma-enums';

// Define type for job import data to use for importing jobs
export interface JobImportData {
  title: string;
  company_id: number;
  location?: string;
  description?: string;
  job_type?: string;
  website?: string;
  tags?: string[];
  partner_id?: number | null;
}

/**
 * GET request handler to fetch jobs
 * Can get a single job by id or list all jobs with filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Check if this is a request for a single job
    const id = searchParams.get('id');
    
    if (id) {
      const jobId = parseInt(id);
      
      if (isNaN(jobId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid job ID' },
          { status: 400 }
        );
      }

      // Fetch the job with application counts and relations
      const job = await prisma.jobs.findUnique({
        where: { job_id: jobId },
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
        company: job.company,
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
    }
    
    // If not fetching a single job, get all jobs with filters
    const jobType = searchParams.get('jobType');
    const locationFilter = searchParams.get('location');
    const tagFilter = searchParams.get('tag');
    const searchQuery = searchParams.get('search');
    const isRemote = searchParams.get('isRemote') === 'true';
    const partnerOnly = searchParams.get('partnerOnly') === 'true';
    const includeApplications = searchParams.get('includeApplications') === 'true';
    
    // Parse the archived parameter with proper boolean conversion
    const archived = searchParams.get('archived');
    const isArchived = archived === 'true' ? true : archived === 'false' ? false : undefined;

    // Prepare the where clause for Prisma
    const whereClause: {
      partner_id?: number | null;
      archived?: boolean;
      job_type?: JobType;
      location?: {
        contains: string;
        mode: 'insensitive';
      };
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
        company?: { contains: string; mode: 'insensitive' };
      }>;
      tags?: {
        hasSome: JobTag[];
      };
      companies?: {
        is_partner?: boolean;
      };
    } = {};

    // Add archived filter if specified (for admin views)
    if (isArchived !== undefined) {
      whereClause.archived = isArchived;
    }

    // Add job type filter if specified
    if (jobType) {
      whereClause.job_type = jobType as JobType;
    }

    // Add location filter if specified
    if (locationFilter) {
      whereClause.location = {
        contains: locationFilter,
        mode: 'insensitive'
      };
    }

    // Add remote filter if specified
    if (isRemote) {
      whereClause.location = {
        contains: 'remote',
        mode: 'insensitive'
      };
    }

    // Add partner only filter
    if (partnerOnly) {
      console.warn('Partner-only filter not implemented due to schema changes');
    }

    // Add search query if specified
    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { company: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    // Add tag filter if specified
    if (tagFilter) {
      whereClause.tags = {
        hasSome: [tagFilter as JobTag]
      };
    }

    console.error('Fetching jobs with where clause:', JSON.stringify(whereClause));

    // Fetch jobs with their application counts and optionally application details
    const jobs = await prisma.jobs.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            applications: true
          }
        },
        partners: {
          select: {
            name: true
          }
        },
        ...(includeApplications ? {
          applications: {
            select: {
              application_id: true,
              status: true,
              applied_at: true,
              users: {
                select: {
                  user_id: true,
                  first_name: true,
                  last_name: true
                }
              }
            },
            take: 100 // Limit the number of applications returned to prevent large payloads
          }
        } : {})
      },
      orderBy: [
        { archived: 'asc' },
        { created_at: 'desc' }
      ]
    });

    // Format the jobs for the frontend
    const formattedJobs = jobs.map((job) => {
      return {
        job_id: job.job_id,
        job_type: job.job_type,
        title: job.title,
        description: job.description,
        company: job.company, // Use the direct company string field
        website: job.website,
        location: job.location,
        partner_id: job.partner_id,
        created_at: job.created_at?.toISOString(),
        tags: job.tags,
        applications: job.applications || [],
        applicationCount: job._count.applications,
        partners: job.partners,
        archived: job.archived
      };
    });

    return NextResponse.json({ success: true, jobs: formattedJobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while fetching jobs' },
      { status: 500 }
    );
  }
}

/**
 * POST request handler to create a new job
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check required fields
    if (!data.title || !data.company || !data.job_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, company, and job_type are required' },
        { status: 400 }
      );
    }
    
    // Create the job
    const job = await prisma.jobs.create({
      data: {
        title: data.title,
        company: data.company,
        job_type: data.job_type as JobType,
        description: data.description || null,
        location: data.location || null,
        website: data.website || null,
        partner_id: data.partner_id || null,
        tags: data.tags || [],
      },
      include: {
        partners: {
          select: {
            name: true
          }
        }
      }
    });
    
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while creating the job' },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler to update a job
 * Can update any job field and also handle archive/unarchive
 */
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const jobId = parseInt(id);
    
    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }
    
    // Check if the job exists
    const existingJob = await prisma.jobs.findUnique({
      where: { job_id: jobId }
    });
    
    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    
    // Update the job
    const updatedJob = await prisma.jobs.update({
      where: { job_id: jobId },
      data: {
        title: data.title,
        company: data.company,
        job_type: data.job_type as JobType,
        description: data.description,
        location: data.location,
        website: data.website,
        partner_id: data.partner_id,
        tags: data.tags,
        archived: data.archived !== undefined ? data.archived : existingJob.archived,
      },
      include: {
        partners: {
          select: {
            name: true
          }
        }
      }
    });
    
    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating the job' },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler to delete a job
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const jobId = parseInt(id);
    
    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }
    
    // Check if the job exists
    const existingJob = await prisma.jobs.findUnique({
      where: { job_id: jobId }
    });
    
    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Delete the job
    await prisma.jobs.delete({
      where: { job_id: jobId }
    });
    
    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while deleting the job' },
      { status: 500 }
    );
  }
} 