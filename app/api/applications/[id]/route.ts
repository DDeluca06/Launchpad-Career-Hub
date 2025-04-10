import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type ApplicationStatus = 
  | 'INTERESTED' 
  | 'APPLIED' 
  | 'PHONE_SCREENING' 
  | 'INTERVIEW_STAGE' 
  | 'FINAL_INTERVIEW_STAGE' 
  | 'OFFER_EXTENDED' 
  | 'NEGOTIATION'
  | 'OFFER_ACCEPTED' 
  | 'REJECTED';

/**
 * GET request handler to fetch a single application by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    const application = await prisma.applications.findUnique({
      where: { application_id: id },
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
  } catch (error) {
    console.error(`Error fetching application ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler to update an application's status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const newStatus = body.status?.toUpperCase() as ApplicationStatus;
    
    // Validate status
    const validStatuses: ApplicationStatus[] = [
      'INTERESTED', 
      'APPLIED', 
      'PHONE_SCREENING', 
      'INTERVIEW_STAGE', 
      'FINAL_INTERVIEW_STAGE', 
      'OFFER_EXTENDED', 
      'NEGOTIATION',
      'OFFER_ACCEPTED', 
      'REJECTED'
    ];
    
    if (newStatus && !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application status' },
        { status: 400 }
      );
    }

    // Check if application exists
    const existingApplication = await prisma.applications.findUnique({
      where: { application_id: id }
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
      where: { application_id: id },
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
          application_id: id,
          status: newStatus
        }
      });
    }

    return NextResponse.json({ success: true, application: updatedApplication });
  } catch (error) {
    console.error(`Error updating application ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler to delete an application
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    // Check if application exists
    const existingApplication = await prisma.applications.findUnique({
      where: { application_id: id }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Delete the application (status history will cascade delete)
    await prisma.applications.delete({
      where: { application_id: id }
    });

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error(`Error deleting application ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete application' },
      { status: 500 }
    );
  }
} 