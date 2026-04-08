import { Shield } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-1">
        <span className="font-heading text-base font-bold tracking-tight text-foreground">
          Authlink
        </span>
        <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
      </header>

      {/* Image skeleton */}
      <div className="mx-5 mt-4 rounded-2xl overflow-hidden bg-muted aspect-square flex items-center justify-center animate-pulse">
        <Shield className="size-12 text-muted-foreground/30" />
      </div>

      {/* Content skeleton */}
      <div className="px-5 pt-5 pb-10 space-y-6">
        {/* Name & description */}
        <div className="space-y-2.5">
          <div className="h-7 w-3/4 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        </div>

        {/* Attributes */}
        <div className="space-y-3">
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-muted/30 px-3 py-2.5 space-y-1.5 animate-pulse"
              >
                <div className="h-2.5 w-12 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain record */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
            <div className="size-1.5 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-28 rounded bg-muted animate-pulse" />
          </div>
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 animate-pulse"
              >
                <div className="flex items-center gap-2">
                  <div className="size-3.5 rounded bg-muted" />
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-t border-border animate-pulse">
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="size-3.5 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
