import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ApplicationStatus } from '@/lib/prisma-enums';

export async function GET(request: Request) {
  try {
    // Get the current user's session
    const session = await auth.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get user with their applications and related job details
    const user = await prisma.users.findUnique({
      where: {
        user_id: userId,
        is_archived: false
      },
      include: {
        applications: {
          where: {
            isArchived: false
          },
          include: {
            jobs: {
              include: {
                partners: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            status_updated: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform the data for the frontend
    const formattedApplications = user.applications.map(app => ({
      id: app.application_id.toString(),
      status: app.status,
      appliedAt: app.applied_at?.toISOString() ?? new Date().toISOString(),
      updatedAt: app.status_updated?.toISOString() ?? new Date().toISOString(),
      subStage: app.sub_stage,
      isRecommended: false,
      job: app.jobs ? {
        id: app.jobs.job_id.toString(),
        title: app.jobs.title,
        company: app.jobs.company,
        location: app.jobs.location || 'Remote',
        type: app.jobs.job_type,
        description: app.jobs.description,
        tags: app.jobs.tags,
        website: app.jobs.website,
        partnerDetails: app.jobs.partners ? {
          name: app.jobs.partners.name
        } : null
      } : null
    }));

    // Calculate some basic stats
    const stats = {
      totalApplications: formattedApplications.length,
      activeApplications: formattedApplications.filter(app => 
        app.status !== ApplicationStatus.REJECTED && app.status !== ApplicationStatus.OFFER_ACCEPTED
      ).length,
      interviews: formattedApplications.filter(app => 
        [ApplicationStatus.PHONE_SCREENING, ApplicationStatus.INTERVIEW_STAGE, ApplicationStatus.FINAL_INTERVIEW_STAGE].includes(app.status as ApplicationStatus)
      ).length,
      offers: formattedApplications.filter(app => 
        [ApplicationStatus.OFFER_EXTENDED, ApplicationStatus.NEGOTIATION].includes(app.status as ApplicationStatus)
      ).length
    };

    return NextResponse.json({
      success: true,
      applications: formattedApplications,
      stats,
      profile: {
        id: user.user_id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        program: user.program
      }
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch dashboard data'
    }, { status: 500 });
  }
} 