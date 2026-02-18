import { AttendanceForm } from "@/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function New() {
  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Record Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fill in the details below to log attendance for a service.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-sm font-semibold">Attendance Details</CardTitle>
          <CardDescription>Select the service, date, and enter headcounts.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AttendanceForm />
        </CardContent>
      </Card>
    </div>
  );
}
