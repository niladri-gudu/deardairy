/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { Entry } from "@/models/entry";
import { connectDB } from "@/lib/mongoose";
import {
  getCachedValue,
  incrementCachedValue,
  setCachedValue,
} from "@/lib/redis";

const ENTRY_CACHE_TTL_SECONDS = 120;
const ENTRY_VERSION_TTL_SECONDS = 60 * 60 * 24 * 30;

type CachedEntry = Record<string, any>;

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function getUserEntryVersion(userId: string) {
  const key = `entries:${userId}:version`;
  const version = await getCachedValue<number>(key);

  if (version !== null) return version;

  await setCachedValue(key, 1, ENTRY_VERSION_TTL_SECONDS);
  return 1;
}

async function getOrSetUserEntryCache<T>(
  userId: string,
  suffix: string,
  loader: () => Promise<T>,
): Promise<T> {
  const version = await getUserEntryVersion(userId);
  const key = `entries:${userId}:v${version}:${suffix}`;
  const cached = await getCachedValue<T>(key);

  if (cached !== null) return cached;

  const value = serialize(await loader());
  await setCachedValue(key, value, ENTRY_CACHE_TTL_SECONDS);
  return value;
}

export async function invalidateUserEntryCache(userId: string) {
  await incrementCachedValue(`entries:${userId}:version`);
}

export async function getCachedEntry(userId: string, date: string) {
  return getOrSetUserEntryCache<CachedEntry | null>(
    userId,
    `entry:${date}`,
    async () => {
      await connectDB();
      return Entry.findOne({ userId, date }).lean();
    },
  );
}

export async function getCachedEntrySummaries(userId: string, limit: number) {
  return getOrSetUserEntryCache<CachedEntry[]>(
    userId,
    `summaries:${limit}`,
    async () => {
      await connectDB();
      return Entry.find(
        { userId },
        {
          date: 1,
          title: 1,
          wordCount: 1,
          contentText: 1,
          contentHtml: 1,
          mood: 1,
        },
      )
        .sort({ date: -1 })
        .limit(limit)
        .lean();
    },
  );
}

export async function getCachedEntryPage(
  userId: string,
  page: number,
  limit: number,
) {
  return getOrSetUserEntryCache<{
    entries: CachedEntry[];
    total: number;
  }>(userId, `page:${page}:${limit}`, async () => {
    await connectDB();
    const [entries, total] = await Promise.all([
      Entry.find(
        { userId },
        {
          date: 1,
          title: 1,
          wordCount: 1,
          contentText: 1,
          contentHtml: 1,
          mood: 1,
        },
      )
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Entry.countDocuments({ userId }),
    ]);

    return { entries, total };
  });
}

export async function getCachedEntryDates(userId: string) {
  return getOrSetUserEntryCache<{ date: string }[]>(
    userId,
    "dates",
    async () => {
      await connectDB();
      return Entry.find({ userId }, { date: 1 }).sort({ date: -1 }).lean();
    },
  );
}

export async function getCachedFlashbackEntries(userId: string) {
  return getOrSetUserEntryCache<CachedEntry[]>(
    userId,
    "flashback",
    async () => {
      await connectDB();
      return Entry.find(
        { userId },
        {
          date: 1,
          title: 1,
          wordCount: 1,
          contentText: 1,
          contentHtml: 1,
        },
      ).lean();
    },
  );
}
