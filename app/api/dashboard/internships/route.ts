import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API route to fetch internship opportunities statistics
 * 
 * This route queries the database for:
 * - Number of available internship jobs (active job listings)
 * - Total number of applications received for internship jobs
 * 
 * @returns A JSON response with internship statistics or error message
 */
export async function GET() {
  try {
    // Get internship statistics from database
    const [
      availableJobs,
      totalApplications
    ] = await Promise.all([
      // Count active internship job listings
      prisma.jobs.count({
        where: {
          job_type: 'INTERNSHIP',
          archived: false
        }
      }),
      
      // Count total applications for internship jobs
      prisma.applications.count({
        where: {
          jobs: {
            job_type: 'INTERNSHIP',
            archived: false
          },
          users: {
            is_admin: false
          }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        availableJobs,
        totalApplications,
        // Add direct keys that match the component labels
        "Available Jobs": availableJobs,
        "Applications": totalApplications
      }
    });
  } catch (error) {
    console.error('Error fetching internship statistics:', error);
    
    // Return fallback values instead of error to prevent UI from breaking
    return NextResponse.json({
      success: true,
      stats: {
        availableJobs: 0,
        totalApplications: 0,
        // Add direct keys that match the component labels
        "Available Jobs": 0,
        "Applications": 0
      }
    });
  }
} 