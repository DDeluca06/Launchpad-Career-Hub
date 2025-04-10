import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET request handler to fetch application count for a specific job
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);
    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Get the count of applications for this job
    const count = await prisma.applications.count({
      where: { job_id: jobId }
    });

    return NextResponse.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching application count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch application count' },
      { status: 500 }
    );
  }
} 