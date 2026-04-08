import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { product } from "@/db/schema";

// Public — no auth. This URL is stored in the Solana event as `metadata_uri`.
// Anyone decoding the on-chain ProductRegistered event can fetch this to see
// what product the tag was registered for.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [p] = await db
    .select({ name: product.name, description: product.description, image: product.imageUrl })
    .from(product)
    .where(eq(product.id, id))
    .limit(1);

  if (!p) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(p, {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
