import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET request handler to fetch all applications
 * Can be filtered by user_id or job_id via query params
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');

    const whereClause: any = {};

    if (userId) {
      whereClause.user_id = parseInt(userId);
    }

    if (jobId) {
      whereClause.job_id = parseInt(jobId);
    }

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const applications = await prisma.applications.findMany({
      where: whereClause,
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
        }
      },
      orderBy: {
        applied_at: 'desc'
      }
    });

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

/**
 * POST request handler to create a new application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.user_id || !body.job_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the user already applied to this job
    const existingApplication = await prisma.applications.findFirst({
      where: {
        user_id: body.user_id,
        job_id: body.job_id
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Create the application with default status APPLIED
    const application = await prisma.applications.create({
      data: {
        user_id: body.user_id,
        job_id: body.job_id,
        status: body.status || 'APPLIED',
        position: body.position,
        resume_id: body.resume_id
      }
    });

    // Create application status history entry
    await prisma.app_status_history.create({
      data: {
        application_id: application.application_id,
        status: application.status
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    );
  }
} 