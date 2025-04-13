"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./common/custom-tooltip";

interface PlacementsByProgramChartProps {
  data: Array<{
    partner: string;
    placements: number;
  }>;
  barColor?: string;
  colors?: string[];
  isLoading: boolean;
}

export function PlacementsByProgramChart({ data, barColor, colors, isLoading }: PlacementsByProgramChartProps) {
  // Use the first color from colors array if barColor is not provided
  const fillColor = barColor || (colors && colors.length > 0 ? colors[0] : '#4338CA');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Placements by Partner</CardTitle>
        <CardDescription>
          Successful job placements with partnering companies
        </CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="partner" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="placements"
                name="Placements"
                fill={fillColor}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 