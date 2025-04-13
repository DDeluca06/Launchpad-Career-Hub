import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ApplicationStatus } from '@/lib/prisma-enums';

// Define the status mappings from UI columns to database values
const COLUMN_TO_DB_STATUS: Record<string, ApplicationStatus> = {
  'interested': ApplicationStatus.INTERESTED,
  'applied': ApplicationStatus.APPLIED,
  'interview': ApplicationStatus.INTERVIEW_STAGE, // Default if no sub-stage
  'offer': ApplicationStatus.OFFER_EXTENDED, // Default if no sub-stage
  'accepted': ApplicationStatus.OFFER_ACCEPTED,
  'rejected': ApplicationStatus.REJECTED,
  'referrals': ApplicationStatus.INTERESTED
};

// Define the sub-stage mappings
const SUB_STAGE_TO_DB_STATUS: Record<string, ApplicationStatus> = {
  'phone_screening': ApplicationStatus.PHONE_SCREENING,
  'interview_stage': ApplicationStatus.INTERVIEW_STAGE,
  'final_interview_stage': ApplicationStatus.FINAL_INTERVIEW_STAGE,
  'negotiation': ApplicationStatus.NEGOTIATION,
  'offer_extended': ApplicationStatus.OFFER_EXTENDED
};

/**
 * API endpoint to update an application status from the Kanban board
 */
export async function POST(request: NextRequest) {
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
    
    // Get the request body
    const data = await request.json();
    const { applicationId, columnStatus, subStage } = data;
    
    if (!applicationId || !columnStatus) {
      return NextResponse.json({ 
        success: false, 
        error: 'Application ID and column status are required' 
      }, { status: 400 });
    }
    
    // Determine the database status based on the column and sub-stage
    let dbStatus: ApplicationStatus;
    
    // If we have a sub-stage that can override the column status, use it
    if (subStage && SUB_STAGE_TO_DB_STATUS[subStage]) {
      dbStatus = SUB_STAGE_TO_DB_STATUS[subStage];
      console.log(`Using sub-stage mapping: ${subStage} -> ${dbStatus}`);
    } else {
      // Otherwise use the column status mapping
      dbStatus = COLUMN_TO_DB_STATUS[columnStatus];
      console.log(`Using column mapping: ${columnStatus} -> ${dbStatus}`);
    }
    
    if (!dbStatus) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid status combination: Column=${columnStatus}, SubStage=${subStage || 'none'}` 
      }, { status: 400 });
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
    
    console.log(`Updating application ${applicationId} to status: ${dbStatus}, subStage: ${subStage || 'none'}`);
    
    // Update the application status
    const updatedApplication = await prisma.applications.update({
      where: { application_id: parseInt(applicationId) },
      data: {
        status: dbStatus,
        sub_stage: subStage || null,
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
        status: updatedApplication.status,
        subStage: updatedApplication.sub_stage
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