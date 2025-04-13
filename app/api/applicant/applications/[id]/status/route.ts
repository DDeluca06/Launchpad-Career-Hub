import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Map Kanban status to database status
const STATUS_MAP: Record<string, string> = {
  'applied': 'APPLIED',
  'screening': 'PHONE_SCREENING',
  'interview': 'INTERVIEW_STAGE',
  'offer': 'OFFER_EXTENDED',
  'rejected': 'REJECTED'
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
    const { status } = data;
    
    if (!status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Status is required' 
      }, { status: 400 });
    }
    
    // Map Kanban board status to database status
    const dbStatus = STATUS_MAP[status] || 'APPLIED';
    
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
    
    // Update the application status
    await prisma.applications.update({
      where: { application_id: parseInt(applicationId) },
      data: {
        status: dbStatus,
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
      message: 'Application status updated successfully' 
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
function mapToHistoryStatus(status: string): 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'HIRED' | 'REJECTED' {
  const historyStatusMap: Record<string, 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'HIRED' | 'REJECTED'> = {
    'INTERESTED': 'APPLIED',
    'APPLIED': 'APPLIED',
    'PHONE_SCREENING': 'INTERVIEWING',
    'INTERVIEW_STAGE': 'INTERVIEWING',
    'FINAL_INTERVIEW_STAGE': 'INTERVIEWING',
    'OFFER_EXTENDED': 'OFFERED',
    'NEGOTIATION': 'OFFERED',
    'OFFER_ACCEPTED': 'HIRED',
    'REJECTED': 'REJECTED'
  };
  
  return historyStatusMap[status] || 'APPLIED';
} 