// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `acitivity-project_${name}`,
);

export const apiKeys = createTable("api_keys", (d) => ({
  id: d.text("id").primaryKey(),
  brand: d.varchar("brand", { length: 100 }).notNull(),
  storage: d.varchar("storage", { length: 50 }).notNull(),
  cpu: d.varchar("cpu", { length: 100 }).notNull(),
  price: d.integer("price").notNull(),
  imageUrl: d.text("image_url"),
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
}));
