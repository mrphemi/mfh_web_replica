import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const API_URL = process.env.ATTENDANCE_API_URL!;
    const baseUrl = API_URL.replace("/api/attendance", "");

    const response = await fetch(`${baseUrl}/api/attendance/delete/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const errorText = await response.text().catch(() => "Unknown error");
    return NextResponse.json(
      { success: false, message: errorText, status: response.status },
      { status: response.status }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
