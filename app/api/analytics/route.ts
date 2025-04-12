import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define interfaces for the application and job types

interface PlacementData {
  partner: string;
  placements: number;
}

interface DbPartner {
  name: string;
  jobs: {
    applications: {
      status: string;
    }[];
  }[];
}

interface DbApplication {
  status: string;
  applied_at: Date;
}

interface DbJob {
  tags: string[];
}

export async function GET() {
  try {
    // Get all partners with their jobs and applications
    const partners = await prisma.partners.findMany({
      where: {
        is_archived: false
      },
      include: {
        jobs: {
          where: {
            archived: false
          },
          include: {
            applications: {
              select: {
                status: true
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

    // Get other analytics data...
    const [users, jobs, applications] = await Promise.all([
      prisma.users.findMany({
        where: {
          is_archived: false
        }
      }),
      prisma.jobs.findMany({
        where: {
          archived: false
        },
        select: {
          tags: true
        }
      }) as Promise<DbJob[]>,
      prisma.applications.findMany({
        where: {
          applied_at: {
            gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        },
        select: {
          status: true,
          applied_at: true
        }
      }) as Promise<DbApplication[]>
    ]);

    // Calculate applications over time
    const monthlyApplications = new Map<string, number>();
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    applications.forEach((app: DbApplication) => {
      const appDate = new Date(app.applied_at);
      if (appDate >= twelveMonthsAgo) {
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
        const order = ['Interested', 'Applied', 'Interview Stage', 'Negotiation', 'Accepted', 'Rejected'];
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

    // Build overview metrics
    const overview = {
      totalApplicants: users.length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
    };

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalApplicants: overview.totalApplicants,
          totalJobs: overview.totalJobs,
          totalApplications: overview.totalApplications
        },
        applicationsOverTime: applicationsOverTime,
        statusDistribution: statusDistribution,
        topJobCategories: topJobCategories,
        placementsByPartner: placementsByPartner
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
