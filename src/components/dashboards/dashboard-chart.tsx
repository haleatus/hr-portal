"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

type ChartData = {
  date: string;
  completed: number;
  total: number;
};

export function DashboardChart() {
  const [mounted, setMounted] = useState(false);

  // Ensure the chart is only rendered on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data for the chart
  const data: ChartData[] = [
    { date: "Mar 1", completed: 10, total: 25 },
    { date: "Mar 5", completed: 15, total: 25 },
    { date: "Mar 10", completed: 22, total: 25 },
    { date: "Mar 15", completed: 28, total: 40 },
    { date: "Mar 20", completed: 35, total: 40 },
    { date: "Mar 25", completed: 42, total: 60 },
    { date: "Mar 30", completed: 50, total: 60 },
    { date: "Apr 1", completed: 55, total: 70 },
    { date: "Apr 5", completed: 65, total: 80 },
    { date: "Apr 10", completed: 78, total: 124 },
  ];

  if (!mounted) {
    return (
      <div className="h-[350px] w-full animate-pulse rounded-md bg-muted"></div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.2}
            />
          </linearGradient>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--muted-foreground))"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--muted-foreground))"
              stopOpacity={0.2}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload as ChartData;
              return (
                <Card className="border-border p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Date
                      </span>
                      <span className="font-medium">{data.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Completed
                      </span>
                      <span className="font-medium">{data.completed}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Total
                      </span>
                      <span className="font-medium">{data.total}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Completion
                      </span>
                      <span className="font-medium">
                        {Math.round((data.completed / data.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </Card>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="completed"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorCompleted)"
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--muted-foreground))"
          fillOpacity={1}
          fill="url(#colorTotal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
