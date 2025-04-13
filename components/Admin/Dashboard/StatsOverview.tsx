import { Briefcase, Calendar, Building, Users } from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { StatCard } from "./StatCard";
import { extendedPalette } from "@/lib/colors";

/**
 * Renders a responsive grid of dashboard statistics cards.
 * 
 * This component fetches statistics data using the useStats hook and displays
 * four key metrics: Total Jobs, Total Applications, Active Interviews, and Partner Companies.
 * Each metric is displayed with an appropriate icon and color.
 * 
 * @returns A React component displaying a grid of stat cards
 */
export function StatsOverview() {
  const { stats, loading: statsLoading } = useStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard 
        title="Total Jobs" 
        value={stats.totalJobs} 
        icon={<Briefcase className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />} 
        isLoading={statsLoading}
        color={extendedPalette.primaryBlue}
      />
      <StatCard 
        title="Total Applications" 
        value={stats.totalApplications} 
        icon={<Users className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />} 
        isLoading={statsLoading}
        color={extendedPalette.primaryGreen}
      />
      <StatCard 
        title="Active Interviews" 
        value={stats.activeInterviews} 
        icon={<Calendar className="h-5 w-5" style={{ color: extendedPalette.teal }} />} 
        isLoading={statsLoading}
        color={extendedPalette.teal}
      />
      <StatCard 
        title="All Companies" 
        value={stats.partnerCompanies} 
        icon={<Building className="h-5 w-5" style={{ color: extendedPalette.lightBlue }} />} 
        isLoading={statsLoading}
        color={extendedPalette.lightBlue}
      />
    </div>
  );
} 