"use client"

import { Package, Cpu, Smartphone } from "lucide-react"
import { motion } from "motion/react"

const ease = [0.25, 0.46, 0.45, 0.94] as const

const steps = [
  {
    number: "01",
    icon: Package,
    title: "Register Your Product",
    description:
      "Add your product details to the Authlink dashboard. A unique cryptographic identity is generated and recorded permanently on the Solana blockchain.",
    detail: "One-time setup per SKU or individual unit",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Embed the NFC Tag",
    description:
      "Attach an Authlink NFC tag during manufacturing. Each tag is personalized with AES-128 encrypted keys tied to your product's blockchain record — impossible to clone.",
    detail: "NTAG 424 DNA · tamper-evident hardware",
  },
  {
    number: "03",
    icon: Smartphone,
    title: "Customers Verify Instantly",
    description:
      "Your customer taps their phone on the tag. A verification page opens in seconds showing the product's full authenticity record. No app. No friction.",
    detail: "Works on any NFC-enabled smartphone",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background">
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
            How It Works
          </p>
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground lg:text-5xl">
            From factory to customer
            <br />
            in three steps.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Authlink plugs into your existing manufacturing workflow — and
            delivers instant trust at every point of sale.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description, detail }, i) => (
              <motion.div
                key={number}
                className="flex flex-col gap-6 bg-card p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              >
                {/* Icon + number row */}
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <span className="font-mono text-5xl font-semibold leading-none text-foreground/[0.07]">
                    {number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>

                {/* Footer detail */}
                <div className="mt-auto border-t border-border pt-5">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {detail}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
