"use client"

import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Flickering grid background */}
      <FlickeringGrid
        className="absolute inset-0 z-0 mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-32 text-center lg:py-44">

        {/* Heading */}
        <h1 className="font-heading text-6xl font-semibold leading-[1.06] tracking-tight text-foreground lg:text-7xl">
          Authenticity Your
          <br />
          Customers Can Trust.
        </h1>

        {/* Subtext */}
        <p className="max-w-115 text-lg leading-relaxed text-muted-foreground">
          Cryptographic and tamper-proof authenticity powered by Solana for any product.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Button className="h-11 gap-2 px-7 text-sm font-medium">
            Book a Demo <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-11 px-5 text-sm text-muted-foreground hover:text-foreground"
          >
            See how it works
          </Button>
        </div>

        {/* Stats */}
        <div className="flex w-full max-w-md items-center divide-x divide-border pt-2">
          {[
            { value: "$179B", label: "Anti-counterfeit market" },
            { value: "<1s", label: "Verification time" },
            { value: "0", label: "Apps required" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1 px-6">
              <span className="font-heading text-2xl font-semibold text-foreground">
                {value}
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Mockup */}
        <div className="mt-6 w-full max-w-sm">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-4 py-3">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="mx-auto font-mono text-[11px] text-muted-foreground">
                authlink.io/verify/a3f9…
              </span>
            </div>

            {/* Verification result */}
            <div className="flex flex-col items-center gap-6 px-8 py-10">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-7 text-primary" strokeWidth={2.5} />
              </div>

              <div className="flex flex-col items-center gap-1">
                <p className="font-heading text-2xl font-semibold text-foreground">
                  Authentic
                </p>
                <p className="text-sm text-muted-foreground">
                  Jordan Air Max 1 OG · Nike, Inc.
                </p>
              </div>

              <div className="w-full space-y-2.5 text-left">
                {[
                  "NFC signature verified",
                  "Blockchain record confirmed",
                  "Manufacturer authenticated",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="size-3.5 shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
