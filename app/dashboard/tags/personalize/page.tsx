"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  NfcIcon,
  CheckCircle2Icon,
  XCircleIcon,
  WifiOffIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Product = { id: string; name: string };

// ── status shapes ──────────────────────────────────────────────────────────────

type ServerStatus =
  | { state: "loading" }
  | { state: "unreachable"; error: string }
  | {
      state: "ok";
      readerReady: boolean;
      reader: string | null;
      cardPresent: boolean;
      masterKeyConfigured: boolean;
      masterKeySecure: boolean;
    };

type CardStatus =
  | { state: "idle" }
  | { state: "reading" }
  | { state: "detected"; uid: string }
  | { state: "absent" }
  | { state: "error"; error: string };

// ── proxy helper ───────────────────────────────────────────────────────────────

async function persona<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(`/api/personalization/${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function NewTagPage() {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({ state: "loading" });
  const [cardStatus, setCardStatus] = useState<CardStatus>({ state: "idle" });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const statusPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load products
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setProducts(d); })
      .finally(() => setLoadingProducts(false));
  }, []);

  // Poll /status every 3s
  useEffect(() => {
    async function poll() {
      try {
        const { ok, data } = await persona<Record<string, unknown>>("status");
        if (!ok) { setServerStatus({ state: "unreachable", error: (data as { error?: string }).error ?? "Server error" }); return; }
        setServerStatus({
          state: "ok",
          readerReady: !!data.isReaderReady,
          reader: (data.reader as string) ?? null,
          cardPresent: !!data.cardPresent,
          masterKeyConfigured: !!data.masterKeyConfigured,
          masterKeySecure: !!data.masterKeyIsSecure,
        });
      } catch {
        setServerStatus({ state: "unreachable", error: "Server unreachable" });
      }
    }
    poll();
    statusPollRef.current = setInterval(poll, 3000);
    return () => { if (statusPollRef.current) clearInterval(statusPollRef.current); };
  }, []);

  // Poll /card/uid every 2s when reader is ready
  useEffect(() => {
    if (cardPollRef.current) clearInterval(cardPollRef.current);

    const readerReady = serverStatus.state === "ok" && serverStatus.readerReady;
    if (!readerReady) {
      setCardStatus({ state: "idle" });
      return;
    }

    async function pollUid() {
      if (loading) return;
      try {
        const { ok, status, data } = await persona<{ uid?: string; error?: string }>("card/uid");
        if (ok && data.uid) {
          setCardStatus({ state: "detected", uid: data.uid });
        } else if (status === 404) {
          setCardStatus({ state: "absent" });
        } else {
          setCardStatus({ state: "error", error: data.error ?? "Read error" });
        }
      } catch {
        setCardStatus({ state: "error", error: "Could not read card" });
      }
    }

    pollUid();
    cardPollRef.current = setInterval(pollUid, 2000);
    return () => { if (cardPollRef.current) clearInterval(cardPollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverStatus.state === "ok" && (serverStatus as { readerReady: boolean }).readerReady, loading]);

  const cardDetected = cardStatus.state === "detected";
  const canSubmit = productId.length > 0 && cardDetected && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error ?? "Something went wrong"); return; }
      router.push("/dashboard/tags");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to register tag. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      <Link
        href="/dashboard/tags"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back to NFC Tags
      </Link>

      <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
        <div>
          <h2 className="text-xl font-semibold">Personalize Tag</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Place a blank NFC tag on the reader, select a product, then click Register.
            The chip is personalized and recorded on-chain in one step.
          </p>
        </div>

        {/* Reader status panel */}
        <StatusPanel serverStatus={serverStatus} cardStatus={cardStatus} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tag Details</CardTitle>
            <CardDescription>
              The UID is read from the chip automatically — no manual entry needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="product">
                  Product <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={productId}
                  onValueChange={setProductId}
                  disabled={loading || loadingProducts}
                  required
                >
                  <SelectTrigger id="product">
                    <SelectValue
                      placeholder={loadingProducts ? "Loading products…" : "Select a product"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                    {!loadingProducts && products.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No products found.{" "}
                        <Link href="/dashboard/products/new" className="text-primary hover:underline">
                          Create one first.
                        </Link>
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {submitError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                  <p className="text-sm text-destructive">{submitError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={!canSubmit}>
                  {loading ? (
                    <><LoaderCircleIcon className="size-4 mr-2 animate-spin" />Personalizing…</>
                  ) : (
                    <><NfcIcon className="size-4 mr-2" />Personalize</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── StatusPanel ────────────────────────────────────────────────────────────────

function StatusPanel({
  serverStatus,
  cardStatus,
}: {
  serverStatus: ServerStatus;
  cardStatus: CardStatus;
}) {
  if (serverStatus.state === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground">
        <LoaderCircleIcon className="size-4 animate-spin shrink-0" />
        Connecting to personalization server…
      </div>
    );
  }

  if (serverStatus.state === "unreachable") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
        <WifiOffIcon className="size-4 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-destructive">Personalization server unreachable</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Start the server at <code className="bg-muted rounded px-1">NTAG_PERSONALIZER_URL</code> and refresh.
          </p>
        </div>
      </div>
    );
  }

  const rows: { label: string; content: React.ReactNode }[] = [];

  // Reader row
  rows.push({
    label: "Reader",
    content: serverStatus.readerReady ? (
      <span className="flex items-center gap-2">
        <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:border-emerald-700">Ready</Badge>
        <span className="text-xs text-muted-foreground">{serverStatus.reader}</span>
      </span>
    ) : (
      <Badge variant="outline" className="text-amber-600 border-amber-300 dark:border-amber-700">No reader</Badge>
    ),
  });

  // Tag row
  rows.push({
    label: "Tag",
    content: (() => {
      if (!serverStatus.readerReady) return <span className="text-xs text-muted-foreground">—</span>;
      switch (cardStatus.state) {
        case "idle":
        case "reading":
          return (
            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <LoaderCircleIcon className="size-3 animate-spin" /> Checking…
            </span>
          );
        case "detected":
          return (
            <span className="flex items-center gap-2">
              <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:border-emerald-700">Detected</Badge>
              <code className="text-xs font-mono text-muted-foreground">{cardStatus.uid}</code>
            </span>
          );
        case "absent":
          return (
            <span className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-amber-600 border-amber-300 dark:border-amber-700">Waiting</Badge>
              <span className="text-xs text-muted-foreground">Place tag on reader</span>
            </span>
          );
        case "error":
          return (
            <span className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-destructive border-destructive/40">Error</Badge>
              <span className="text-xs text-muted-foreground">{cardStatus.error}</span>
            </span>
          );
      }
    })(),
  });

  // Master key row
  rows.push({
    label: "Master Key",
    content: !serverStatus.masterKeyConfigured ? (
      <Badge variant="outline" className="text-destructive border-destructive/40">Missing</Badge>
    ) : !serverStatus.masterKeySecure ? (
      <span className="flex items-center gap-1.5">
        <Badge variant="outline" className="text-amber-600 border-amber-300 dark:border-amber-700">Test</Badge>
        <span className="text-xs text-muted-foreground">All-zero key — insecure</span>
      </span>
    ) : (
      <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:border-emerald-700">Configured</Badge>
    ),
  });

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Reader Status
        </p>
        <RefreshCwIcon className="size-3 text-muted-foreground animate-spin" style={{ animationDuration: "3s" }} />
      </div>
      <div className="divide-y divide-border">
        {rows.map(({ label, content }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div>{content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
