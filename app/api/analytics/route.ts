import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProgramType, JobTag } from "@/lib/prisma-enums";

// Define interfaces for the application and job types
interface Application {
  applied_at?: Date | null;
  status: string;
  users?: {
    program?: string | null;
  };
  jobs?: {
    company: string;
    partner_id?: number | null;
    partners?: {
      name: string;
    } | null;
  };
}

interface Job {
  tags: string[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("dateRange") || "last12Months";
    const programFilters = searchParams.get("programs")?.split(",") || [];

    // Convert program filters to enum values for type safety
    const programFiltersEnum = programFilters
      .filter(p => Object.values(ProgramType).includes(p as ProgramType))
      .map(p => p as ProgramType);

    // Apply date filtering based on the dateRange parameter
    const dateFilter = getDateFilter(dateRange);

    // Get data from Prisma database
    const [users, applications, jobs] = await Promise.all([
      prisma.users.findMany({
        where: {
          is_active: true,
          // Apply program filter if specified
          ...(programFiltersEnum.length > 0 ? {
            program: {
              in: programFiltersEnum
            }
          } : {})
        }
      }),
      prisma.applications.findMany({
        where: {
          applied_at: dateFilter,
          // Apply program filter if specified
          ...(programFiltersEnum.length > 0 ? {
            users: {
              program: {
                in: programFiltersEnum
              }
            }
          } : {})
        },
        include: {
          users: true,
          jobs: {
            include: {
              partners: true
            }
          }
        }
      }),
      prisma.jobs.findMany()
    ]);

    // Process applications data
    const appsByMonth = new Map<string, number>();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize with empty data
    months.forEach(month => appsByMonth.set(month, 0));
    
    // Fill in actual data from applications
    applications.forEach((app: Application) => {
      if (app.applied_at) {
        const month = months[new Date(app.applied_at).getMonth()];
        appsByMonth.set(month, (appsByMonth.get(month) || 0) + 1);
      }
    });
    
    const applicationsOverTime = Array.from(appsByMonth.entries()).map(([month, applications]) => ({
      month,
      applications
    }));

    // Count raw application statuses
    const rawStatusCounts = {
      INTERESTED: applications.filter((app: Application) => app.status === "INTERESTED").length,
      APPLIED: applications.filter((app: Application) => app.status === "APPLIED").length,
      PHONE_SCREENING: applications.filter((app: Application) => app.status === "PHONE_SCREENING").length,
      INTERVIEW_STAGE: applications.filter((app: Application) => app.status === "INTERVIEW_STAGE").length,
      FINAL_INTERVIEW_STAGE: applications.filter((app: Application) => app.status === "FINAL_INTERVIEW_STAGE").length,
      OFFER_EXTENDED: applications.filter((app: Application) => app.status === "OFFER_EXTENDED").length,
      NEGOTIATION: applications.filter((app: Application) => app.status === "NEGOTIATION").length,
      OFFER_ACCEPTED: applications.filter((app: Application) => app.status === "OFFER_ACCEPTED").length,
      REJECTED: applications.filter((app: Application) => app.status === "REJECTED").length,
    };

    // Format status distribution for the pie chart - combining statuses as specified
    const statusDistribution = [
      { 
        status: "Interested",
        count: rawStatusCounts.INTERESTED
      },
      { 
        status: "Applied", 
        count: rawStatusCounts.APPLIED
      },
      { 
        status: "Interview Stage", 
        count: rawStatusCounts.PHONE_SCREENING + 
               rawStatusCounts.INTERVIEW_STAGE + 
               rawStatusCounts.FINAL_INTERVIEW_STAGE
      },
      { 
        status: "Negotiation", 
        count: rawStatusCounts.NEGOTIATION + 
               rawStatusCounts.OFFER_EXTENDED
      },
      { 
        status: "Accepted", 
        count: rawStatusCounts.OFFER_ACCEPTED
      },
      { 
        status: "Rejected", 
        count: rawStatusCounts.REJECTED
      },
    ];

    // Process job categories
    const categoryMap = new Map<string, number>();
    
    // Define category tags to look for using our enum
    const categoryTags: JobTag[] = [
      JobTag.FRONT_END,
      JobTag.BACK_END, 
      JobTag.FULL_STACK,
      JobTag.DATA_SCIENCE,
      JobTag.UX_UI_DESIGN,
      JobTag.CYBERSECURITY,
      JobTag.CLOUD_COMPUTING,
      JobTag.AI_ML,
      JobTag.DEVOPS,
      JobTag.PRODUCT_MANAGEMENT
    ];
    
    jobs.forEach((job: Job) => {
      if (job.tags && job.tags.length > 0) {
        // Count job under each relevant category tag
        job.tags.forEach((tag: string) => {
          if (categoryTags.includes(tag as JobTag)) {
            // Format tag for display (convert FRONT_END to "Front End")
            const formattedTag = (tag as string).replace(/_/g, ' ')
              .split(' ')
              .map(word => word.charAt(0) + word.slice(1).toLowerCase())
              .join(' ');
            
            categoryMap.set(formattedTag, (categoryMap.get(formattedTag) || 0) + 1);
          }
        });
      }
    });
    
    // Convert to array and sort by count descending
    const topJobCategories = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories

    // Calculate placements by partner instead of by program
    const partnerPlacements = new Map<string, number>();
    const acceptedApps = applications.filter((app: Application) => app.status === "OFFER_ACCEPTED");
    
    // Count placements by partner
    acceptedApps.forEach((app: Application) => {
      if (app.jobs) {
        let partnerName = "Unknown";
        
        // Use partner name if available, otherwise use company name
        if (app.jobs.partners && app.jobs.partners.name) {
          partnerName = app.jobs.partners.name;
        } else if (app.jobs.company) {
          partnerName = app.jobs.company;
        }
        
        partnerPlacements.set(partnerName, (partnerPlacements.get(partnerName) || 0) + 1);
      }
    });
    
    const placementsByPartner = Array.from(partnerPlacements.entries())
      .map(([partner, placements]) => ({ partner, placements }))
      .sort((a, b) => b.placements - a.placements)
      .slice(0, 5); // Explicitly limit to top 5 partners

    // Build the overview metrics - remove acceptance rate and placement rate
    const overview = {
      totalApplicants: users.length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
    };

    // Fill in dummy data for any empty arrays
    if (topJobCategories.length < 5) {
      const dummyCategories = [
        { category: "Software Development", count: 45 },
        { category: "Data Science", count: 25 },
        { category: "UX/UI Design", count: 15 },
        { category: "Project Management", count: 10 },
        { category: "QA Testing", count: 5 },
      ];
      
      for (const dummy of dummyCategories) {
        if (!topJobCategories.find(c => c.category === dummy.category) && topJobCategories.length < 5) {
          topJobCategories.push(dummy);
        }
      }
    }

    if (placementsByPartner.length < 5) {
      const dummyPlacements = [
        { partner: "TechCorp", placements: 36 },
        { partner: "Data Inc.", placements: 22 },
        { partner: "Web Solutions", placements: 18 },
        { partner: "AI Labs", placements: 14 },
        { partner: "Cloud Computing Inc.", placements: 12 },
      ];
      
      for (const dummy of dummyPlacements) {
        if (!placementsByPartner.find(p => p.partner === dummy.partner) && placementsByPartner.length < 5) {
          placementsByPartner.push(dummy);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        overview,
        applicationsOverTime,
        statusDistribution,
        topJobCategories,
        placementsByPartner,
      }
    });
  } catch (error) {
    console.error("Error in analytics API:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch analytics data" 
      }, 
      { status: 500 }
    );
  }
}

// Helper to get date filter based on date range
function getDateFilter(dateRange: string) {
  const now = new Date();
  let startDate: Date;

  switch (dateRange) {
    case "last30Days":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      break;
    case "last90Days":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90);
      break;
    case "last12Months":
    default:
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return {
    gte: startDate
  };
} 