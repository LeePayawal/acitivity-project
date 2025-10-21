// app/api/keys/route.ts
import { NextResponse } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/key";
import { CreateKeySchema, DeleteKeySchema } from "~/server/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("keyId");

    const rows = await listKeys();

    if (keyId) {
      const row = rows.find((r) => r.id === keyId);
      if (!row) {
        return NextResponse.json({ error: "Key not found" }, { status: 404 });
      }
      const item = {
        id: row.id,
        type: row.type,
        brand: row.brand,
        model: row.model,
        size: row.size,
        price: row.price,
        imageUrl: row.imageUrl,
        masked: `sk_live_...${row.last4}`,
        createdAt: row.createdAt,
        revoked: !!row.revoked,
      };
      return NextResponse.json(item);
    }

    const items = rows.map((row) => ({
      id: row.id,
      type: row.type,
      brand: row.brand,
      model: row.model,
      size: row.size,
      price: row.price,
      imageUrl: row.imageUrl,
      masked: `sk_live_...${row.last4}`,
      createdAt: row.createdAt,
      revoked: !!row.revoked,
    }));

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("GET /api/keys failed:", err);
    return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });
  }
}

// POST: Create a new shoe key
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateKeySchema.parse(body);
    const { type, brand, model, size, price, imageUrl } = parsed;

    const created = await insertKey({ type, brand, model, size, price, imageUrl });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/keys failed:", err);
    return NextResponse.json(
      { error: err.message ?? "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("keyId");

    const { keyId: parsedId } = DeleteKeySchema.parse({ keyId });

    const ok = await revokeKey(parsedId);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/keys failed:", err);
    return NextResponse.json(
      { error: err.message ?? "Invalid request" },
      { status: 400 }
    );
  }
}
