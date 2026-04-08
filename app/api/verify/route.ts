import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { validateTag } from "@/lib/sdm";
import { db } from "@/db/drizzle";
import { tag, product } from "@/db/schema";

/**
 * GET /api/verify?uid=XX&ctr=YY&cmac=ZZ
 *
 * JSON verification endpoint for partners (StockX, retailers, etc.)
 * Same two-layer check as the consumer UI — CMAC + Postgres lookup.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const uid = searchParams.get("uid");
  const ctr = searchParams.get("ctr");
  const cmac = searchParams.get("cmac");

  if (!uid || !ctr || !cmac) {
    return NextResponse.json(
      { authentic: false, error: "Missing required parameters: uid, ctr, cmac" },
      { status: 400 }
    );
  }

  // Layer 1 — CMAC validation (proves genuine hardware)
  try {
    await validateTag(uid, ctr, cmac);
  } catch (err) {
    return NextResponse.json(
      { authentic: false, error: "Tag authentication failed", detail: String(err) },
      { status: 403 }
    );
  }

  // Layer 2 — Registry lookup
  const rows = await db
    .select({ tag: tag, product: product })
    .from(tag)
    .innerJoin(product, eq(tag.productId, product.id))
    .where(eq(tag.uid, uid.toUpperCase()))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json(
      { authentic: false, error: "Product not registered on-chain" },
      { status: 404 }
    );
  }

  const { tag: tagRecord, product: productRecord } = rows[0];

  if (!tagRecord.active) {
    return NextResponse.json(
      {
        authentic: false,
        error: "Product has been recalled or deactivated",
        manufacturerPda: tagRecord.manufacturerPda,
        revocationTx: tagRecord.revocationTx,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    authentic: true,
    uid: tagRecord.uid,
    manufacturerPda: tagRecord.manufacturerPda,
    registrationTx: tagRecord.registrationTx,
    registeredAt: tagRecord.registeredAt,
    product: {
      name: productRecord.name,
      description: productRecord.description,
      imageUrl: productRecord.imageUrl,
    },
  });
}
