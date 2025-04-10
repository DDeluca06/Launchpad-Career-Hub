import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/lib/prisma-enums';

/**
 * GET request handler to fetch all applications
 * Can be filtered by user_id or job_id via query params
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const id = searchParams.get('id'); // For single application

    // If ID is provided, fetch a single application
    if (id) {
      const appId = parseInt(id);
      
      if (isNaN(appId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid application ID' },
          { status: 400 }
        );
      }

      const application = await prisma.applications.findUnique({
        where: { application_id: appId },
        include: {
          users: {
            select: {
              first_name: true,
              last_name: true,
              username: true,
              is_admin: true,
              program: true
            }
          },
          jobs: {
            select: {
              title: true,
              company: true,
              location: true,
              job_type: true,
              tags: true
            }
          },
          resumes: {
            select: {
              file_name: true,
              file_path: true
            }
          },
          app_status_history: {
            orderBy: {
              changed_at: 'desc'
            }
          }
        }
      });

      if (!application) {
        return NextResponse.json(
          { success: false, error: 'Application not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, application });
    }

    // Define a type for the where clause to replace any
    const whereClause: {
      user_id?: number;
      job_id?: number;
      status?: string;
    } = {};

    if (userId) {
      whereClause.user_id = parseInt(userId);
    }

    if (jobId) {
      whereClause.job_id = parseInt(jobId);
    }

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const applications = await prisma.applications.findMany({
      where: whereClause,
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
            username: true,
            is_admin: true,
            program: true
          }
        },
        jobs: {
          select: {
            title: true,
            company: true,
            location: true,
            job_type: true,
            tags: true
          }
        },
        resumes: {
          select: {
            file_name: true,
            file_path: true
          }
        }
      },
      orderBy: {
        applied_at: 'desc'
      }
    });

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

/**
 * POST request handler to create a new application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.user_id || !body.job_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the user already applied to this job
    const existingApplication = await prisma.applications.findFirst({
      where: {
        user_id: body.user_id,
        job_id: body.job_id
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Create the application with default status APPLIED
    const application = await prisma.applications.create({
      data: {
        user_id: body.user_id,
        job_id: body.job_id,
        status: body.status || ApplicationStatus.APPLIED,
        position: body.position,
        resume_id: body.resume_id
      }
    });

    // Create application status history entry
    await prisma.app_status_history.create({
      data: {
        application_id: application.application_id,
        status: 'APPLIED'
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler to update an application
 */
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }
    
    const appId = parseInt(id);
    
    if (isNaN(appId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const newStatus = body.status?.toUpperCase() as ApplicationStatus;
    
    // Validate status
    const validStatuses = Object.values(ApplicationStatus);
    
    if (newStatus && !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application status' },
        { status: 400 }
      );
    }

    // Check if application exists
    const existingApplication = await prisma.applications.findUnique({
      where: { application_id: appId }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Don't update if status hasn't changed
    if (existingApplication.status === newStatus && !body.resume_id && !body.position) {
      return NextResponse.json({ 
        success: true, 
        message: 'No changes to apply',
        application: existingApplication
      });
    }

    // Update application with new status
    const updatedApplication = await prisma.applications.update({
      where: { application_id: appId },
      data: {
        status: newStatus || undefined,
        status_updated: newStatus ? new Date() : undefined,
        resume_id: body.resume_id || undefined,
        position: body.position || undefined
      }
    });

    // Create status history entry if status changed
    if (newStatus && existingApplication.status !== newStatus) {
      await prisma.app_status_history.create({
        data: {
          application_id: appId,
          status: 'APPLIED'
        }
      });
    }

    return NextResponse.json({ success: true, application: updatedApplication });
  } catch (error) {
    console.error(`Error updating application:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler to delete an application
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }
    
    const appId = parseInt(id);
    
    if (isNaN(appId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    // Check if application exists
    const existingApplication = await prisma.applications.findUnique({
      where: { application_id: appId }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Delete the application (status history will cascade delete)
    await prisma.applications.delete({
      where: { application_id: appId }
    });

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error(`Error deleting application:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete application' },
      { status: 500 }
    );
  }
} 