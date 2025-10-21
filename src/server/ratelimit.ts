// server/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { db } from "~/server/db";
import { subscriptions } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export function keyFromCtx({ apiKeyId, ip }: { apiKeyId: string; ip: string }) {
  if (apiKeyId) return `key:${apiKeyId}`;
  return `ip:${ip ?? "unknown"}`;
}

// Tier-based rate limits
const TIER_LIMITS = {
  bronze: 100,
  silver: 1000,
  gold: 5000,
  platinum: 999999,
} as const;

// Get user's subscription tier and rate limit
export async function getUserRateLimit(userId: string): Promise<number> {
  try {
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (!userSubscriptions || userSubscriptions.length === 0 || !userSubscriptions[0]) {
      // Default to bronze tier
      return TIER_LIMITS.bronze;
    }

    const subscription = userSubscriptions[0];
    
    // Check if subscription is still valid
    if (subscription.currentPeriodEnd && new Date() > new Date(subscription.currentPeriodEnd)) {
      // Subscription expired, update status
      await db
        .update(subscriptions)
        .set({ status: "expired", updatedAt: new Date() })
        .where(eq(subscriptions.id, subscription.id));
      
      return TIER_LIMITS.bronze; // Fallback to free tier
    }

    // Ensure rateLimit is a valid number
    const rateLimit = typeof subscription.rateLimit === 'number' ? subscription.rateLimit : TIER_LIMITS.bronze;
    return rateLimit;
  } catch (error) {
    console.error("Failed to get user rate limit:", error);
    return TIER_LIMITS.bronze; // Fallback to free tier on error
  }
}

// Create dynamic rate limiter based on user tier
export async function createDynamicRatelimiter(userId: string) {
  const limit = await getUserRateLimit(userId);
  
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}

// Default rate limiter for non-authenticated requests
const defaultRatelimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "10 s"), // Bronze tier default
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const ratelimiter = defaultRatelimiter;