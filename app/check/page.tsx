import { ShieldCheck, ShieldX, ExternalLink, Clock, Calendar, Building2, Hash, Globe } from "lucide-react";
import { validateTag } from "@/lib/sdm";
import { lookupProduct, type ProductRecord } from "@/lib/solana";
import { fetchMetadata, type ProductMetadata } from "@/lib/ipfs";

const EXPLORER_BASE = "https://explorer.solana.com/address";
const CLUSTER = process.env.SOLANA_CLUSTER ?? "devnet";

function resolveIpfs(uri: string): string {
  return uri.startsWith("ipfs://")
    ? uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    : uri;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CheckPage({
  searchParams,
}: {
  searchParams: Promise<{ uid?: string; ctr?: string; cmac?: string }>;
}) {
  const { uid, ctr, cmac } = await searchParams;

  if (!uid || !ctr || !cmac) {
    return <FailState reason="Invalid verification link." />;
  }

  try {
    await validateTag(uid, ctr, cmac);
  } catch {
    return (
      <FailState reason="Tag authentication failed. This product may not be genuine." />
    );
  }

  const product = await lookupProduct(uid);

  if (!product) {
    return (
      <FailState reason="Product not found in registry. It may not have been registered." />
    );
  }

  if (!product.active) {
    return (
      <FailState reason="This product has been recalled or deactivated." />
    );
  }

  const metadata = await fetchMetadata(product.metadataUri);

  return <AuthenticState product={product} metadata={metadata} />;
}

// ── Authentic ─────────────────────────────────────────────────────────────────

function AuthenticState({
  product,
  metadata,
}: {
  product: ProductRecord;
  metadata: ProductMetadata | null;
}) {
  const explorerUrl = `${EXPLORER_BASE}/${product.productPDA}${CLUSTER === "devnet" ? "?cluster=devnet" : ""}`;
  const ts = new Date(product.registeredAt * 1000);

  const registeredDate = ts.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const registeredTime = ts.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const imageUrl = metadata?.image ? resolveIpfs(metadata.image) : null;

  const attributes = Array.isArray(
    (metadata as Record<string, unknown> | null)?.attributes
  )
    ? (
        (metadata as Record<string, unknown>).attributes as Array<{
          trait_type: string;
          value: string | number;
        }>
      )
    : null;

  const externalUrl =
    typeof (metadata as Record<string, unknown> | null)?.external_url ===
    "string"
      ? ((metadata as Record<string, unknown>).external_url as string)
      : null;

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
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
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={metadata?.name ?? "Product"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-linear-to-br from-primary/5 via-primary/10 to-primary/20">
            <div className="rounded-full bg-primary/15 p-6">
              <ShieldCheck
                className="size-16 text-primary"
                strokeWidth={1.25}
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/60">
              Verified Authentic
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-5 pb-10 space-y-6">
        {/* Product name & description */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground leading-tight">
            {metadata?.name ?? "Genuine Product"}
          </h1>
          {metadata?.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {metadata.description}
            </p>
          )}
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline underline-offset-2"
            >
              Product page
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>

        {/* Attributes */}
        {attributes && attributes.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Details
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {attributes.map((attr, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-muted/30 px-3 py-2.5"
                >
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {attr.trait_type}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5 truncate">
                    {String(attr.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <span className="text-sm font-medium text-foreground">
                {registeredDate}
              </span>
            </ChainRow>

            <ChainRow icon={<Clock className="size-3.5" />} label="Time">
              <span className="text-sm text-foreground">{registeredTime}</span>
            </ChainRow>

            <ChainRow
              icon={<Building2 className="size-3.5" />}
              label="Manufacturer"
            >
              <code className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 text-foreground">
                {product.manufacturer.slice(0, 6)}…
                {product.manufacturer.slice(-4)}
              </code>
            </ChainRow>

            <ChainRow icon={<Hash className="size-3.5" />} label="Product ID">
              <code className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 text-foreground">
                {product.productPDA.slice(0, 6)}…
                {product.productPDA.slice(-4)}
              </code>
            </ChainRow>

            <ChainRow icon={<Globe className="size-3.5" />} label="Network">
              <span className="text-sm text-foreground capitalize">
                {CLUSTER}
              </span>
            </ChainRow>
          </div>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 bg-muted/20 border-t border-border text-sm text-primary hover:bg-muted/40 transition-colors"
          >
            <span className="font-medium">View on Solana Explorer</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          Secured by{" "}
          <span className="font-semibold text-foreground">Authlink</span>
        </p>
      </div>
    </div>
  );
}

// ── Failed ────────────────────────────────────────────────────────────────────

function FailState({ reason }: { reason: string }) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 pt-5">
        <span className="font-heading text-base font-bold tracking-tight text-foreground">
          Authlink
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm space-y-6 text-center">
          {/* Icon */}
          <div className="mx-auto rounded-full bg-destructive/10 p-6 w-fit">
            <ShieldX
              className="size-16 text-destructive"
              strokeWidth={1.25}
            />
          </div>

          {/* Status */}
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

          {/* Warning box */}
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-left">
            <p className="text-xs text-destructive/80 leading-relaxed">
              If you believe this is an error, contact the seller or
              manufacturer and share the full URL of this verification page.
            </p>
          </div>
        </div>
      </div>

      <footer className="px-5 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          Secured by{" "}
          <span className="font-semibold text-foreground">Authlink</span>
        </p>
      </footer>
    </div>
  );
}

// ── Utility ───────────────────────────────────────────────────────────────────

function ChainRow({
  icon,
  label,
  children,
}: {
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
