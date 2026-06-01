import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Entry } from "@/models/entry";
import { isDateString } from "@/lib/utils/date";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await params;
  if (!isDateString(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  await connectDB();

  await Entry.deleteOne({ userId: session.user.id, date });

  return NextResponse.json({ success: true });
}
