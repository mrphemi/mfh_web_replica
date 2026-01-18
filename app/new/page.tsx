import { AttendanceForm } from "@/components/form";

export default function New() {
  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">Record New Attendance</h1>
        <p>Fill in details below to record attendance for a service</p>
        <div className="p-4 border rounded-lg mt-5">
          <AttendanceForm />
        </div>
      </div>
    </div>
  );
}
