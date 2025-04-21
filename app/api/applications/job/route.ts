import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DELETE request handler to delete applications by job_id
 * This is used to remove saved jobs from the jobs page
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');
    const userId = searchParams.get('userId');
    
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const numericJobId = parseInt(jobId);
    
    if (isNaN(numericJobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const numericUserId = parseInt(userId);
    
    if (isNaN(numericUserId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Find applications with the given job_id and user_id
    const applications = await prisma.applications.findMany({
      where: {
        job_id: numericJobId,
        user_id: numericUserId,
        status: 'INTERESTED', // Only delete INTERESTED applications
      }
    });

    if (applications.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No saved job applications found' },
        { status: 404 }
      );
    }

    // Delete all matching applications
    await prisma.applications.deleteMany({
      where: {
        job_id: numericJobId,
        user_id: numericUserId,
        status: 'INTERESTED',
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Saved job removed successfully',
      count: applications.length
    });
  } catch (error) {
    console.error(`Error deleting applications by job_id:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete saved job' },
      { status: 500 }
    );
  }
} 