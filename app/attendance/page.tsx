"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subMonths, subYears } from "date-fns";
import { Calendar as CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AttendanceData {
  id: number;
  activityType: string;
  maleCount: number;
  femaleCount: number;
  childrenCount: number;
  totalAttendance: number;
  attendanceDate: string;
  createdDate: string;
  updatedDate: string;
}

const chartConfig = {
  totalAttendance: {
    label: "Total Attendance",
    color: "hsl(var(--chart-1))",
  },
  maleCount: {
    label: "Male",
    color: "hsl(var(--chart-2))",
  },
  femaleCount: {
    label: "Female",
    color: "hsl(var(--chart-3))",
  },
  childrenCount: {
    label: "Children",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const fetchAttendanceData = async (startDate: Date, endDate: Date) => {
  const response = await fetch(
    `/api/attendance/range?startDate=${format(startDate, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}`
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch attendance data");
  }

  return result.data as AttendanceData[];
};

export default function AttendanceChartPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const {
    data: attendanceData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["attendance", date?.from, date?.to],
    queryFn: () => fetchAttendanceData(date!.from!, date!.to!),
    enabled: !!date?.from && !!date?.to,
  });

  const handleQuickSelect = (range: string) => {
    const today = new Date();
    let from: Date;
    const to: Date = today;

    switch (range) {
      case "last-month":
        from = subMonths(today, 1);
        break;
      case "last-3-months":
        from = subMonths(today, 3);
        break;
      case "last-6-months":
        from = subMonths(today, 6);
        break;
      case "last-year":
        from = subYears(today, 1);
        break;
      default:
        from = subMonths(today, 1);
    }

    setDate({ from, to });
  };

  const chartData = attendanceData.map((item) => ({
    date: format(new Date(item.attendanceDate), "MMM dd"),
    totalAttendance: item.totalAttendance,
    maleCount: item.maleCount,
    femaleCount: item.femaleCount,
    childrenCount: item.childrenCount,
    activityType: item.activityType,
  }));

  return (
    <div className="mx-auto max-w-7xl mb-10">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Attendance Analytics</h1>
        <p className="text-muted-foreground">
          View attendance trends and statistics
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select onValueChange={handleQuickSelect} defaultValue="last-month">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Quick select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-month">Last month</SelectItem>
            <SelectItem value="last-3-months">Last 3 months</SelectItem>
            <SelectItem value="last-6-months">Last 6 months</SelectItem>
            <SelectItem value="last-year">Past year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      )}

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && attendanceData.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No attendance data found for the selected date range
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && attendanceData.length > 0 && (
        <>
          <div className="lg:grid lg:grid-cols-2 gap-6 mb-6">
            {/* Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Total Attendance Trend</CardTitle>
                <CardDescription>
                  Showing attendance from{" "}
                  {date?.from && format(date.from, "PPP")} to{" "}
                  {date?.to && format(date.to, "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalAttendance"
                        stroke="var(--color-totalAttendance)"
                        fill="var(--color-totalAttendance)"
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Breakdown</CardTitle>
                <CardDescription>
                  Male, Female, and Children attendance comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Legend />
                      <Bar
                        dataKey="maleCount"
                        fill="var(--color-maleCount)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="femaleCount"
                        fill="var(--color-femaleCount)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="childrenCount"
                        fill="var(--color-childrenCount)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Records */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                All attendance records for selected date range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Male</TableHead>
                    <TableHead>Female</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>
                        {format(new Date(record.attendanceDate), "PPP")}
                      </TableCell>
                      <TableCell>{record.activityType}</TableCell>
                      <TableCell>{record.maleCount}</TableCell>
                      <TableCell>{record.femaleCount}</TableCell>
                      <TableCell>{record.childrenCount}</TableCell>
                      <TableCell className="font-medium">
                        {record.totalAttendance}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
