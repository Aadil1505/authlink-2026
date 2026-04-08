import { NextRequest } from "next/server";

// Never cache — every request must hit the live personalization server
export const dynamic = "force-dynamic";

const BASE = process.env.NTAG_PERSONALIZER_URL;

async function proxy(req: NextRequest, path: string[]) {
  if (!BASE) {
    return Response.json(
      { error: "NTAG_PERSONALIZER_URL is not configured" },
      { status: 503 }
    );
  }

  const url = `${BASE}/${path.join("/")}`;

  try {
    const init: RequestInit = {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      init.body = await req.text();
    }

    const upstream = await fetch(url, init);
    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Personalization server unreachable: ${msg}` }, { status: 503 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(req, path);
}
