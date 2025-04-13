import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, AppHistoryStatus } from '@/lib/prisma-enums';

/**
 * Helper function to map ApplicationStatus to AppHistoryStatus
 */
function mapApplicationStatusToHistoryStatus(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.INTERESTED:
      return AppHistoryStatus.APPLIED;
    case ApplicationStatus.APPLIED:
      return AppHistoryStatus.APPLIED;
    case ApplicationStatus.PHONE_SCREENING:
      return AppHistoryStatus.INTERVIEWING;
    case ApplicationStatus.INTERVIEW_STAGE:
      return AppHistoryStatus.INTERVIEWING;
    case ApplicationStatus.FINAL_INTERVIEW_STAGE:
      return AppHistoryStatus.INTERVIEWING;
    case ApplicationStatus.OFFER_EXTENDED:
      return AppHistoryStatus.OFFERED;
    case ApplicationStatus.NEGOTIATION:
      return AppHistoryStatus.OFFERED;
    case ApplicationStatus.OFFER_ACCEPTED:
      return AppHistoryStatus.HIRED;
    case ApplicationStatus.REJECTED:
      return AppHistoryStatus.REJECTED;
    default:
      return AppHistoryStatus.APPLIED; // Default
  }
}

/**
 * PUT request handler to update an application by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    
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
    
    // Validate status if provided
    if (newStatus) {
      const validStatuses = Object.values(ApplicationStatus);
      
      if (!validStatuses.includes(newStatus)) {
        return NextResponse.json(
          { success: false, error: 'Invalid application status' },
          { status: 400 }
        );
      }
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

    // Prepare update data
    const updateData: {
      status?: ApplicationStatus;
      status_updated?: Date;
      resume_id?: number;
      position?: string;
      isArchived?: boolean;
    } = {};
    
    // Only update fields that are provided
    if (newStatus) {
      updateData.status = newStatus;
      updateData.status_updated = new Date();
    }
    
    if (body.resume_id !== undefined) {
      updateData.resume_id = body.resume_id;
    }
    
    if (body.position !== undefined) {
      updateData.position = body.position;
    }
    
    if (body.archived !== undefined) {
      updateData.isArchived = body.archived;
    }
    
    // Don't update if no changes
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No changes to apply',
        application: existingApplication
      });
    }

    // Update application with new data
    const updatedApplication = await prisma.applications.update({
      where: { application_id: appId },
      data: updateData
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
 * DELETE request handler to delete an application by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    
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

/**
 * GET request handler to get an application by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    
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
  } catch (error) {
    console.error(`Error getting application:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to get application' },
      { status: 500 }
    );
  }
}
