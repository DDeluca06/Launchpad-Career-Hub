import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/lib/prisma-enums';

/**
 * POST handler for creating job recommendations
 * This endpoint allows admins to recommend jobs to users
 * The recommendation appears in the user's referrals tab in the Kanban chart
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, jobId, adminId } = body;
    
    console.log(`Creating job recommendation: User ID ${userId}, Job ID ${jobId}, Admin ID ${adminId}`);
    
    if (!userId || !jobId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Job ID are required' },
        { status: 400 }
      );
    }
    
    // Validate the user exists
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId.toString()) }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Validate the job exists
    const job = await prisma.jobs.findUnique({
      where: { job_id: parseInt(jobId.toString()) }
    });
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Check if application already exists for this user and job
    const existingApplication = await prisma.applications.findFirst({
      where: {
        user_id: parseInt(userId.toString()),
        job_id: parseInt(jobId.toString())
      }
    });
    
    if (existingApplication) {
      // Update the existing application to show it's a referral
      const updatedApplication = await prisma.applications.update({
        where: { application_id: existingApplication.application_id },
        data: {
          sub_stage: 'referrals',
          status_updated: new Date()
        }
      });
      
      // Log the activity if adminId is provided
      if (adminId) {
        await prisma.dashboard_activity.create({
          data: {
            admin_id: parseInt(adminId.toString()),
            action: 'UPDATED_RECOMMENDATION',
            details: `Updated job recommendation for ${user.first_name} ${user.last_name} for position ${job.title}`
          }
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Job recommendation updated',
        recommendation: updatedApplication
      });
    }
    
    // Create a new application with the referral sub_stage
    const newRecommendation = await prisma.applications.create({
      data: {
        user_id: parseInt(userId.toString()),
        job_id: parseInt(jobId.toString()),
        status: ApplicationStatus.INTERESTED,
        sub_stage: 'referrals',
        position: job.title,
        applied_at: new Date(),
        status_updated: new Date()
      }
    });
    
    // Log the admin activity if adminId is provided
    if (adminId) {
      await prisma.dashboard_activity.create({
        data: {
          admin_id: parseInt(adminId.toString()),
          action: 'CREATED_RECOMMENDATION',
          details: `Recommended job to ${user.first_name} ${user.last_name} for position ${job.title}`
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job recommendation created',
      recommendation: newRecommendation
    });
  } catch (error) {
    console.error('Error creating job recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job recommendation' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for fetching job recommendations
 * Can be filtered by user_id or admin_id
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    // If userId is provided, fetch recommendations for that user
    if (userId) {
      const recommendations = await prisma.applications.findMany({
        where: {
          user_id: parseInt(userId.toString()),
          sub_stage: 'referrals'
        },
        include: {
          jobs: {
            select: {
              title: true,
              company: true,
              location: true,
              job_type: true,
              tags: true
            }
          }
        },
        orderBy: {
          applied_at: 'desc'
        }
      });
      
      return NextResponse.json({
        success: true,
        recommendations: recommendations
      });
    }
    
    // If no filters provided, return all recommendations
    const allRecommendations = await prisma.applications.findMany({
      where: {
        sub_stage: 'referrals'
      },
      include: {
        users: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true
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
        }
      },
      orderBy: {
        applied_at: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      recommendations: allRecommendations
    });
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job recommendations' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing job recommendations
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const adminId = searchParams.get('adminId');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Recommendation ID is required' },
        { status: 400 }
      );
    }
    
    const appId = parseInt(id);
    
    if (isNaN(appId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid recommendation ID' },
        { status: 400 }
      );
    }

    // Check if recommendation exists
    const existingRecommendation = await prisma.applications.findFirst({
      where: { 
        application_id: appId,
        sub_stage: 'referrals'
      },
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true
          }
        },
        jobs: {
          select: {
            title: true
          }
        }
      }
    });

    if (!existingRecommendation) {
      return NextResponse.json(
        { success: false, error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    // Remove the referral status by updating the sub_stage to null
    await prisma.applications.update({
      where: { application_id: appId },
      data: {
        sub_stage: null
      }
    });
    
    // Log the admin activity if adminId is provided
    if (adminId) {
      await prisma.dashboard_activity.create({
        data: {
          admin_id: parseInt(adminId.toString()),
          action: 'REMOVED_RECOMMENDATION',
          details: `Removed job recommendation for ${existingRecommendation.users.first_name} ${existingRecommendation.users.last_name} for position ${existingRecommendation.jobs.title}`
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Job recommendation removed' 
    });
  } catch (error) {
    console.error(`Error removing job recommendation:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove job recommendation' },
      { status: 500 }
    );
  }
} 