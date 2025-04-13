import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';

// Get applicant dashboard data
export async function GET(request: Request) {
  try {
    // Verify database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: process.env.NODE_ENV === 'development' ? (dbError instanceof Error ? dbError.message : 'Unknown error') : undefined 
      }, { status: 503 });
    }

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
          console.warn('Using custom auth with email:', email);
        }
      }
    }

    console.warn('Session data:', session); // Debug log
    
    if (!email) {
      console.warn('No user email in session'); // Debug log
      return NextResponse.json({ error: 'Unauthorized', message: 'No user email found in session' }, { status: 401 });
    }

    console.warn('Fetching data for email:', email); // Debug log

    const applicant = await prisma.users.findFirst({
      where: {
        AND: [
          { email: { equals: email } },
          { is_admin: false },
          { is_active: true },
          { is_archived: false }
        ]
      },
      include: {
        applications: {
          include: {
            jobs: true
          },
          orderBy: {
            status_updated: 'desc'
          }
        }
      }
    });

    if (!applicant) {
      console.warn('No applicant found for email:', email); // Debug log
      return NextResponse.json({ error: 'Applicant not found', message: 'User exists but no applicant record found' }, { status: 404 });
    }

    // Verify that we have applications data
    console.warn(`Found ${applicant.applications.length} applications for user ID: ${applicant.user_id}`);

    type ApplicationWithJob = Prisma.applicationsGetPayload<{
      include: { jobs: true }
    }>;

    const response = {
      applications: applicant.applications.map((app: ApplicationWithJob) => ({
        id: app.application_id,
        status: app.status,
        appliedAt: app.applied_at,
        updatedAt: app.status_updated,
        subStage: app.sub_stage,
        job: app.jobs ? {
          id: app.jobs.job_id,
          title: app.jobs.title,
          company: app.jobs.company,
          location: app.jobs.location,
          type: app.jobs.job_type
        } : null
      })),
      // Adding empty savedJobs array as this feature is not implemented in the schema yet
      savedJobs: [],
      profile: {
        id: applicant.user_id,
        email: applicant.email,
        firstName: applicant.first_name,
        lastName: applicant.last_name
      }
    };

    console.warn('Successfully retrieved dashboard data for user ID:', applicant.user_id);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    // Return more detailed error information in development
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: 'Failed to retrieve dashboard data',
      details: process.env.NODE_ENV === 'development' ? { message: errorMessage, stack: errorStack } : undefined 
    }, { status: 500 });
  }
} 