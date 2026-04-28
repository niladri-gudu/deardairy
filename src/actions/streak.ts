"use server";

import { connectDB } from "@/lib/mongoose";
import { Entry } from "@/models/entry";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getStreakData() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { currentStreak: 0, totalEntries: 0 };

  await connectDB();

  const entries = await Entry.find({ userId: session.user.id }, { date: 1 })
    .sort({ date: -1 })
    .lean();

  if (entries.length === 0) return { currentStreak: 0, totalEntries: 0 };

  const totalEntries = entries.length;
  let currentStreak = 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const lastEntryDate = entries[0].date;

  if (lastEntryDate !== today && lastEntryDate !== yesterday) {
    return { currentStreak: 0, totalEntries };
  }

  const expectedDate = new Date(lastEntryDate);

  for (const entry of entries) {
    const entryDate = new Date(entry.date);

    // Check if this entry matches our expected consecutive date
    if (
      entryDate.toISOString().split("T")[0] ===
      expectedDate.toISOString().split("T")[0]
    ) {
      currentStreak++;
      // Set expected date to the day before this one
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // Gap found, streak ends here
      break;
    }
  }

  return { currentStreak, totalEntries };
}
