// server/db/schema.ts
import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `acitivity-project_${name}`,
);

export const apiKeys = createTable("api_keys", (d) => ({
  id: d.text("id").primaryKey(),
  type: d.varchar("type", { length: 50 }).notNull(),
  brand: d.varchar("brand", { length: 100 }).notNull(),
  model: d.varchar("model", { length: 100 }).notNull(),
  size: d.varchar("size", { length: 20 }).notNull(),
  price: d.integer("price").notNull(),
  imageUrl: d.text("image_url"),
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
  // Link to subscription
  subscriptionId: d.text("subscription_id"),
}));

// New subscriptions table
export const subscriptions = createTable(
  "subscriptions",
  (d) => ({
    id: d.text("id").primaryKey(),
    userId: d.text("user_id").notNull(), // Clerk user ID
    tier: d.varchar("tier", { length: 20 }).notNull(), // bronze, silver, gold, platinum
    billingCycle: d.varchar("billing_cycle", { length: 10 }).notNull(), // monthly, yearly
    amount: d.integer("amount").notNull(), // Price in cents
    status: d.varchar("status", { length: 20 }).notNull().default("active"), // active, cancelled, expired
    rateLimit: d.integer("rate_limit").notNull(), // Requests per 10 seconds
    currentPeriodStart: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    currentPeriodEnd: d
      .timestamp({ withTimezone: true })
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (table) => ({
    userIdIdx: index("subscription_user_id_idx").on(table.userId),
    statusIdx: index("subscription_status_idx").on(table.status),
  })
);

// Payment history table
export const payments = createTable(
  "payments",
  (d) => ({
    id: d.text("id").primaryKey(),
    subscriptionId: d.text("subscription_id").notNull(),
    userId: d.text("user_id").notNull(),
    amount: d.integer("amount").notNull(),
    currency: d.varchar("currency", { length: 3 }).notNull().default("USD"),
    status: d.varchar("status", { length: 20 }).notNull(), // succeeded, failed, pending
    paymentMethod: d.varchar("payment_method", { length: 50 }), // card ending in ****
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (table) => ({
    subscriptionIdIdx: index("payment_subscription_id_idx").on(table.subscriptionId),
    userIdIdx: index("payment_user_id_idx").on(table.userId),
  })
);