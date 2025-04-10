import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API route to fetch dashboard activity data
 * 
 * This route queries the database for recent activity records and
 * transforms them into a format expected by the client.
 * It includes application status changes, new applications, and interview schedules.
 * 
 * @returns A JSON response with activities data or error message
 */
export async function GET() {
  try {
    // Fetch the most recent dashboard activities
    const dbActivities = await prisma.dashboard_activity.findMany({
      take: 10,
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        users: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });

    // Fetch recent application status changes
    const recentApplications = await prisma.applications.findMany({
      take: 5,
      orderBy: {
        applied_at: 'desc'
      },
      include: {
        users: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true
          }
        },
        jobs: {
          select: {
            title: true,
            company: true
          }
        }
      }
    });

    // Fetch recent status changes
    const recentStatusChanges = await prisma.app_status_history.findMany({
      take: 5,
      orderBy: {
        changed_at: 'desc'
      },
      include: {
        applications: {
          include: {
            users: {
              select: {
                user_id: true,
                first_name: true,
                last_name: true
              }
            },
            jobs: {
              select: {
                title: true,
                company: true
              }
            }
          }
        }
      }
    });

    // Transform database activities into the expected format
    const activities = [
      // Activities from dashboard_activity table
      ...dbActivities.map(activity => ({
        id: `act-${activity.activity_id}`,
        type: mapActionToType(activity.action),
        title: formatActivityTitle(activity.action),
        description: activity.details || "",
        timestamp: activity.timestamp?.toISOString() || new Date().toISOString(),
        user: activity.users ? {
          id: activity.users.user_id.toString(),
          name: `${activity.users.first_name} ${activity.users.last_name}`
        } : undefined
      })),

      // Recent applications
      ...recentApplications.map(app => ({
        id: `app-${app.application_id}`,
        type: "application",
        title: "New Application Received",
        description: `${app.users.first_name} ${app.users.last_name} applied for ${app.jobs.title} at ${app.jobs.company}`,
        timestamp: app.applied_at?.toISOString() || new Date().toISOString(),
        user: {
          id: app.users.user_id.toString(),
          name: `${app.users.first_name} ${app.users.last_name}`
        }
      })),

      // Status changes
      ...recentStatusChanges.map(change => ({
        id: `change-${change.app_history_id}`,
        type: "status_change",
        title: "Application Status Updated",
        description: `${change.applications.users.first_name} ${change.applications.users.last_name}'s application for ${change.applications.jobs.title} is now ${formatStatus(change.status)}`,
        timestamp: change.changed_at?.toISOString() || new Date().toISOString(),
        user: {
          id: change.applications.users.user_id.toString(),
          name: `${change.applications.users.first_name} ${change.applications.users.last_name}`
        }
      }))
    ]
    // Sort activities by timestamp (most recent first)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    // Take only the 10 most recent activities
    .slice(0, 10);

    return NextResponse.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard activities' },
      { status: 500 }
    );
  }
}

/**
 * Maps an action string to an activity type
 */
function mapActionToType(action: string): 'application' | 'status_change' | 'interview' | 'offer' {
  if (action.includes('interview')) return 'interview';
  if (action.includes('offer')) return 'offer';
  if (action.includes('status') || action.includes('moved')) return 'status_change';
  return 'application';
}

/**
 * Formats an activity action into a readable title
 */
function formatActivityTitle(action: string): string {
  // Capitalize first letter and remove trailing punctuation
  return action.charAt(0).toUpperCase() + 
         action.slice(1).replace(/[.:!?]$/, '');
}

/**
 * Formats status enum values into readable text
 */
function formatStatus(status: string): string {
  switch (status) {
    case 'APPLIED': return 'Applied';
    case 'INTERVIEWING': return 'In Interview Process';
    case 'OFFERED': return 'Offered Position';
    case 'HIRED': return 'Hired';
    case 'REJECTED': return 'Not Selected';
    default: return status.charAt(0) + status.slice(1).toLowerCase();
  }
} 