import { Suspense } from "react";
import { eq } from "drizzle-orm";
import { ShieldCheck, ShieldX } from "lucide-react";
import { validateTag } from "@/lib/sdm";
import { explorerTxUrl, explorerAddressUrl } from "@/lib/solana";
import { db } from "@/db/drizzle";
import { tag, product } from "@/db/schema";
import { AuthenticState } from "./authentic-state";

const CLUSTER = process.env.SOLANA_CLUSTER ?? "devnet";

export default async function CheckPage({
  searchParams,
}: {
  searchParams: Promise<{ uid?: string; ctr?: string; cmac?: string }>;
}) {
  const { uid, ctr, cmac } = await searchParams;

  if (!uid || !ctr || !cmac) {
    return <FailState reason="Invalid verification link." />;
  }

  return (
    <Suspense fallback={<VerifyingState />}>
      <VerifyResult uid={uid} ctr={ctr} cmac={cmac} />
    </Suspense>
  );
}

// ── Data fetching (streamed) ───────────────────────────────────────────────────

async function VerifyResult({
  uid,
  ctr,
  cmac,
}: {
  uid: string;
  ctr: string;
  cmac: string;
}) {
  try {
    await validateTag(uid, ctr, cmac);
  } catch {
    return (
      <FailState reason="Tag authentication failed. This product may not be genuine." />
    );
  }

  const rows = await db
    .select({ tag: tag, product: product })
    .from(tag)
    .innerJoin(product, eq(tag.productId, product.id))
    .where(eq(tag.uid, uid.toUpperCase()))
    .limit(1);

  if (rows.length === 0) {
    return (
      <FailState reason="Product not found in registry. It may not have been registered." />
    );
  }

  const { tag: tagRecord, product: productRecord } = rows[0];

  return (
    <AuthenticState
      tag={tagRecord}
      product={productRecord}
      cluster={CLUSTER}
      txUrl={explorerTxUrl(tagRecord.registrationTx)}
      mfgUrl={explorerAddressUrl(tagRecord.manufacturerPda)}
    />
  );
}

// ── Verifying skeleton ────────────────────────────────────────────────────────

function VerifyingState() {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <header className="px-5 pt-5 md:px-10 md:pt-8 max-w-5xl mx-auto w-full">
        <span className="font-heading text-sm font-bold tracking-tight text-foreground">
          Authlink
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5">
        {/* Animated shield */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse ring */}
          <span className="absolute size-28 rounded-full bg-primary/10 animate-ping animation-duration-[1.4s]" />
          {/* Inner ring */}
          <span className="absolute size-20 rounded-full bg-primary/10 animate-ping animation-duration-[1.4s] [animation-delay:0.2s]" />
          <div className="relative rounded-full bg-primary/10 p-6 z-10">
            <ShieldCheck
              className="size-10 text-primary animate-pulse"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="text-center space-y-1.5">
          <p className="text-sm font-semibold text-foreground">
            Verifying authenticity
          </p>
          <p className="text-xs text-muted-foreground">
            Checking hardware signature and blockchain record…
          </p>
        </div>
      </div>

      <footer className="pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          Secured by{" "}
          <span className="font-semibold text-foreground">Authlink</span>
        </p>
      </footer>
    </div>
  );
}

// ── Failed ────────────────────────────────────────────────────────────────────

function FailState({ reason }: { reason: string }) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <header className="px-5 pt-5 md:px-10 md:pt-8 max-w-5xl mx-auto w-full">
        <span className="font-heading text-sm font-bold tracking-tight text-foreground">
          Authlink
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto rounded-full bg-destructive/8 p-6 w-fit">
            <ShieldX className="size-14 text-destructive" strokeWidth={1.25} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Verification Failed
            </p>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Not Authentic
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {reason}
            </p>
          </div>
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-left">
            <p className="text-xs text-destructive/80 leading-relaxed">
              If you believe this is an error, contact the seller or
              manufacturer and share the full URL of this verification page.
            </p>
          </div>
        </div>
      </div>

      <footer className="pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          Secured by{" "}
          <span className="font-semibold text-foreground">Authlink</span>
        </p>
      </footer>
    </div>
  );
}
