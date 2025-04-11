"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { ResponsivePie } from "@nivo/pie";
import { Skeleton } from "@/components/ui/feedback/skeleton";

interface ApplicationsChartProps {
  data: Array<{
    id: string;
    label: string;
    value: number;
  }>;
  isLoading: boolean;
}

export function ApplicationsChart({ data, isLoading }: ApplicationsChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Applications by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <div className="h-80">
            <ResponsivePie
              data={data}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: "circle",
                },
              ]}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 