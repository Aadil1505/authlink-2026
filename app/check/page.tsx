import { eq } from "drizzle-orm";
import { ShieldCheck, ShieldX, ExternalLink, Clock, Calendar, Building2, Hash, Globe } from "lucide-react";
import { validateTag } from "@/lib/sdm";
import { explorerTxUrl, explorerAddressUrl } from "@/lib/solana";
import { db } from "@/db/drizzle";
import { tag, product } from "@/db/schema";

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

  // 1. Validate the CMAC — proves the chip is genuine hardware
  try {
    await validateTag(uid, ctr, cmac);
  } catch {
    return (
      <FailState reason="Tag authentication failed. This product may not be genuine." />
    );
  }

  // 2. Look up tag + product from Postgres (fast, no RPC call)
  const rows = await db
    .select({
      tag: tag,
      product: product,
    })
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

  if (!tagRecord.active) {
    return (
      <FailState reason="This product has been recalled or deactivated." />
    );
  }

  return <AuthenticState tag={tagRecord} product={productRecord} />;
}

// ── Authentic ─────────────────────────────────────────────────────────────────

function AuthenticState({
  tag: tagRecord,
  product: productRecord,
}: {
  tag: typeof tag.$inferSelect;
  product: typeof product.$inferSelect;
}) {
  const ts = new Date(tagRecord.registeredAt);
  const registeredDate = ts.toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
  const registeredTime = ts.toLocaleTimeString(undefined, {
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });

  const txUrl = explorerTxUrl(tagRecord.registrationTx);
  const mfgUrl = explorerAddressUrl(tagRecord.manufacturerPda);

  return (
    <div className="min-h-svh bg-background">
      <header className="flex items-center justify-between px-5 pt-5 pb-1">
        <span className="font-heading text-base font-bold tracking-tight text-foreground">
          Authlink
        </span>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 border border-emerald-200 dark:border-emerald-500/20">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            Verified
          </span>
        </div>
      </header>

      {/* Product image */}
      <div className="mx-5 mt-4 rounded-2xl overflow-hidden bg-muted aspect-square relative">
        {productRecord.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={productRecord.imageUrl}
            alt={productRecord.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-linear-to-br from-primary/5 via-primary/10 to-primary/20">
            <div className="rounded-full bg-primary/15 p-6">
              <ShieldCheck className="size-16 text-primary" strokeWidth={1.25} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/60">
              Verified Authentic
            </p>
          </div>
        )}
      </div>

      <div className="px-5 pt-5 pb-10 space-y-6">
        {/* Product name & description */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground leading-tight">
            {productRecord.name}
          </h1>
          {productRecord.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {productRecord.description}
            </p>
          )}
        </div>

        {/* Blockchain record */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Blockchain Record
            </h2>
          </div>

          <div className="divide-y divide-border">
            <ChainRow icon={<Calendar className="size-3.5" />} label="Registered">
              <span className="text-sm font-medium">{registeredDate}</span>
            </ChainRow>
            <ChainRow icon={<Clock className="size-3.5" />} label="Time">
              <span className="text-sm">{registeredTime}</span>
            </ChainRow>
            <ChainRow icon={<Building2 className="size-3.5" />} label="Manufacturer">
              <a
                href={mfgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline underline-offset-2"
              >
                <code className="text-xs font-mono bg-muted rounded px-1.5 py-0.5">
                  {tagRecord.manufacturerPda.slice(0, 6)}…{tagRecord.manufacturerPda.slice(-4)}
                </code>
                <ExternalLink className="size-3" />
              </a>
            </ChainRow>
            <ChainRow icon={<Hash className="size-3.5" />} label="Transaction">
              <a
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline underline-offset-2"
              >
                <code className="text-xs font-mono bg-muted rounded px-1.5 py-0.5">
                  {tagRecord.registrationTx.slice(0, 6)}…{tagRecord.registrationTx.slice(-4)}
                </code>
                <ExternalLink className="size-3" />
              </a>
            </ChainRow>
            <ChainRow icon={<Globe className="size-3.5" />} label="Network">
              <span className="text-sm capitalize">{CLUSTER}</span>
            </ChainRow>
          </div>

          <a
            href={txUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 bg-muted/20 border-t border-border text-sm text-primary hover:bg-muted/40 transition-colors"
          >
            <span className="font-medium">View registration on Solana Explorer</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        <p className="text-center text-xs text-muted-foreground pt-1">
          Secured by <span className="font-semibold text-foreground">Authlink</span>
        </p>
      </div>
    </div>
  );
}

// ── Failed ────────────────────────────────────────────────────────────────────

function FailState({ reason }: { reason: string }) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <header className="px-5 pt-5">
        <span className="font-heading text-base font-bold tracking-tight text-foreground">
          Authlink
        </span>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto rounded-full bg-destructive/10 p-6 w-fit">
            <ShieldX className="size-16 text-destructive" strokeWidth={1.25} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Verification Failed
            </p>
            <h1 className="text-2xl font-heading font-bold text-foreground">Not Authentic</h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{reason}</p>
          </div>
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-left">
            <p className="text-xs text-destructive/80 leading-relaxed">
              If you believe this is an error, contact the seller or manufacturer
              and share the full URL of this verification page.
            </p>
          </div>
        </div>
      </div>
      <footer className="px-5 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          Secured by <span className="font-semibold text-foreground">Authlink</span>
        </p>
      </footer>
    </div>
  );
}

function ChainRow({ icon, label, children }: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {children}
    </div>
  );
}
