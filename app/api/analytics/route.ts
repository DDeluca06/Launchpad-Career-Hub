import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define interfaces for the application and job types

interface PlacementData {
  partner: string;
  placements: number;
}

interface DbPartner {
  name: string;
  description: string | null;
  location: string | null;
  partner_id: number;
  jobs_available: number | null;
  applicants: number | null;
  applicants_hired: number | null;
  industry: string | null;
  jobs: {
    applications: {
      status: string;
    }[];
  }[];
}

interface DbApplication {
  status: string;
  applied_at: Date;
  user_id: number;
}

interface DbJob {
  tags: string[];
  job_type: string;
}

interface DbUser {
  user_id: number;
  program: string | null;
}

/**
 * API endpoint for analytics data that powers the admin dashboard.
 * Fetches real data from the database based on requested date range.
 */
export async function GET(request: Request) {
  try {
    // Parse URL and get the date range parameter
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'last12Months';
    
    // Calculate date ranges based on requested parameter
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case 'last30Days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last90Days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 90);
        break;
      case 'last6Months':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'yearToDate':
        startDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
        break;
      case 'last12Months':
      default:
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    console.warn(`[Analytics] Fetching data from ${startDate.toISOString()} to ${now.toISOString()}`);

    // Get all partners with their jobs and applications
    const partners = await prisma.partners.findMany({
      where: {
        NOT: {
          is_archived: true
        }
      },
      include: {
        jobs: {
          where: {
            archived: false
          },
          include: {
            applications: {
              where: {
                applied_at: {
                  gte: startDate
                }
              },
              select: {
                status: true,
                applied_at: true,
                user_id: true
              }
            }
          }
        }
      }
    }) as DbPartner[];

    // Calculate placements by partner
    const placementsByPartner = partners
      .map((partner: DbPartner) => ({
        partner: partner.name,
        placements: partner.jobs.reduce((total: number, job: DbPartner['jobs'][0]) => 
          total + (job.applications?.filter(app => app.status === "OFFER_ACCEPTED").length || 0), 0)
      }))
      .filter((p: PlacementData) => p.placements > 0)
      .sort((a: PlacementData, b: PlacementData) => b.placements - a.placements)
      .slice(0, 5);

    // If we have less than 5 partners with placements, add the remaining partners with 0 placements
    if (placementsByPartner.length < 5) {
      const remainingPartners = partners
        .filter((p: DbPartner) => !placementsByPartner.find((pp: PlacementData) => pp.partner === p.name))
        .slice(0, 5 - placementsByPartner.length)
        .map((p: DbPartner) => ({
          partner: p.name,
          placements: 0
        }));
      
      placementsByPartner.push(...remainingPartners);
    }

    // Get other analytics data with date filtering
    const [users, jobs, applications] = await Promise.all([
      prisma.users.findMany({
        where: {
          is_archived: false,
          created_at: {
            gte: startDate
          }
        },
        select: {
          user_id: true,
          program: true
        }
      }) as Promise<DbUser[]>,
      prisma.jobs.findMany({
        where: {
          archived: false,
          created_at: {
            gte: startDate
          }
        },
        select: {
          tags: true,
          job_type: true
        }
      }) as Promise<DbJob[]>,
      prisma.applications.findMany({
        where: {
          applied_at: {
            gte: startDate
          },
          isArchived: false
        },
        select: {
          status: true,
          applied_at: true,
          user_id: true
        }
      }) as Promise<DbApplication[]>
    ]);

    // Calculate applications over time
    const monthlyApplications = new Map<string, number>();
    
    // Initialize all months in the selected range with 0
    const startMonth = new Date(startDate);
    const totalMonths = (now.getFullYear() - startMonth.getFullYear()) * 12 + (now.getMonth() - startMonth.getMonth()) + 1;
    
    // Use Array.from to create a range of months and iterate over them
    Array.from({ length: totalMonths }).forEach((_, i) => {
      const currentMonth = new Date(startMonth);
      currentMonth.setMonth(startMonth.getMonth() + i);
      const monthKey = currentMonth.toLocaleString('default', { month: 'short' });
      monthlyApplications.set(monthKey, 0);
    });

    // Count applications per month
    applications.forEach((app: DbApplication) => {
      const appDate = new Date(app.applied_at);
      if (appDate >= startDate) {
        const monthKey = appDate.toLocaleString('default', { month: 'short' });
        monthlyApplications.set(monthKey, (monthlyApplications.get(monthKey) || 0) + 1);
      }
    });

    const applicationsOverTime = Array.from(monthlyApplications.entries())
      .map(([month, applications]) => ({
        month,
        applications
      }));

    // Calculate status distribution
    const statusCounts = new Map<string, number>();
    applications.forEach((app: DbApplication) => {
      // Map statuses to combined categories
      let mappedStatus;
      switch (app.status) {
        case 'INTERESTED':
          mappedStatus = 'Interested';
          break;
        case 'APPLIED':
          mappedStatus = 'Applied';
          break;
        case 'PHONE_SCREENING':
        case 'INTERVIEW_STAGE':
        case 'FINAL_INTERVIEW_STAGE':
          mappedStatus = 'Interview Stage';
          break;
        case 'OFFER_EXTENDED':
        case 'NEGOTIATION':
          mappedStatus = 'Negotiation';
          break;
        case 'OFFER_ACCEPTED':
          mappedStatus = 'Accepted';
          break;
        case 'REJECTED':
          mappedStatus = 'Rejected';
          break;
        default:
          mappedStatus = 'Other';
      }
      statusCounts.set(mappedStatus, (statusCounts.get(mappedStatus) || 0) + 1);
    });

    const statusDistribution = Array.from(statusCounts.entries())
      .map(([status, count]) => ({
        status,
        count
      }))
      // Sort in the specific order we want
      .sort((a, b) => {
        const order = ['Interested', 'Applied', 'Interview Stage', 'Negotiation', 'Accepted', 'Rejected', 'Other'];
        return order.indexOf(a.status) - order.indexOf(b.status);
      });

    // Calculate job categories from tags
    const categoryMap = new Map<string, number>();
    jobs.forEach((job: DbJob) => {
      if (job.tags && job.tags.length > 0) {
        job.tags.forEach(tag => {
          // Format tag for display (e.g., FRONT_END -> "Front End")
          const formattedTag = tag.replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
          categoryMap.set(formattedTag, (categoryMap.get(formattedTag) || 0) + 1);
        });
      } else {
        // Count jobs without tags as "Uncategorized"
        categoryMap.set("Uncategorized", (categoryMap.get("Uncategorized") || 0) + 1);
      }
    });

    const topJobCategories = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate job types distribution (full-time, part-time, etc.)
    const jobTypeMap = new Map<string, number>();
    jobs.forEach((job: DbJob) => {
      const formattedType = job.job_type.replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      jobTypeMap.set(formattedType, (jobTypeMap.get(formattedType) || 0) + 1);
    });

    const jobTypeDistribution = Array.from(jobTypeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate program distribution
    const programMap = new Map<string, number>();
    users.forEach((user: DbUser) => {
      const program = user.program ? user.program.replace(/_/g, ' ') : 'Other';
      const formattedProgram = program.charAt(0) + program.slice(1).toLowerCase();
      
      programMap.set(formattedProgram, (programMap.get(formattedProgram) || 0) + 1);
    });

    const programDistribution = Array.from(programMap.entries())
      .map(([program, count]) => ({ program, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate applicant average
    const uniqueApplicants = new Set(applications.map(app => app.user_id)).size;
    const averageApplicationsPerUser = applications.length > 0 ? 
      (applications.length / uniqueApplicants).toFixed(1) : 
      "0";

    // Build enhanced overview metrics
    const overview = {
      totalApplicants: uniqueApplicants,
      totalJobs: jobs.length,
      totalApplications: applications.length,
      averageApplicationsPerUser: averageApplicationsPerUser,
      acceptanceRate: applications.length > 0 ? 
        ((statusCounts.get('Accepted') || 0) / applications.length * 100).toFixed(1) + '%' : 
        "0%"
    };

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalApplicants: overview.totalApplicants,
          totalJobs: overview.totalJobs,
          totalApplications: overview.totalApplications,
          averageApplicationsPerUser: overview.averageApplicationsPerUser,
          acceptanceRate: overview.acceptanceRate
        },
        applicationsOverTime: applicationsOverTime,
        statusDistribution: statusDistribution,
        topJobCategories: topJobCategories,
        placementsByPartner: placementsByPartner,
        jobTypeDistribution: jobTypeDistribution,
        programDistribution: programDistribution
      }
    });
  } catch (error) {
    console.error("Error in analytics API:", error);
    // Return a more specific error message
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch analytics data",
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
