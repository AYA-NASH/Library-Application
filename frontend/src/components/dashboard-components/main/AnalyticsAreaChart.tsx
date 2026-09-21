import { usePhysicalDigitalActivities } from "@/api/hooks/LibraryServiceHooks/useDashboard";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { AreaChart, CartesianGrid, XAxis, Area } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const description = "An interactive area chart"

const chartConfig = {
    physicalBorrows: {
        label: "Physical Borrows",
        color: "var(--chart-1)",
    },
    digitalReads: {
        label: "Digital Reads",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export const AnalyticsAreaChart = () => {
    const [timeRange, setTimeRange] = useState("7");

    const { data: chartData, isLoading, isError } = usePhysicalDigitalActivities(Number(timeRange));

    const getTimeRangeLabel = (val: string) => {
        if (val === "90") return "Last 3 months";
        if (val === "30") return "Last Month";
        if (val === "7") return "Last 7 days";
        return "Last 3 months";
    };

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Borrowing & Digital Reads Activities</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last {getTimeRangeLabel(timeRange)}
                    </CardDescription>
                </div>

                <Select
                    value={timeRange}
                    onValueChange={(value) => {
                        if (value) setTimeRange(value);
                    }}
                >
                    <SelectTrigger
                        className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue>{getTimeRangeLabel(timeRange)}</SelectValue>
                    </SelectTrigger>

                    <SelectContent className="rounded-xl">
                        <SelectItem value="90" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30" className="rounded-lg">
                            Last month
                        </SelectItem>
                        <SelectItem value="7" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {isLoading ? (
                    <div className="flex h-62.5 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex h-62.5 items-center justify-center text-destructive">
                        Failed to load chart data
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-62.5"
                    >
                        <AreaChart data={chartData || []}>
                            <defs>
                                <linearGradient id="fillPhysicalBorrows" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-PhysicalBorrows)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-PhysicalBorrows)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillDigitalReads" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-DigitalReads)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-DigitalReads)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />

                            <ChartTooltip
                                cursor={true}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />

                            <Area
                                dataKey="digitalReads"
                                type="monotone"
                                fill="url(#fillDigitalReads)"
                                stroke="var(--color-digitalReads)"
                                stackId="a"
                            />
                            <Area
                                dataKey="physicalBorrows"
                                type="monotone"
                                fill="url(#fillPhysicalBorrows)"
                                stroke="var(--color-physicalBorrows)"
                                stackId="a"
                            />

                            <ChartLegend content={<ChartLegendContent />} />

                        </AreaChart>
                    </ChartContainer>
                )}

            </CardContent>
        </Card>
    )
}