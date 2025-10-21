// app/api/echo/route.ts
import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { apiKeys, subscriptions } from "~/server/db/schema";
import { verifyKey } from "~/server/key";
import { eq, and } from "drizzle-orm";
import { createDynamicRatelimiter, ratelimiter } from "~/server/ratelimit";

async function getUserTierInfo(userId: string | undefined) {
  if (!userId) {
    return { tier: "bronze", limit: 100 };
  }

  try {
    const userSubs = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (!userSubs || userSubs.length === 0 || !userSubs[0]) {
      return { tier: "bronze", limit: 100 };
    }

    const subscription = userSubs[0];
    const tier = subscription.tier || "bronze";
    const limit = typeof subscription.rateLimit === 'number' ? subscription.rateLimit : 100;

    return {
      tier,
      limit,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return { tier: "bronze", limit: 100 };
  }
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  // Get user from Clerk
  const user = await currentUser();
  const userId = user?.id;
  
  // Use dynamic rate limiter based on subscription
  let rateLimiter = ratelimiter;
  let tierInfo = { tier: "bronze", limit: 100 };
  
  if (userId) {
    rateLimiter = await createDynamicRatelimiter(userId);
    tierInfo = await getUserTierInfo(userId);
  }

  const { success, remaining, limit, reset } = await rateLimiter.limit(apiKey);
  
  if (!success) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: `You've exceeded your ${tierInfo.tier} tier limit of ${limit} requests per 10 seconds. Upgrade your subscription for higher limits.`,
        tier: tierInfo.tier,
        limit,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.max(1, Math.ceil((+reset - Date.now()) / 1000))),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          "X-RateLimit-Tier": tierInfo.tier,
        },
      }
    );
  }

  return Response.json(
    {
      ok: true,
      message: "Hello GET",
      keyId: result.keyId,
      tier: tierInfo.tier,
      rateLimit: {
        limit,
        remaining: Math.max(0, remaining),
        resetIn: Math.max(1, Math.ceil((+reset - Date.now()) / 1000)),
      },
    },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
        "X-RateLimit-Tier": tierInfo.tier,
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  // Get user from Clerk
  const user = await currentUser();
  const userId = user?.id;
  
  // Use dynamic rate limiter based on subscription
  let rateLimiter = ratelimiter;
  let tierInfo = { tier: "bronze", limit: 100 };
  
  if (userId) {
    rateLimiter = await createDynamicRatelimiter(userId);
    tierInfo = await getUserTierInfo(userId);
  }

  const { success, remaining, limit, reset } = await rateLimiter.limit(apiKey);
  
  if (!success) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: `You've exceeded your ${tierInfo.tier} tier limit of ${limit} requests per 10 seconds. Upgrade your subscription for higher limits.`,
        tier: tierInfo.tier,
        limit,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.max(1, Math.ceil((+reset - Date.now()) / 1000))),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          "X-RateLimit-Tier": tierInfo.tier,
        },
      }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const searchBrand = typeof body === "string" ? body : body.postBody ?? "";

  const found = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.brand, searchBrand));

  if (found.length === 0) {
    return Response.json(
      {
        ok: false,
        message: "No shoes found",
        tier: tierInfo.tier,
        rateLimit: {
          limit,
          remaining: Math.max(0, remaining),
          resetIn: Math.max(1, Math.ceil((+reset - Date.now()) / 1000)),
        },
      },
      {
        status: 404,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          "X-RateLimit-Tier": tierInfo.tier,
        },
      }
    );
  }

  return Response.json(
    {
      ok: true,
      message: "Shoe search results",
      received: found,
      tier: tierInfo.tier,
      rateLimit: {
        limit,
        remaining: Math.max(0, remaining),
        resetIn: Math.max(1, Math.ceil((+reset - Date.now()) / 1000)),
      },
    },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
        "X-RateLimit-Tier": tierInfo.tier,
      },
    }
  );
}