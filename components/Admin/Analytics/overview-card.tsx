"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/basic/card";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { TrendingUp } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: { 
    value: string; 
    isPositive: boolean 
  };
  isLoading: boolean;
}

export function OverviewCard({
  title,
  value,
  icon,
  trend,
  isLoading,
}: OverviewCardProps) {
  return (
    <Card className="overflow-hidden">
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

        {!isLoading && trend && (
          <div
            className={`mt-4 text-xs flex items-center ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
            )}
            <span>{trend.value} from previous month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 