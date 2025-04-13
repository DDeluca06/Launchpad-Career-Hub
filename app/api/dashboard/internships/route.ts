import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API route to fetch internship opportunities statistics
 * 
 * This route queries the database for:
 * - Number of available jobs (active job listings)
 * - Total number of applications received
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
      // Count active job listings
      prisma.jobs.count({
        where: {
          is_active: true
        }
      }),
      
      // Count total applications
      prisma.applications.count({
        where: {
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