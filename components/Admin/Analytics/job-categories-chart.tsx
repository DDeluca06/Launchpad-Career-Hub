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

interface JobCategoriesChartProps {
  data: Array<{
    category: string;
    count: number;
  }>;
  colors: string[];
  isLoading: boolean;
}

// Helper function to calculate chart domains
const calculateDomain = (dataMax: number) => Math.ceil(dataMax * 1.2);

export function JobCategoriesChart({ data, colors, isLoading }: JobCategoriesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Job Categories</CardTitle>
        <CardDescription>
          Most popular job categories by application volume
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                width={40}
                tick={{ fontSize: 12 }}
                domain={[0, calculateDomain]}
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