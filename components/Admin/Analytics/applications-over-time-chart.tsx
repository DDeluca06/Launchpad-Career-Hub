"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { extendedPalette } from "@/lib/colors";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./common/custom-tooltip";

interface ApplicationsOverTimeProps {
  data: Array<{
    month: string;
    applications: number;
  }>;
  isLoading: boolean;
}

export function ApplicationsOverTimeChart({ data, isLoading }: ApplicationsOverTimeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Applications Over Time
        </CardTitle>
        <CardDescription>
          Monthly application submissions
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                width={40}
                tick={{ fontSize: 12 }}
                domain={[
                  0,
                  (dataMax: number) => Math.ceil(dataMax * 1.1),
                ]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke={extendedPalette.primaryBlue}
                fill={`${extendedPalette.primaryBlue}40`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 