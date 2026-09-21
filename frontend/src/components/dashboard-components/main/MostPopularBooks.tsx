import { useState } from "react";
import { useTopBooks } from "@/api/hooks/LibraryServiceHooks/useDashboard";
import { TopBook } from "@/models/MainDashboard";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";

// Chart config uses standard Shadcn theme variables
const chartConfig = {
    percentage: {
        label: "Read Share",
        color: "var(--chart-1)",
    }
} satisfies ChartConfig;

export function MostPopularBooks() {
    const [timeRange, setTimeRange] = useState("90");
    const { data: chartData, isLoading, isError } = useTopBooks(Number(timeRange));

    const getTimeRangeLabel = (val: string) => {
        if (val === "90") return "Last 3 months";
        if (val === "30") return "Last 30 days";
        if (val === "7") return "Last 7 days";
        return "Last 3 months";
    };

    return (
        <Card className="flex flex-col h-full shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="grid gap-1">
                    <CardTitle>Top Books</CardTitle>
                    <CardDescription>
                        Highest performing titles for {getTimeRangeLabel(timeRange).toLowerCase()}
                    </CardDescription>
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

            <CardContent className="flex-1">
                {isLoading ? (
                    <div className="flex h-87.5 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex h-87.5 items-center justify-center text-destructive text-sm">
                        Failed to load top books
                    </div>
                ) : !chartData || chartData.length === 0 ? (
                    <div className="flex h-87.5 items-center justify-center text-muted-foreground text-sm">
                        No reading data found for this period
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="w-full h-87.5"
                    >
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid horizontal={false} vertical={true} strokeDasharray="3 3" opacity={0.3} />

                            {/* Hide the X-axis line but keep the domain locked from 0 to 100 for the percentage */}
                            <XAxis
                                type="number"
                                dataKey="percentage"
                                domain={[0, 100]}
                                hide
                            />

                            <YAxis
                                type="category"
                                dataKey="title"
                                axisLine={false}
                                tickLine={false}
                                width={220} // Provide enough width for Book Title + Author
                                tick={({ x, y, payload }) => {
                                    // Find the corresponding book object to get the author and total reads
                                    const book = chartData.find(b => b.title === payload.value);
                                    if (!book) return null;

                                    return (
                                        <g transform={`translate(${x},${y})`}>
                                            {/* Book Title & (Total Reads) */}
                                            <text x={-10} y={-4} textAnchor="end" className="fill-foreground text-sm font-semibold">
                                                {book.title.length > 22 ? `${book.title.substring(0, 22)}...` : book.title}
                                                <tspan className="fill-muted-foreground font-normal ml-1">
                                                    {" "} ({book.totalReads})
                                                </tspan>
                                            </text>
                                            {/* Author Name */}
                                            <text x={-10} y={14} textAnchor="end" className="fill-muted-foreground text-xs">
                                                {book.author.length > 30 ? `${book.author.substring(0, 30)}...` : book.author}
                                            </text>
                                        </g>
                                    );
                                }}
                            />

                            <ChartTooltip
                                cursor={{ fill: 'var(--accent)', opacity: 0.2 }}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        formatter={(_value, _name, item) => {
                                            const data = item.payload as TopBook;
                                            return (
                                                <div className="flex flex-col gap-1.5 w-full min-w-40 py-1">
                                                    <div>
                                                        <div className="font-semibold text-foreground leading-none">{data.title}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">by {data.author}</div>
                                                    </div>

                                                    <div className="flex justify-between items-center mt-2 text-muted-foreground">
                                                        <span>Digital Reads:</span>
                                                        <span className="font-medium text-foreground">{data.digitalReads}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-muted-foreground">
                                                        <span>Physical Borrows:</span>
                                                        <span className="font-medium text-foreground">{data.physicalReads}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center border-t border-border pt-1.5 mt-1 text-foreground">
                                                        <span className="font-medium">Total Reads:</span>
                                                        <span className="font-bold">{data.totalReads}</span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                }
                            />

                            <Bar
                                dataKey="percentage"
                                fill="var(--color-percentage)"
                                radius={[0, 4, 4, 0]}
                                barSize={24}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}