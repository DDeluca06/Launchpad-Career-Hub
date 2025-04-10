import React from 'react';
import { Card, CardContent } from "@/components/ui/basic/card";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading: boolean;
  className?: string;
}

/**
 * Renders a statistic card that displays a title, value, and icon.
 *
 * When the data is loading, a skeleton placeholder is shown instead of the statistic value.
 *
 * @param title - The label for the statistic.
 * @param value - The statistic value to display.
 * @param icon - The icon associated with the statistic.
 * @param isLoading - Indicates whether the statistic value is currently loading.
 * @param className - Optional CSS class names to customize the card's styling.
 */
export function StatCard({ title, value, icon, isLoading, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold mt-1">{value}</p>
            )}
          </div>
          <div className="rounded-full p-3 bg-gray-50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
} 