"use client"

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
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Fingerprint,
  Globe,
  Hash,
  KeyRound,
  Tally5,
} from "lucide-react"
import { ReactNode } from "react"
import { motion } from "motion/react"
import Image from "next/image"

const ease = [0.25, 0.46, 0.45, 0.94] as const

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
  <div className="mt-6 w-full h-72 relative overflow-hidden">
    <img
      src="/desktop-img.png"
      alt="Authlink verification browser screenshot"
      className="absolute inset-0 w-full h-full object-contain"
    />
  </div>
)

const BlockchainRecord = () => {
  const rows = [
    {
      icon: <Fingerprint className="size-3" />,
      label: "Tag UID",
      content: <code className="text-[10px] font-mono bg-muted rounded px-1 py-0.5">0454151AC21390</code>,
    },
    {
      icon: <Tally5 className="size-3" />,
      label: "Counter",
      content: <code className="text-[10px] font-mono bg-muted rounded px-1 py-0.5">000004</code>,
    },
    {
      icon: <KeyRound className="size-3" />,
      label: "CMAC",
      content: <code className="text-[10px] font-mono bg-muted rounded px-1 py-0.5">7CDFACB7D9A8F7E4</code>,
    },
    {
      icon: <Calendar className="size-3" />,
      label: "Registered",
      content: <span className="text-xs font-medium">April 9, 2026</span>,
    },
    {
      icon: <Clock className="size-3" />,
      label: "Time",
      content: <span className="text-xs">10:10 PM EDT</span>,
    },
    {
      icon: <Building2 className="size-3" />,
      label: "Manufacturer",
      content: <span className="text-xs font-medium text-primary">Authlink Test</span>,
    },
    {
      icon: <Hash className="size-3" />,
      label: "Transaction",
      content: <code className="text-[10px] font-mono bg-muted rounded px-1 py-0.5">4VPhDv…7VU4</code>,
    },
    {
      icon: <Globe className="size-3" />,
      label: "Network",
      content: <span className="text-xs capitalize">devnet</span>,
    },
  ]
  return (
    <div className="mt-6 mx-auto w-full max-w-xs overflow-hidden rounded-xl border border-border">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="size-1.5 rounded-full bg-primary animate-pulse" />
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Product Record
        </h2>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {row.icon}
              <span className="text-xs">{row.label}</span>
            </div>
            {row.content}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-3 py-2 border-t border-border text-xs text-primary">
        <span className="font-medium">View on Solana Explorer</span>
        <ExternalLink className="size-3" />
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
        <motion.div
          className="mx-auto mb-16 flex max-w-xl flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease }}
        >
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
        </motion.div>

        {/* Bento grid */}
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">

          {/* Card 1 — Instant Verification */}
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease, delay: 0 }}
          >
            <FeatureCard className="h-full">
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
          </motion.div>

          {/* Card 2 — Blockchain Records */}
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
          >
            <FeatureCard className="h-full">
              <CardHeader className="pb-0">
                <CardHeading
                  icon={Link}
                  title="On-Chain Records"
                  description="Every product lives permanently on Solana."
                />
              </CardHeader>
              <CardContent className="pb-8">
                <BlockchainRecord />
              </CardContent>
            </FeatureCard>
          </motion.div>

          {/* Card 3 — Full-width: No App */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
          >
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
                <div className="flex items-center justify-center py-4">
                  <div className="relative flex flex-col items-center gap-6">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute size-28 rounded-full bg-primary/10 animate-ping [animation-duration:1.4s]" />
                      <span className="absolute size-20 rounded-full bg-primary/10 animate-ping [animation-duration:1.4s] [animation-delay:0.2s]" />
                      <div className="relative rounded-full bg-primary/10 p-6 z-10">
                        <ShieldCheck className="size-10 text-primary animate-pulse" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="text-center space-y-1.5">
                      <p className="text-sm font-semibold text-foreground">Verifying authenticity</p>
                      <p className="text-xs text-muted-foreground">Checking hardware signature and blockchain record…</p>
                    </div>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </motion.div>

          {/* Card 4 — Full-width: Analytics */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
          >
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
          </motion.div>

        </div>
      </div>
    </section>
  )
}
