import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DELETE request handler to delete applications by job_id
 * This is used to remove saved jobs from the jobs page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get job ID from params
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const jobId = parseInt(id);
    
    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Get the user ID from the query parameters
    const userId = request.nextUrl.searchParams.get('userId');
    
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
        job_id: jobId,
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
        job_id: jobId,
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