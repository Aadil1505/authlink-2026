import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { product } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const products = await db
    .select()
    .from(product)
    .where(eq(product.userId, session.user.id))
    .orderBy(product.createdAt);

  return Response.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, imageUrl } = await req.json();
  if (!name?.trim()) return Response.json({ error: "Name is required" }, { status: 400 });

  const [created] = await db
    .insert(product)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      name: name.trim(),
      description: description?.trim() ?? null,
      imageUrl: imageUrl?.trim() ?? null,
    })
    .returning();

  return Response.json(created, { status: 201 });
}
