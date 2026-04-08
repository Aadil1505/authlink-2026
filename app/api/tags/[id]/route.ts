import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { tag } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revokeTagOnChain } from "@/lib/solana";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

// DELETE /api/tags/:id — revoke a tag on-chain and mark it inactive in Postgres
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [existing] = await db
    .select()
    .from(tag)
    .where(and(eq(tag.id, id), eq(tag.userId, session.user.id)))
    .limit(1);

  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
  if (!existing.active)
    return Response.json({ error: "Tag is already revoked" }, { status: 409 });

  try {
    const revocationTx = await revokeTagOnChain(existing.uid, session.user.id);

    const [updated] = await db
      .update(tag)
      .set({ active: false, revocationTx })
      .where(eq(tag.id, id))
      .returning();

    return Response.json(updated);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Revocation failed: ${msg}` }, { status: 500 });
  }
}
