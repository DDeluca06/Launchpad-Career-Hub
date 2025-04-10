import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid applicant ID' },
        { status: 400 }
      );
    }
    
    // Get the user/applicant
    const user = await prisma.users.findUnique({
      where: { user_id: id },
      include: {
        applications: {
          include: {
            jobs: true,
          },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      );
    }
    
    // Determine status based on archived state and applications
    let status;
    if (user.is_archived) {
      status = "archived";
    } else if (user.applications.length === 0) {
      status = "unapplied";
    } else {
      // Check if any applications are in interview process
      const hasInterviewApplications = user.applications.some((app: { status: string }) => 
        ['PHONE_SCREENING', 'INTERVIEW_STAGE', 'FINAL_INTERVIEW_STAGE'].includes(app.status)
      );
      
      // Check if any applications have been accepted
      const hasAcceptedOffer = user.applications.some((app: { status: string }) => 
        app.status === 'OFFER_ACCEPTED'
      );
      
      if (hasAcceptedOffer) {
        status = "placed";
      } else if (hasInterviewApplications) {
        status = "interview";
      } else {
        status = "unapplied";
      }
    }
    
    // Format program for display
    const displayProgram = user.program === 'ONE_ZERO_ONE' ? '101' : 
                          user.program?.toString() || 'ALUMNI';
                          
    // Format the job applications
    const jobApplications = user.applications.map((app: { 
      application_id: number; 
      job_id: number; 
      jobs: { title: string; company: string; }; 
      status: string;
      applied_at: Date | null;
    }) => {
      return {
        id: app.application_id,
        jobId: app.job_id,
        jobTitle: app.jobs.title,
        company: app.jobs.company,
        status: app.status.toLowerCase(),
        appliedDate: app.applied_at?.toISOString() || new Date().toISOString(),
      };
    });
    
    // Create the response object
    const applicant = {
      id: user.user_id,
      userId: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: `${user.username}@example.com`, // In a real app, you'd have the email stored
      role: user.is_admin ? 'admin' : 'applicant',
      applications: user.applications.length,
      status: status,
      createdAt: user.created_at?.toISOString() || new Date().toISOString(),
      program: displayProgram,
      isArchived: user.is_archived
    };
    
    return NextResponse.json({ applicant, jobApplications });
  } catch (error: unknown) {
    console.error('Error fetching applicant details:', error);
    
    // Safer type checking for Prisma errors
    const isPrismaError = 
      error !== null && 
      typeof error === 'object' && 
      'name' in error && 
      error.name === 'PrismaClientKnownRequestError' &&
      'code' in error &&
      'message' in error &&
      'meta' in error;
    
    if (isPrismaError) {
      const prismaError = error as unknown as { 
        code: string; 
        message: string; 
        meta: unknown;
      };
      console.error('Prisma Error Code:', prismaError.code);
      console.error('Prisma Error Message:', prismaError.message);
      console.error('Prisma Error Meta:', prismaError.meta);
    }
    
    // Safe extraction of error message
    const errorMessage = 
      error !== null && 
      typeof error === 'object' && 
      'message' in error && 
      typeof error.message === 'string'
        ? error.message
        : 'Unknown error';
        
    return NextResponse.json(
      { error: 'Failed to fetch applicant details', details: errorMessage },
      { status: 500 }
    );
  }
} 