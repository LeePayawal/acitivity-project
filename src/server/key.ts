// server/key.ts
import { createHash, randomBytes } from "crypto";
import { db } from "./db";
import { apiKeys } from "./db/schema";
import { desc, eq } from "drizzle-orm";

const KEY_PREFIX = process.env.KEY_PREFIX ?? "sk_live_";

// Generate plain API key
export function generatePlainKey(bytes: number = 24) {
  const raw = randomBytes(bytes).toString("base64url");
  const key = `${KEY_PREFIX}${raw}`;
  const last4 = key.slice(-4);
  return { key, last4 };
}

// Hash helper
export function sha256(data: string) {
  return createHash("sha256").update(data).digest("hex");
}

// Insert a shoe entry with an API key
export async function insertKey(data: {
  type: string;
  brand: string;
  model: string;
  size: string;
  price: number;
  imageUrl?: string;
}) {
  const { key, last4 } = generatePlainKey();
  const hashed = sha256(key);
  const id = crypto.randomUUID();

  await db.insert(apiKeys).values({
    id,
    type: data.type,
    brand: data.brand,
    model: data.model,
    size: data.size,
    price: data.price,
    imageUrl: data.imageUrl,
    hashedKey: hashed,
    last4,
  });

  return { id, key, last4, ...data } as const;
}

// List all shoe API keys
export async function listKeys() {
  return db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));
}

export async function revokeKey(id: string) {
  const res = await db
    .update(apiKeys)
    .set({ revoked: true })
    .where(eq(apiKeys.id, id));
  return (res.rowCount ?? 0) > 0;
}

export async function verifyKey(apiKey: string) {
  const hashed = sha256(apiKey);
  const rows = await db
    .select({ id: apiKeys.id, revoked: apiKeys.revoked })
    .from(apiKeys)
    .where(eq(apiKeys.hashedKey, hashed));

  const row = rows[0];
  if (!row) return { valid: false as const, reason: "not_found" as const };
  if (row.revoked) return { valid: false as const, reason: "revoked" as const };
  return { valid: true as const, keyId: row.id };
}
