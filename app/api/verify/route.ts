import { NextRequest, NextResponse } from "next/server";
import { validateTag } from "@/lib/sdm";
import { lookupProduct } from "@/lib/solana";
import { fetchMetadata } from "@/lib/ipfs";

/**
 * GET /api/verify?uid=XX&ctr=YY&cmac=ZZ
 *
 * JSON verification endpoint for partners (StockX, retailers, etc.)
 * Same two-layer check as the consumer UI — CMAC + Solana PDA lookup.
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

  // Layer 1 — CMAC validation
  try {
    await validateTag(uid, ctr, cmac);
  } catch (err) {
    return NextResponse.json(
      { authentic: false, error: "Tag authentication failed", detail: String(err) },
      { status: 403 }
    );
  }

  // Layer 2 — On-chain lookup
  const product = await lookupProduct(uid);

  if (!product) {
    return NextResponse.json(
      { authentic: false, error: "Product not registered on-chain" },
      { status: 404 }
    );
  }

  if (!product.active) {
    return NextResponse.json(
      { authentic: false, error: "Product has been recalled", productPDA: product.productPDA },
      { status: 403 }
    );
  }

  const metadata = await fetchMetadata(product.metadataUri);

  return NextResponse.json({
    authentic: true,
    uid,
    productPDA: product.productPDA,
    manufacturer: product.manufacturer,
    registeredAt: product.registeredAt,
    metadataUri: product.metadataUri,
    metadata,
  });
}
