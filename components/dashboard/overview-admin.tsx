"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ProjectSummaryByUserId, WorkSummaryAnalyticsByUserId } from "@/server/dashboard"
import { Project } from "@/types/project"

export const description = "work summary for the last 3 months"

const chartConfig = {
  projects: {
    label: "Projects",
  },
  approvedHours: {
    label: "Work Hours (Approved)",
  },
  pendingHours: {
    label: "Work Hours (Pending)",
  },
  declinedHours: {
    label: "Work Hours (Declined)",
  },
} satisfies ChartConfig


export function OverviewAdmin({
  data,
  projectSummary
}: {
  data: WorkSummaryAnalyticsByUserId[];
  projectSummary?: ProjectSummaryByUserId
}) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("approvedHours");

  const total = {
    projects: projectSummary?.totalProjects??0,
    approvedHours: data.reduce((acc, curr) => acc + curr.totalApprovedHours, 0),
    pendingHours: data.reduce((acc, curr) => acc + curr.totalPendingHours, 0),
    declinedHours: data.reduce((acc, curr) => acc + curr.totalDeclinedHours, 0),
  };

  // Transform data for the chart
  const transformedData = data.map((entry) => ({
    date: entry.date,
    approvedHours: entry.totalApprovedHours,
    pendingHours: entry.totalPendingHours,
    declinedHours: entry.totalDeclinedHours,
  }));
  
  const projectData = projectSummary?.projects.map((entry) => ({
    name: entry.name,
    Approved: entry.approved_hours,
    Pending: entry.pending_hours,
  }))
  return (
    <Card className="min-w-[420px] overflow-x-auto" >
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 md:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Summary
          </CardDescription>
        </div>
        <div className="flex">
          {["projects","approvedHours", "pendingHours", "declinedHours"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 ">
          { activeChart === "projects"
            ? <>
                <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                  <BarChart accessibilityLayer data={projectData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent 
                          indicator="dot" 
                          labelFormatter={(value) => {
                            return <>{value + " (hours)"}</>
                          }}
                        />
                      }
                    />
                    <Bar dataKey="Pending" fill="hsl(var(--primary))" radius={4} />
                    <Bar dataKey="Approved" fill="hsl(var(--secondary))" radius={4} />
                  </BarChart>
                </ChartContainer>
            </>
            :<>
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[300px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={transformedData} // Use transformed data
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey={"date"}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Bar dataKey={activeChart} fill={"hsl(var(--primary))"} />
                </BarChart>
              </ChartContainer>
            </>
          }
      </CardContent>
    </Card>
  );
}
