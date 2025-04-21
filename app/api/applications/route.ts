import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/lib/prisma-enums';

/**
 * GET request handler to fetch all applications or a single application
 * Can be filtered by user_id, job_id, status, or application_id via query params
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const applicationId = searchParams.get('applicationId');

    // If applicationId is provided, fetch a single application
    if (applicationId) {
      const appId = parseInt(applicationId);
      
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
              user_id: true,
              first_name: true,
              last_name: true,
              is_active: true,
              is_archived: true,
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

    // Define a type for the where clause
    const whereClause: {
      user_id?: number;
      job_id?: number;
      status?: ApplicationStatus;
    } = {};

    if (userId) {
      whereClause.user_id = parseInt(userId);
    }

    if (jobId) {
      whereClause.job_id = parseInt(jobId);
    }

    if (status) {
      whereClause.status = status.toUpperCase() as ApplicationStatus;
    }

    const applications = await prisma.applications.findMany({
      where: whereClause,
      include: {
        users: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            is_active: true,
            is_archived: true,
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
    const { user_id, job_id, status, resume_id, position, cover_letter, ideal_candidate } = body;
    
    if (!user_id || !job_id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: user_id, job_id, status' },
        { status: 400 }
      );
    }
    
    // Check if application already exists
    const existingApplication = await prisma.applications.findFirst({
      where: {
        user_id: user_id,
        job_id: job_id
      }
    });
    
    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'User has already applied for this job' },
        { status: 400 }
      );
    }
    
    // Create new application
    const application = await prisma.applications.create({
      data: {
        user_id: user_id,
        job_id: job_id,
        status: status as ApplicationStatus,
        resume_id: resume_id,
        position: position || undefined,
        cover_letter: cover_letter || undefined,
        ideal_candidate: ideal_candidate || undefined,
        applied_at: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      application
    });
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
    const applicationId = searchParams.get('applicationId');
    
    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }
    
    const appId = parseInt(applicationId);
    
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
    if (existingApplication.status === newStatus && !body.resume_id && !body.position && !body.sub_stage && body.archived === undefined) {
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
        position: body.position || undefined,
        isArchived: body.archived !== undefined ? body.archived : undefined,
        sub_stage: body.sub_stage || undefined
      }
    });

    // Create status history entry if status changed
    if (newStatus && existingApplication.status !== newStatus) {
      await prisma.app_status_history.create({
        data: {
          application_id: appId,
          status: mapApplicationStatusToHistoryStatus(newStatus)
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
    const applicationId = searchParams.get('applicationId');
    
    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }
    
    const appId = parseInt(applicationId);
    
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

// Helper function to map ApplicationStatus to AppHistoryStatus
function mapApplicationStatusToHistoryStatus(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return 'APPLIED';
    case ApplicationStatus.PHONE_SCREENING:
    case ApplicationStatus.INTERVIEW_STAGE:
    case ApplicationStatus.FINAL_INTERVIEW_STAGE:
      return 'INTERVIEWING';
    case ApplicationStatus.OFFER_EXTENDED:
    case ApplicationStatus.NEGOTIATION:
      return 'OFFERED';
    case ApplicationStatus.OFFER_ACCEPTED:
      return 'HIRED';
    case ApplicationStatus.REJECTED:
      return 'REJECTED';
    default:
      return 'APPLIED';
  }
}

// PATCH: Update application status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes, userId } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: userId' },
        { status: 400 }
      );
    }
    
    // Prepare update data with proper typing
    const updateData: {
      status?: ApplicationStatus;
      status_updated: Date;
      notes?: string;
    } = {
      status_updated: new Date()
    };
    
    // Add status if provided
    if (status) {
      updateData.status = status as ApplicationStatus;
    }
    
    // Add notes if provided
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Verify the application belongs to the user
    const application = await prisma.applications.findUnique({
      where: { application_id: parseInt(id) }
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.user_id !== parseInt(userId.toString())) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update this application' },
        { status: 403 }
      );
    }
    
    // First, make sure the notes column exists
    try {
      await prisma.$executeRaw`ALTER TABLE applications ADD COLUMN IF NOT EXISTS notes TEXT`;
    } catch (error) {
      console.error("Error ensuring notes column exists:", error);
      // Continue even if the column already exists
    }
    
    // Update application
    const updatedApplication = await prisma.applications.update({
      where: {
        application_id: parseInt(id)
      },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
} 