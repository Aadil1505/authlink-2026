import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  Zap,
  Smartphone,
  BarChart3,
  LucideIcon,
  Check,
  Lock,
  Link,
} from "lucide-react"
import { ReactNode } from "react"

// ── Primitives ────────────────────────────────────────────────

interface FeatureCardProps {
  children: ReactNode
  className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <Card
    className={cn(
      "relative rounded-none shadow-none border-border",
      className
    )}
  >
    <CardDecorator />
    {children}
  </Card>
)

const CardDecorator = () => (
  <>
    <span className="absolute -left-px -top-px block size-2.5 border-l-2 border-t-2 border-primary" />
    <span className="absolute -right-px -top-px block size-2.5 border-r-2 border-t-2 border-primary" />
    <span className="absolute -bottom-px -left-px block size-2.5 border-b-2 border-l-2 border-primary" />
    <span className="absolute -bottom-px -right-px block size-2.5 border-b-2 border-r-2 border-primary" />
  </>
)

interface CardHeadingProps {
  icon: LucideIcon
  title: string
  description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div className="p-6 pb-0">
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4" />
      {title}
    </span>
    <p className="mt-6 text-2xl font-semibold text-foreground">{description}</p>
  </div>
)

// ── Decorative UI elements ────────────────────────────────────

const VerificationMockup = () => (
  <div className="mx-auto mt-6 w-full max-w-[260px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
    <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-3 py-2.5">
      <span className="size-2 rounded-full bg-border" />
      <span className="size-2 rounded-full bg-border" />
      <span className="size-2 rounded-full bg-border" />
      <span className="mx-auto font-mono text-[10px] text-muted-foreground">
        authlink.io/verify
      </span>
    </div>
    <div className="flex flex-col items-center gap-4 px-5 py-6">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
        <Check className="size-5 text-primary" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <p className="font-heading text-base font-semibold text-foreground">Authentic</p>
        <p className="text-xs text-muted-foreground">Jordan Air Max 1 · Nike, Inc.</p>
      </div>
      <div className="w-full space-y-1.5">
        {["NFC verified", "Blockchain confirmed", "Manufacturer authenticated"].map((t) => (
          <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="size-3 shrink-0 text-primary" />
            {t}
          </div>
        ))}
      </div>
    </div>
  </div>
)

const BlockchainRecord = () => {
  const rows = [
    { label: "Product ID", value: "JDN-AM1-2025" },
    { label: "Registered", value: "Jan 14, 2025" },
    { label: "Manufacturer", value: "Nike, Inc." },
    { label: "Tap count", value: "3" },
    { label: "Block", value: "#284,719,201" },
    { label: "Status", value: "Verified" },
  ]
  return (
    <div className="mx-auto mt-6 w-full max-w-[280px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
        <Lock className="size-3.5 text-primary" />
        <span className="font-mono text-[10px] text-muted-foreground">
          Solana · Immutable Record
        </span>
      </div>
      <div className="divide-y divide-border">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[11px] text-muted-foreground">{label}</span>
            <span className="font-mono text-[11px] font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const AnalyticsMockup = () => {
  const bars = [40, 65, 50, 80, 60, 90, 75]
  return (
    <div className="mx-auto mt-6 w-full max-w-[280px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-3.5 text-primary" />
          <span className="text-[11px] font-medium text-foreground">Verification Activity</span>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
          Live
        </span>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-end gap-1.5 h-16">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-primary/20"
              style={{ height: `${h}%` }}
            >
              <div
                className="rounded-sm bg-primary transition-all"
                style={{ height: `${i === bars.length - 1 ? 100 : 60}%` }}
              />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {[
            { label: "Total scans today", value: "1,284" },
            { label: "Suspicious activity", value: "0" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{label}</span>
              <span className="font-mono text-[11px] font-semibold text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────

export function Features() {
  return (
    <section id="features" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">

        {/* Header */}
        <div className="mx-auto mb-16 flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Features
          </p>
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground lg:text-5xl">
            Everything you need
            <br />
            to fight counterfeits.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            One platform. Cryptographic hardware. Blockchain permanence.
            Real-time visibility across every product you ship.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">

          {/* Card 1 — Instant Verification */}
          <FeatureCard>
            <CardHeader className="pb-0">
              <CardHeading
                icon={Zap}
                title="Instant Verification"
                description="Customers get a tamper-proof result in under a second."
              />
            </CardHeader>
            <CardContent className="pb-8">
              <VerificationMockup />
            </CardContent>
          </FeatureCard>

          {/* Card 2 — Blockchain Records */}
          <FeatureCard>
            <CardHeader className="pb-0">
              <CardHeading
                icon={Link}
                title="On-Chain Records"
                description="Every product lives permanently on the Solana blockchain."
              />
            </CardHeader>
            <CardContent className="pb-8">
              <BlockchainRecord />
            </CardContent>
          </FeatureCard>

          {/* Card 3 — Full-width: No App */}
          <FeatureCard className="lg:col-span-2">
            <div className="grid items-center gap-8 p-8 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="size-4" />
                  No App Required
                </span>
                <p className="text-2xl font-semibold text-foreground">
                  Your customers verify with a single tap. Nothing to download. Nothing to learn.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The NFC tag opens a verification page directly in the browser.
                  It works on every modern smartphone — iPhone, Android, any device.
                  The experience is instant and requires zero onboarding.
                </p>
                <ul className="mt-2 space-y-2">
                  {[
                    "No app install",
                    "No account creation",
                    "Works on all NFC phones",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-3.5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative flex flex-col items-center gap-3">
                  {/* Phone frame */}
                  <div className="relative w-48 overflow-hidden rounded-3xl border-2 border-border bg-background shadow-md">
                    <div className="flex justify-center border-b border-border bg-muted/60 py-2">
                      <div className="h-1.5 w-12 rounded-full bg-border" />
                    </div>
                    <div className="flex flex-col items-center gap-3 px-4 py-6">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <Check className="size-5 text-primary" strokeWidth={2.5} />
                      </div>
                      <p className="font-heading text-sm font-semibold text-foreground">Authentic</p>
                      <div className="w-full space-y-1.5">
                        {["NFC verified", "Blockchain confirmed"].map((t) => (
                          <div key={t} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Check className="size-2.5 shrink-0 text-primary" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center border-t border-border bg-muted/60 py-2">
                      <div className="size-4 rounded-full border border-border" />
                    </div>
                  </div>
                  {/* NFC tap label */}
                  <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
                    <ShieldCheck className="size-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">Tap to verify</span>
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Card 4 — Full-width: Analytics */}
          <FeatureCard className="lg:col-span-2">
            <div className="grid items-center gap-8 p-8 lg:grid-cols-2">
              <div className="order-2 flex items-center justify-center lg:order-1">
                <AnalyticsMockup />
              </div>
              <div className="order-1 flex flex-col gap-3 lg:order-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="size-4" />
                  Fraud Analytics
                </span>
                <p className="text-2xl font-semibold text-foreground">
                  Know exactly where your products are being scanned — and when something's off.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Every NFC tap is logged. Authlink's dashboard gives you
                  real-time visibility into verification patterns, geographic
                  hotspots, and anomalous activity that signals a counterfeit in
                  the wild.
                </p>
                <ul className="mt-2 space-y-2">
                  {[
                    "Real-time tap logs",
                    "Geographic scan heatmap",
                    "Anomaly detection alerts",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-3.5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FeatureCard>

        </div>
      </div>
    </section>
  )
}
