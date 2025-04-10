"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { ResponsiveBar } from "@nivo/bar";
import { Skeleton } from "@/components/ui/feedback/skeleton";

interface JobsChartProps {
  data: Array<{
    category: string;
    count: number;
  }>;
  isLoading: boolean;
}

export function JobsChart({ data, isLoading }: JobsChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Jobs by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <div className="h-80">
            <ResponsiveBar
              data={data}
              keys={["count"]}
              indexBy="category"
              margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "blues" }}
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "Category",
                legendPosition: "middle",
                legendOffset: 50,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Count",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              legends={[
                {
                  dataFrom: "keys",
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: "left-to-right",
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              role="application"
              ariaLabel="Jobs by Category"
              barAriaLabel={(e) => `${e.indexValue}: ${e.value} jobs`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 