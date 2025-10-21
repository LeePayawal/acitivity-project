// app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { subscriptions, payments } from "~/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Rate limit mappings for each tier
const TIER_LIMITS = {
  bronze: 100,
  silver: 1000,
  gold: 5000,
  platinum: 999999, // Effectively unlimited
} as const;

type TierType = keyof typeof TIER_LIMITS;

// Get user's current subscription
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.status, "active")
        )
      )
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (userSubscriptions.length === 0 || !userSubscriptions[0]) {
      // Return default bronze tier
      return NextResponse.json({
        tier: "bronze",
        rateLimit: TIER_LIMITS.bronze,
        status: "free",
        billingCycle: "monthly",
        amount: 0,
      });
    }

    const subscription = userSubscriptions[0];
    
    return NextResponse.json({
      id: subscription.id,
      tier: subscription.tier,
      billingCycle: subscription.billingCycle,
      amount: subscription.amount,
      status: subscription.status,
      rateLimit: subscription.rateLimit,
      currentPeriodStart: subscription.currentPeriodStart?.toISOString() ?? new Date().toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GET /api/subscription failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// Create or update subscription
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tier, billingCycle, amount } = body;

    // Validate tier
    if (!["bronze", "silver", "gold", "platinum"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Validate billing cycle
    if (!["monthly", "yearly"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      );
    }

    // Calculate period end based on billing cycle
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    if (billingCycle === "monthly") {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }

    // Check for existing active subscription
    const existingSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.status, "active")
        )
      );

    // Cancel existing subscriptions
    if (existingSubscriptions.length > 0) {
      for (const sub of existingSubscriptions) {
        if (sub && sub.id) {
          await db
            .update(subscriptions)
            .set({ status: "cancelled", updatedAt: new Date() })
            .where(eq(subscriptions.id, sub.id));
        }
      }
    }

    // Create new subscription
    const subscriptionId = nanoid();
    const rateLimit = TIER_LIMITS[tier as TierType];

    const newSubscription = await db.insert(subscriptions).values({
      id: subscriptionId,
      userId: user.id,
      tier,
      billingCycle,
      amount,
      status: "active",
      rateLimit,
      currentPeriodStart,
      currentPeriodEnd,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Create payment record (fake payment for demo)
    const paymentId = nanoid();
    await db.insert(payments).values({
      id: paymentId,
      subscriptionId,
      userId: user.id,
      amount,
      currency: "USD",
      status: "succeeded",
      paymentMethod: "card ending in 4242",
      createdAt: new Date(),
    });

    const createdSubscription = newSubscription[0];

    return NextResponse.json(
      {
        success: true,
        subscription: {
          id: createdSubscription?.id ?? subscriptionId,
          tier,
          billingCycle,
          amount,
          rateLimit,
          currentPeriodStart: currentPeriodStart.toISOString(),
          currentPeriodEnd: currentPeriodEnd.toISOString(),
        },
        payment: {
          id: paymentId,
          status: "succeeded",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/subscription failed:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to create subscription" },
      { status: 500 }
    );
  }
}

// Cancel subscription
export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get("subscriptionId");

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, subscriptionId))
      .limit(1);

    if (subscription.length === 0 || !subscription[0]) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (subscription[0].userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cancel subscription
    await db
      .update(subscriptions)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(subscriptions.id, subscriptionId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/subscription failed:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}