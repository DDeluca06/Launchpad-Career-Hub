import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Get applicant dashboard data
export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession();
    console.log('Session data:', session); // Debug log
    
    if (!session?.user?.email) {
      console.log('No user email in session'); // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching data for email:', session.user.email); // Debug log

    const applicant = await prisma.users.findFirst({
      where: {
        AND: [
          { email: { equals: session.user.email } },
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
      console.log('No applicant found for email:', session.user.email); // Debug log
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
    }

    type ApplicationWithJob = Prisma.applicationsGetPayload<{
      include: { jobs: true }
    }>;

    const response = {
      applications: applicant.applications.map((app: ApplicationWithJob) => ({
        id: app.application_id,
        status: app.status,
        appliedAt: app.applied_at,
        updatedAt: app.status_updated,
        job: app.jobs ? {
          id: app.jobs.job_id,
          title: app.jobs.title,
          company: app.jobs.company,
          location: app.jobs.location,
          type: app.jobs.job_type
        } : null
      })),
      profile: {
        id: applicant.user_id,
        email: applicant.email,
        firstName: applicant.first_name,
        lastName: applicant.last_name
      }
    };

    console.log('Returning data:', response); // Debug log
    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    // Return more detailed error information in development
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
    }, { status: 500 });
  }
} 