import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { tag, product } from "@/db/schema";
import { auth } from "@/lib/auth";
import { registerTagOnChain } from "@/lib/solana";


async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const tags = await db
    .select({
      id: tag.id,
      uid: tag.uid,
      productId: tag.productId,
      productName: product.name,
      manufacturerPda: tag.manufacturerPda,
      registrationTx: tag.registrationTx,
      registeredAt: tag.registeredAt,
    })
    .from(tag)
    .innerJoin(product, eq(tag.productId, product.id))
    .where(eq(tag.userId, session.user.id))
    .orderBy(tag.registeredAt);

  return Response.json(tags);
}

/**
 * POST /api/tags
 * Body: { productId }
 *
 * 1. Calls the personalization server to write SDM keys + URL to the physical chip → gets UID
 * 2. Registers the tag on-chain (ProductRegistered event)
 * 3. Inserts the tag row into Postgres
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId?.trim()) return Response.json({ error: "Product is required" }, { status: 400 });

  // Verify product belongs to this user
  const [prod] = await db
    .select()
    .from(product)
    .where(and(eq(product.id, productId), eq(product.userId, session.user.id)))
    .limit(1);

  if (!prod) return Response.json({ error: "Product not found" }, { status: 404 });

  const personalizerUrl = process.env.NTAG_PERSONALIZER_URL;
  if (!personalizerUrl) {
    return Response.json({ error: "NTAG_PERSONALIZER_URL is not configured" }, { status: 503 });
  }

  const appUrl = process.env.TAG_BASE_URL;
  if (!appUrl) {
    return Response.json({ error: "TAG_BASE_URL is not configured" }, { status: 503 });
  }

  // URL written to the tag — params are filled in by the chip at scan time
  const checkUrl = `${appUrl}/check?uid={uid}&ctr={counter}&cmac={cmac}`;
  const metadataUri = `${appUrl}/api/products/${productId}/metadata`;

  // Step 1 — personalize the physical chip
  let uid: string;
  try {
    const personRes = await fetch(`${personalizerUrl}/card/personalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: checkUrl }),
      signal: AbortSignal.timeout(30_000),
    });

    const personData = await personRes.json();

    if (!personRes.ok) {
      return Response.json(
        { error: personData.error ?? "Personalization failed" },
        { status: personRes.status }
      );
    }

    uid = personData.uid as string;
    if (!uid) {
      return Response.json({ error: "Personalization server returned no UID" }, { status: 502 });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Could not reach personalization server: ${msg}` }, { status: 503 });
  }

  // Step 2 — register on-chain (auto-creates ManufacturerRecord PDA on first use)
  let signature: string;
  let manufacturerPda: string;
  try {
    ({ signature, manufacturerPda } = await registerTagOnChain(
      uid,
      session.user.id,
      metadataUri,
      session.user.name ?? "Manufacturer"
    ));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `On-chain registration failed: ${msg}` }, { status: 500 });
  }

  // Step 3 — persist in Postgres
  let created;
  try {
    [created] = await db
      .insert(tag)
      .values({
        id: crypto.randomUUID(),
        uid,
        productId,
        userId: session.user.id,
        manufacturerPda,
        manufacturerName: session.user.name ?? "Manufacturer",
        registrationTx: signature,
      })
      .returning();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Unique constraint on uid means this tag was already registered
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return Response.json({ error: "This tag UID is already registered" }, { status: 409 });
    }
    return Response.json({ error: `Database error: ${msg}` }, { status: 500 });
  }

  return Response.json(created, { status: 201 });
}
