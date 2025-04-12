import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { extendedPalette } from "@/lib/colors";

interface Stat {
  label: string;
  value: string;
}

interface DashboardSectionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
  stats: Stat[];
  color: string;
  apiEndpoint?: string;
}

/**
 * Renders a dashboard section card that summarizes key metrics.
 *
 * The card includes a colored top border, a header with an icon and title,
 * a grid displaying two statistics, and a footer with a button linking to additional details.
 * Optionally fetches data from an API endpoint if provided.
 *
 * @param title - The section title displayed in the card header.
 * @param description - Optional brief description of the section's content.
 * @param icon - An icon or React node representing the section.
 * @param href - The URL or route path for the "View Details" link.
 * @param stats - An array of objects containing a label and value for each statistic.
 * @param color - The accent color used for the top border and statistic values.
 * @param apiEndpoint - Optional API endpoint to fetch real data.
 *
 * @returns The rendered dashboard section card element.
 */
export function DashboardSection({
  title,
  description,
  icon,
  href,
  stats: initialStats,
  color,
  apiEndpoint
}: DashboardSectionProps) {
  const [stats, setStats] = useState<Stat[]>(initialStats);
  const [loading, setLoading] = useState(!!apiEndpoint);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiEndpoint) return;

    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch data');
        }
        
        // Update stats with API data
        const updatedStats = initialStats.map(stat => {
          // Try direct match with the exact label
          if (data.stats && data.stats[stat.label] !== undefined) {
            return {
              ...stat,
              value: data.stats[stat.label].toString()
            };
          }
          
          // Try camelCase version of the label
          const camelLabel = stat.label
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
              index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, '');
            
          if (data.stats && data.stats[camelLabel] !== undefined) {
            return {
              ...stat,
              value: data.stats[camelLabel].toString()
            };
          }
          
          // If all else fails, keep the original stat
          return stat;
        });
        
        setStats(updatedStats);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error(`Error fetching data from ${apiEndpoint}:`, error);
        setLoading(false);
        setError("Failed to load data");
        // Keep using the initial stats on error
      }
    };
    
    fetchData();
  }, [apiEndpoint, initialStats]);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200 bg-card">
      <div className="h-1 w-full" style={{ backgroundColor: color }}></div>
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
            {icon}
            {title}
          </CardTitle>
          {error && (
            <div className="text-xs text-red-500">
              {error}
            </div>
          )}
        </div>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              {loading ? (
                <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto mt-1"></div>
              ) : (
                <p className="text-lg font-bold" style={{ color }}>
                  {stat.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={href} className="w-full">
          <Button
            variant="outline"
            className="w-full justify-between group-hover:border-opacity-50 group-hover:bg-muted"
            style={{ borderColor: extendedPalette.primaryBlue, color: extendedPalette.teal }}
          >
            View Details
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 