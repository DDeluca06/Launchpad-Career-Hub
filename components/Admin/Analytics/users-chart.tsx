"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { ResponsiveLine } from "@nivo/line";
import { Skeleton } from "@/components/ui/feedback/skeleton";

interface UsersChartProps {
  data: Array<{
    id: string;
    data: Array<{
      x: string | Date;
      y: number;
    }>;
  }>;
  isLoading: boolean;
}

export function UsersChart({ data, isLoading }: UsersChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>User Registrations Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <div className="h-80">
            <ResponsiveLine
              data={data}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
                reverse: false,
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Date",
                legendOffset: 36,
                legendPosition: "middle",
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Count",
                legendOffset: -40,
                legendPosition: "middle",
              }}
              pointSize={10}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 