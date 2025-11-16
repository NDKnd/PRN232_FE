"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";
import * as Recharts from "recharts";

export default function AdminDashboard() {
  const data = [
    { name: "Mon", value: 10 },
    { name: "Tue", value: 20 },
  ];

  const config = { value: { label: "Visits", color: "#3b82f6" } };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <h3>Traffic</h3>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} id="traffic">
            <Recharts.LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <Recharts.XAxis dataKey="name" />
              <Recharts.YAxis />
              <Recharts.Line
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
              />
              <Recharts.Tooltip content={<ChartTooltipContent />} />
              <Recharts.Legend content={<ChartLegend />} />
            </Recharts.LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
