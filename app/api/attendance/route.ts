import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  maleCount: z.number().min(0),
  femaleCount: z.number().min(0),
  childrenCount: z.number().min(0),
  attendanceDate: z.string(), // "YYYY-MM-DD"
  activityType: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = formSchema.parse(body);

    const API_URL = process.env.ATTENDANCE_API_URL!;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const errorText = await response.text().catch(() => "Unknown error");

    return NextResponse.json({
      success: false,
      message: errorText,
      status: response.status,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }

    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
    }
  }
}
