"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { addDays, getLocalDateString, isDateString } from "@/lib/utils/date";
import { getCachedEntryDates } from "@/lib/entry-cache";

export async function getStreakData(localToday = getLocalDateString()) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { currentStreak: 0, totalEntries: 0 };

  const entries = await getCachedEntryDates(session.user.id);

  if (entries.length === 0) return { currentStreak: 0, totalEntries: 0 };

  const totalEntries = entries.length;
  let currentStreak = 0;

  const today = isDateString(localToday) ? localToday : getLocalDateString();
  const yesterday = addDays(today, -1);

  const lastEntryDate = entries[0].date;

  if (lastEntryDate !== today && lastEntryDate !== yesterday) {
    return { currentStreak: 0, totalEntries };
  }

  let expectedDate = lastEntryDate;

  for (const entry of entries) {
    if (entry.date === expectedDate) {
      currentStreak++;
      expectedDate = addDays(expectedDate, -1);
    } else {
      // Gap found, streak ends here
      break;
    }
  }

  return { currentStreak, totalEntries };
}
