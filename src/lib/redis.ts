import "server-only";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

export async function getCachedValue<T>(key: string): Promise<T | null> {
  if (!redis) return null;

  try {
    return await redis.get<T>(key);
  } catch (error) {
    console.error("Redis read failed:", error);
    return null;
  }
}

export async function setCachedValue(
  key: string,
  value: unknown,
  ttlSeconds: number,
) {
  if (!redis) return;

  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error("Redis write failed:", error);
  }
}

export async function incrementCachedValue(key: string) {
  if (!redis) return;

  try {
    await redis.incr(key);
  } catch (error) {
    console.error("Redis invalidation failed:", error);
  }
}
