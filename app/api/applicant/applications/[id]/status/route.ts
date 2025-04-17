import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ApplicationStatus } from '@/lib/prisma-enums';

// Map Kanban status to database status
const STATUS_MAP: Record<string, ApplicationStatus> = {
  'interested': ApplicationStatus.INTERESTED,
  'applied': ApplicationStatus.APPLIED,
  'interview': ApplicationStatus.INTERVIEW_STAGE,
  'offer': ApplicationStatus.OFFER_EXTENDED,
  'accepted': ApplicationStatus.OFFER_ACCEPTED,
  'rejected': ApplicationStatus.REJECTED,
  'referrals': ApplicationStatus.INTERESTED
};

// Map sub-stages to specific database statuses
const SUB_STAGE_MAP: Record<string, ApplicationStatus> = {
  'phone_screening': ApplicationStatus.PHONE_SCREENING,
  'interview_stage': ApplicationStatus.INTERVIEW_STAGE,
  'final_interview_stage': ApplicationStatus.FINAL_INTERVIEW_STAGE,
  'negotiation': ApplicationStatus.NEGOTIATION,
  'offer_extended': ApplicationStatus.OFFER_EXTENDED
};

/**
 * API endpoint to update an application status from the Kanban board
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    let email;
    
    // Try NextAuth first
    const session = await getServerSession();
    if (session?.user?.email) {
      email = session.user.email;
    } else {
      // Try custom auth
      const customSession = await auth.getSession(request);
      if (customSession?.user?.id) {
        const user = await prisma.users.findUnique({
          where: { user_id: parseInt(customSession.user.id) }
        });
        if (user) {
          email = user.email;
        }
      }
    }
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }
    
    // Get the application ID from the route parameter
    const applicationId = params.id;
    
    // Get the request body
    const data = await request.json();
    const { status, subStage } = data;
    
    if (!status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Status is required' 
      }, { status: 400 });
    }
    
    // Determine the database status based on the main status and sub-stage
    let dbStatus: ApplicationStatus;
    
    // If we have a sub-stage, use it to determine the status
    if (subStage && SUB_STAGE_MAP[subStage]) {
      dbStatus = SUB_STAGE_MAP[subStage];
    } else {
      // Otherwise, map from the main status
      dbStatus = STATUS_MAP[status] || ApplicationStatus.APPLIED;
    }
    
    // Get the user ID
    const user = await prisma.users.findFirst({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    // Check if the application belongs to the user
    const application = await prisma.applications.findFirst({
      where: {
        application_id: parseInt(applicationId),
        user_id: user.user_id
      }
    });
    
    if (!application) {
      return NextResponse.json({ 
        success: false, 
        error: 'Application not found' 
      }, { status: 404 });
    }
    
    // Skip update if status hasn't changed
    if (application.status === dbStatus) {
      return NextResponse.json({ 
        success: true, 
        message: 'No status change required' 
      });
    }
    
    // Update the application status
    const updatedApplication = await prisma.applications.update({
      where: { application_id: parseInt(applicationId) },
      data: {
        status: dbStatus,
        sub_stage: subStage,
        status_updated: new Date()
      }
    });
    
    // Create status history record
    await prisma.app_status_history.create({
      data: {
        application_id: parseInt(applicationId),
        status: mapToHistoryStatus(dbStatus),
        changed_at: new Date()
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Application status updated successfully',
      application: {
        id: updatedApplication.application_id,
        status: updatedApplication.status
      }
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update application status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Map application status to history status
 */
function mapToHistoryStatus(status: ApplicationStatus): 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'HIRED' | 'REJECTED' {
  const historyStatusMap: Record<string, 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'HIRED' | 'REJECTED'> = {
    [ApplicationStatus.INTERESTED]: 'APPLIED',
    [ApplicationStatus.APPLIED]: 'APPLIED',
    [ApplicationStatus.PHONE_SCREENING]: 'INTERVIEWING',
    [ApplicationStatus.INTERVIEW_STAGE]: 'INTERVIEWING',
    [ApplicationStatus.FINAL_INTERVIEW_STAGE]: 'INTERVIEWING',
    [ApplicationStatus.OFFER_EXTENDED]: 'OFFERED',
    [ApplicationStatus.NEGOTIATION]: 'OFFERED',
    [ApplicationStatus.OFFER_ACCEPTED]: 'HIRED',
    [ApplicationStatus.REJECTED]: 'REJECTED'
  };
  
  return historyStatusMap[status] || 'APPLIED';
} 