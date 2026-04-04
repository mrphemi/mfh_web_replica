"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, subMonths, subYears } from "date-fns";
import { toast } from "sonner";
import {
  BarChart2,
  Calendar as CalendarIcon,
  Pencil,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
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
  totalAttendance: { label: "Total", color: "var(--chart-1)" },
  maleCount: { label: "Male", color: "var(--chart-5)" },
  femaleCount: { label: "Female", color: "var(--chart-3)" },
  childrenCount: { label: "Children", color: "var(--chart-4)" },
} satisfies ChartConfig;

const fetchAttendanceData = async (startDate: Date, endDate: Date) => {
  const response = await fetch(
    `/api/attendance/range?startDate=${format(startDate, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}`,
  );
  const result = await response.json();
  if (!result.success)
    throw new Error(result.message || "Failed to fetch attendance data");
  return result.data as AttendanceData[];
};

const deleteAttendance = async (id: number) => {
  const res = await fetch(`/api/attendance/delete/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (!result.success)
    throw new Error(result.message || "Failed to delete record");
};

export default function AttendanceChartPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [deleteTarget, setDeleteTarget] = useState<AttendanceData | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAttendance(id),
    onSuccess: () => {
      toast.success("Record deleted.");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete record.");
    },
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
    const to = today;
    let from: Date;
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
  }));

  const stats = useMemo(() => {
    if (!attendanceData.length) return null;
    const total = attendanceData.reduce((s, r) => s + r.totalAttendance, 0);
    const peak = Math.max(...attendanceData.map((r) => r.totalAttendance));
    const avg = Math.round(total / attendanceData.length);
    return { sessions: attendanceData.length, total, peak, avg };
  }, [attendanceData]);

  return (
    <>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Page header + controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Attendance
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track and analyse service attendance over time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select onValueChange={handleQuickSelect} defaultValue="last-month">
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-month">Last month</SelectItem>
                <SelectItem value="last-3-months">Last 3 months</SelectItem>
                <SelectItem value="last-6-months">Last 6 months</SelectItem>
                <SelectItem value="last-year">Past year</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-36 justify-start text-left font-normal",
                    !date?.from && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 size-3.5 shrink-0" />
                  {date?.from ? (
                    format(date.from, "dd MMM y")
                  ) : (
                    <span>From</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={date?.from}
                  onSelect={(from) => setDate((prev) => ({ ...prev, from }))}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-36 justify-start text-left font-normal",
                    !date?.to && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 size-3.5 shrink-0" />
                  {date?.to ? format(date.to, "dd MMM y") : <span>To</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={date?.to}
                  onSelect={(to) =>
                    setDate((prev) => ({ from: prev?.from, to }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Stat cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-3 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-16 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Sessions", value: stats.sessions, icon: BarChart2 },
              {
                label: "Total Attended",
                value: stats.total.toLocaleString(),
                icon: Users,
              },
              { label: "Peak Session", value: stats.peak, icon: Zap },
              { label: "Avg Attendance", value: stats.avg, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                  <CardDescription className="text-xs font-medium uppercase tracking-wide">
                    {label}
                  </CardDescription>
                  <Icon className="size-3.5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold tabular-nums">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Error */}
        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !error && attendanceData.length === 0 && (
          <Card>
            <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
              <Users className="size-9 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No records found for this date range.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Charts + table */}
        {!isLoading && !error && attendanceData.length > 0 && (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm font-semibold">
                    Total Attendance Trend
                  </CardTitle>
                  <CardDescription>
                    {date?.from && format(date.from, "dd MMM yyyy")} –{" "}
                    {date?.to && format(date.to, "dd MMM yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart
                        data={chartData}
                        margin={{ left: -16, right: 4 }}
                      >
                        <defs>
                          <linearGradient
                            id="fillTotal"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--chart-1)"
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--chart-1)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          vertical={false}
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 11 }}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent />}
                        />
                        <Area
                          type="monotone"
                          dataKey="totalAttendance"
                          stroke="var(--chart-1)"
                          fill="url(#fillTotal)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm font-semibold">
                    Attendance Breakdown
                  </CardTitle>
                  <CardDescription>
                    Male, female, and children comparison
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={chartData}
                        margin={{ left: -16, right: 4 }}
                      >
                        <CartesianGrid
                          vertical={false}
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 11 }}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent />}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar
                          dataKey="maleCount"
                          fill="var(--chart-5)"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={20}
                        />
                        <Bar
                          dataKey="femaleCount"
                          fill="var(--chart-3)"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={20}
                        />
                        <Bar
                          dataKey="childrenCount"
                          fill="var(--chart-4)"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-sm font-semibold">
                  Attendance Records
                </CardTitle>
                <CardDescription>
                  All records for the selected range
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-t">
                      <TableHead className="pl-6 text-xs">Date</TableHead>
                      <TableHead className="text-xs">Service</TableHead>
                      <TableHead className="text-right text-xs">Male</TableHead>
                      <TableHead className="text-right text-xs">
                        Female
                      </TableHead>
                      <TableHead className="text-right text-xs">
                        Children
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold">
                        Total
                      </TableHead>
                      <TableHead className="pr-6 w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="pl-6 text-sm tabular-nums">
                          {format(
                            new Date(record.attendanceDate),
                            "dd MMM yyyy",
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-md bg-primary/8 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
                            {record.activityType}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {record.maleCount}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {record.femaleCount}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {record.childrenCount}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold tabular-nums">
                          {record.totalAttendance}
                        </TableCell>
                        <TableCell className="pr-6">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteTarget(record)}
                            >
                              <Trash2 className="size-3.5" />
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

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.activityType}
              </span>{" "}
              record for{" "}
              <span className="font-medium text-foreground">
                {deleteTarget &&
                  format(new Date(deleteTarget.attendanceDate), "dd MMM yyyy")}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
