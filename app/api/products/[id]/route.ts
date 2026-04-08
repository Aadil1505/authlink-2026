import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { product } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, description, imageUrl } = await req.json();

  if (!name?.trim()) return Response.json({ error: "Name is required" }, { status: 400 });

  const [updated] = await db
    .update(product)
    .set({
      name: name.trim(),
      description: description?.trim() ?? null,
      imageUrl: imageUrl?.trim() ?? null,
    })
    .where(and(eq(product.id, id), eq(product.userId, session.user.id)))
    .returning();

  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [deleted] = await db
    .delete(product)
    .where(and(eq(product.id, id), eq(product.userId, session.user.id)))
    .returning();

  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });

  return new Response(null, { status: 204 });
}
