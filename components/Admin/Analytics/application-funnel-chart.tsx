"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./common/custom-tooltip";

interface ApplicationFunnelChartProps {
  data: Array<{
    status: string;
    count: number;
  }>;
  colors: string[];
  isLoading: boolean;
}

export function ApplicationFunnelChart({ data, colors, isLoading }: ApplicationFunnelChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Application Funnel</CardTitle>
        <CardDescription>
          Conversion at each stage of the application process
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
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="status"
                type="category"
                width={110}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" name="Applications">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 