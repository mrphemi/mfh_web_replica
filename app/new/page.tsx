import { AttendanceForm } from "@/components/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function New() {
  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Record New Attendance
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill in details below to record attendance for a service
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-card/50">
            <CardTitle>Attendance Details</CardTitle>
            <CardDescription>
              Enter attendance information for the selected service
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AttendanceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
