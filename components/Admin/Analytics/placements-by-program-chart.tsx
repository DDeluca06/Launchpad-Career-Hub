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
    program: string;
    placements: number;
  }>;
  barColor: string;
  isLoading: boolean;
}

export function PlacementsByProgramChart({ data, barColor, isLoading }: PlacementsByProgramChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Placements by Program</CardTitle>
        <CardDescription>
          Job placement success rate by program
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
              <XAxis dataKey="program" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="placements"
                name="Placements"
                fill={barColor}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 