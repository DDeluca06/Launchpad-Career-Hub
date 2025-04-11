import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobType, JobTag, ApplicationStatus } from '@/lib/prisma-enums';

// Define a type for jobs with _count and partners relations
interface JobWithRelations {
  job_id: number;
  job_type: string;
  title: string;
  description: string | null;
  company: string;
  website: string | null;
  location: string | null;
  partner_id: number | null;
  created_at: Date | null;
  archived: boolean;
  tags: string[];
  _count: {
    applications: number;
  };
  partners?: {
    name: string;
  } | null;
  applications?: Array<{
    application_id: number;
    status: ApplicationStatus;
    user_id: number;
    job_id: number;
    applied_at: Date | null;
    status_updated: Date | null;
    resume_id: number | null;
    position: string | null;
  }>;
}

// Define a type for Prisma's job return type
type PrismaJobResult = {
  job_id: number;
  job_type: string;
  title: string;
  description: string | null;
  company: string;
  website: string | null;
  location: string | null;
  partner_id: number | null;
  created_at: Date | null;
  archived: boolean;
  tags: string[];
  _count: {
    applications: number;
  };
  partners?: {
    name: string;
  } | null;
  // Using Record<string, unknown>[] instead of any[] to satisfy the linter
  applications?: Record<string, unknown>[];
};

// Define type for job import data to use for importing jobs
export interface JobImportData {
  title: string;
  company: string;
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

      // Fetch the job with application counts
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
    }
    
    // If not fetching a single job, get all jobs with filters
    const jobType = searchParams.get('jobType');
    const locationFilter = searchParams.get('location');
    const tagFilter = searchParams.get('tag');
    const searchQuery = searchParams.get('search');
    const isRemote = searchParams.get('isRemote') === 'true';
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
            }
          }
        } : {})
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.error(`Found ${jobs.length} jobs`);

    // Format jobs for the frontend
    const formattedJobs = jobs.map((job: PrismaJobResult) => {
      // Create a job object that conforms to JobWithRelations interface
      const formattedJob: JobWithRelations = {
        job_id: job.job_id,
        job_type: job.job_type,
        title: job.title,
        description: job.description,
        company: job.company || job.partners?.name || 'Unknown Company',
        website: job.website,
        location: job.location,
        partner_id: job.partner_id,
        created_at: job.created_at,
        tags: job.tags,
        archived: job.archived,
        _count: {
          applications: job._count.applications
        },
        // Type assertion to satisfy TypeScript without changing the data
        applications: job.applications as JobWithRelations['applications']
      };
      
      // Return a formatted version with the date converted to string
      return {
        ...formattedJob,
        created_at: formattedJob.created_at?.toISOString(),
        // Ensure we always return an array for applications
        applications: formattedJob.applications || []
      };
    });

    return NextResponse.json({ success: true, jobs: formattedJobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to fetch jobs: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * POST request handler to create a new job listing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.company || !body.job_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate job type
    const validJobTypes = Object.values(JobType);
    if (!validJobTypes.includes(body.job_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job type' },
        { status: 400 }
      );
    }

    // Format tags to ensure they're valid JobTag enum values
    let tags: JobTag[] = [];
    if (Array.isArray(body.tags)) {
      tags = body.tags.filter((tag: string) => 
        Object.values(JobTag).includes(tag as JobTag)
      ) as JobTag[];
    }

    // Create the job
    const job = await prisma.jobs.create({
      data: {
        title: body.title,
        job_type: body.job_type as JobType,
        description: body.description || null,
        company: body.company,
        website: body.website || null,
        location: body.location || null,
        partner_id: body.partner_id || null,
        archived: false, // Default new jobs to not archived
        tags: tags
      },
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
        }
      }
    });

    // Format the response
    const formattedJob = {
      ...job,
      created_at: job.created_at?.toISOString(),
      _count: {
        applications: job._count.applications
      }
    };

    return NextResponse.json({ success: true, job: formattedJob });
  } catch (error) {
    console.error('Error creating job:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to create job: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler to update an existing job listing
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

    const body = await request.json();
    
    // Validate that we have data to update
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No update data provided' },
        { status: 400 }
      );
    }

    // Validate job type if provided
    if (body.job_type && !Object.values(JobType).includes(body.job_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job type' },
        { status: 400 }
      );
    }

    // Format tags if provided
    if (body.tags) {
      body.tags = Array.isArray(body.tags) 
        ? body.tags.filter((tag: string) => Object.values(JobTag).includes(tag as JobTag))
        : [];
    }

    // Create data object with only the provided fields
    const updateData: {
      title?: string;
      job_type?: JobType;
      description?: string | null;
      company?: string;
      website?: string | null;
      location?: string | null;
      tags?: JobTag[];
      archived?: boolean;
      partner_id?: number | null;
    } = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.job_type !== undefined) updateData.job_type = body.job_type as JobType;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.tags !== undefined) updateData.tags = body.tags as JobTag[];
    if (body.archived !== undefined) updateData.archived = body.archived;
    if (body.partner_id !== undefined) updateData.partner_id = body.partner_id;

    // Update the job
    const job = await prisma.jobs.update({
      where: { job_id: jobId },
      data: updateData,
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
        }
      }
    });

    // Format the response
    const formattedJob = {
      ...job,
      created_at: job.created_at?.toISOString(),
      _count: {
        applications: job._count.applications
      }
    };

    return NextResponse.json({ success: true, job: formattedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler to delete a job listing
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

    // Check if job exists
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
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    );
  }
} 