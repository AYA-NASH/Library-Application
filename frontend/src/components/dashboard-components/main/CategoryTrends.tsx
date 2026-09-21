import { useCategoriesTrends } from "@/api/hooks/LibraryServiceHooks/useDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateCategoryChartConfig, processCategoryDonutData, ProcessedCategoryData } from "@/constants/admin-dashboard/main/mainHelpers";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import type {
    PieSectorShapeProps,
} from "recharts/types/polar/Pie"

export function CategoryTrends() {
    const id = "pie-interactive"

    const [timeRange, setTimeRange] = useState("90");
    const { data: rawData, isLoading, isError } = useCategoriesTrends(Number(timeRange));

    const chartData = useMemo(() => processCategoryDonutData(rawData), [rawData]);
    const chartConfig = useMemo(() => generateCategoryChartConfig(chartData), [chartData]);

    // Active slice defaults to 0 (the top category)
    const [activeIndex, setActiveIndex] = useState(0);

    // Reset active index to 0 if the data timeframe changes
    useEffect(() => {
        setActiveIndex(0);
    }, [chartData]);

    const onPieEnter = useCallback(
        (_: any, index: number) => {
            setActiveIndex(index);
        },
        [setActiveIndex]
    );

    const renderPieShape = useCallback(
        ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
            if (index === activeIndex) {
                return (
                    <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector
                            {...props}
                            outerRadius={outerRadius + 25}
                            innerRadius={outerRadius + 12}
                        />
                    </g>
                )
            }
            return <Sector {...props} outerRadius={outerRadius} />
        },
        [activeIndex]
    );

    const getTimeRangeLabel = (val: string) => {
        if (val === "90") return "Last 3 months";
        if (val === "30") return "Last 30 days";
        if (val === "7") return "Last 7 days";
        return "Last 3 months";
    };

    console.log("Chart Data: ", chartData);
    console.log("Chart Config: ", chartConfig);

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex-row items-start space-y-0 pb-0 gap-4">
                <div className="grid gap-1 flex-1">
                    <CardTitle>Top Categories</CardTitle>
                    <CardDescription>Reading distribution by genre</CardDescription>
                </div>

                <Select value={timeRange} onValueChange={(val) => val && setTimeRange(val)}>
                    <SelectTrigger className="h-7 w-32.5 rounded-lg pl-2.5 text-xs">
                        <SelectValue>{getTimeRangeLabel(timeRange)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        <SelectItem value="90" className="rounded-lg">Last 3 months</SelectItem>
                        <SelectItem value="30" className="rounded-lg">Last 30 days</SelectItem>
                        <SelectItem value="7" className="rounded-lg">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="flex flex-1 justify-center pb-0 mt-4">
                {isLoading ? (
                    <div className="flex h-62.5 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex h-62.5 items-center justify-center text-destructive text-sm">
                        Failed to load data
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex h-62.5 items-center justify-center text-muted-foreground text-sm">
                        No reading data found
                    </div>
                ) : (
                    <ChartContainer
                        id={id}
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-w-75"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        formatter={(_value, _name, item) => {
                                            const data = item.payload as ProcessedCategoryData;
                                            return (
                                                <div className="flex flex-col gap-1 w-full min-w-32.5">
                                                    <div className="font-semibold text-foreground mb-1">
                                                        {data.category}
                                                    </div>
                                                    <div className="flex justify-between text-muted-foreground">
                                                        <span>Digital:</span>
                                                        <span className="font-medium text-foreground">{data.digitalTrends}</span>
                                                    </div>
                                                    <div className="flex justify-between text-muted-foreground">
                                                        <span>Physical:</span>
                                                        <span className="font-medium text-foreground">{data.physicalTrends}</span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                }
                            />
                            <Pie
                                data={chartData}
                                dataKey="total"
                                nameKey="category"
                                innerRadius={60}
                                strokeWidth={5}
                                onMouseEnter={onPieEnter}
                                shape={renderPieShape}
                            >

                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {chartData[activeIndex].total.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        {chartData[activeIndex]?.category || "Total Reads"}
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}

            </CardContent>
        </Card>
    )
}