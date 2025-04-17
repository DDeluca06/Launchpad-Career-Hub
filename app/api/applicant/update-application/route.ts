import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * API endpoint to update an application status from the Kanban board
 */
export async function PUT(request: NextRequest) {
  try {
    // First try using NextAuth
    const session = await getServerSession();
    let email = session?.user?.email;
    
    // If NextAuth fails, try the custom auth implementation
    if (!email) {
      const customSession = await auth.getSession(request);
      if (customSession?.user?.id) {
        // Get user email from the user ID
        const user = await prisma.users.findUnique({
          where: { user_id: parseInt(customSession.user.id) }
        });
        if (user) {
          email = user.email;
        }
      }
    }
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized', message: 'No user email found in session' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { applicationId, status } = body;
    
    if (!applicationId || !status) {
      return NextResponse.json({ error: 'Missing required fields', message: 'Application ID and status are required' }, { status: 400 });
    }

    // Map UI status to database status
    const dbStatus = mapStatusToDB(status);
    
    // Get the user ID
    const user = await prisma.users.findFirst({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if this application belongs to the user
    const application = await prisma.applications.findFirst({
      where: {
        application_id: parseInt(applicationId),
        user_id: user.user_id
      }
    });

    if (!application) {
      return NextResponse.json({ 
        error: 'Application not found', 
        message: 'This application does not exist or does not belong to you'
      }, { status: 404 });
    }

    // Update application status
    const updatedApplication = await prisma.applications.update({
      where: { application_id: parseInt(applicationId) },
      data: {
        // @ts-expect-error: The enum type is defined in Prisma but TypeScript can't properly import it here
        status: dbStatus,
        status_updated: new Date()
      }
    });

    // Add an entry to the application status history
    await prisma.app_status_history.create({
      data: {
        application_id: parseInt(applicationId),
        status: mapToHistoryStatus(dbStatus),
        changed_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      application: {
        id: updatedApplication.application_id,
        status: updatedApplication.status
      }
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ 
      error: 'Failed to update application',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

/**
 * Map UI status to database status
 */
function mapStatusToDB(uiStatus: string): string {
  const statusMap: Record<string, string> = {
    'interested': 'INTERESTED',
    'applied': 'APPLIED',
    'interview': 'INTERVIEW_STAGE',
    'offer': 'OFFER_EXTENDED',
    'referrals': 'INTERESTED', // Referrals goes to interested in DB
  };
  
  return statusMap[uiStatus] || 'INTERESTED';
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