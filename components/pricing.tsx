import { Check, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "For emerging brands ready to protect their first product lines.",
    cta: "Contact Sales",
    href: "#contact",
    highlight: false,
    features: [
      { label: "Up to 10,000 NFC tags/year", included: true },
      { label: "Blockchain product registration", included: true },
      { label: "Verification dashboard", included: true },
      { label: "Basic fraud analytics", included: true },
      { label: "Email support", included: true },
      { label: "Advanced analytics & heatmaps", included: false },
      { label: "API access", included: false },
      { label: "Custom branding on verify page", included: false },
      { label: "Dedicated account manager", included: false },
    ],
  },
  {
    name: "Growth",
    price: "$1,499",
    period: "/month",
    description: "For scaling manufacturers with high-volume and insights.",
    cta: "Contact Sales",
    href: "#contact",
    highlight: true,
    features: [
      { label: "Up to 100,000 NFC tags/year", included: true },
      { label: "Blockchain product registration", included: true },
      { label: "Verification dashboard", included: true },
      { label: "Advanced analytics & heatmaps", included: true },
      { label: "Priority email & chat support", included: true },
      { label: "API access", included: true },
      { label: "Custom branding on verify page", included: true },
      { label: "Dedicated account manager", included: false },
      { label: "Custom smart contract deployment", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For global brands and luxury houses with complex requirements.",
    cta: "Contact Sales",
    href: "#contact",
    highlight: false,
    features: [
      { label: "Unlimited NFC tags", included: true },
      { label: "Blockchain product registration", included: true },
      { label: "Verification dashboard", included: true },
      { label: "Advanced analytics & heatmaps", included: true },
      { label: "24/7 dedicated support", included: true },
      { label: "API access", included: true },
      { label: "Custom branding on verify page", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "Custom smart contract deployment", included: true },
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">

        {/* Header */}
        <div className="mx-auto mb-16 flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Pricing
          </p>
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground lg:text-5xl">
            Simple, transparent
            <br />
            pricing.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            No hidden fees. No per-scan surprises on Starter and Growth.
            Pick the plan that fits your volume — upgrade any time.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map(({ name, price, period, description, cta, href, highlight, features }) => (
            <div
              key={name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8",
                highlight
                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                  : "border-border bg-card"
              )}
            >
              {/* Popular badge */}
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-background px-3 py-1 text-[11px] font-semibold text-primary border border-border">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name + description */}
              <div className="mb-6 flex flex-col gap-2">
                <p className={cn(
                  "text-xs font-semibold uppercase tracking-[0.14em]",
                  highlight ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "font-heading text-4xl font-semibold tracking-tight",
                    highlight ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {price}
                  </span>
                  {period && (
                    <span className={cn(
                      "text-sm",
                      highlight ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {period}
                    </span>
                  )}
                </div>
                <p className={cn(
                  "text-sm leading-relaxed",
                  highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {description}
                </p>
              </div>

              {/* CTA */}
              <Button
                asChild
                variant={highlight ? "secondary" : "outline"}
                className="mb-8 w-full"
              >
                <Link href={href}>{cta}</Link>
              </Button>

              {/* Divider */}
              <div className={cn("mb-6 h-px", highlight ? "bg-primary-foreground/20" : "bg-border")} />

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {features.map(({ label, included }) => (
                  <li key={label} className="flex items-center gap-3">
                    {included ? (
                      <Check className={cn(
                        "size-4 shrink-0",
                        highlight ? "text-primary-foreground" : "text-primary"
                      )} />
                    ) : (
                      <Minus className={cn(
                        "size-4 shrink-0",
                        highlight ? "text-primary-foreground/30" : "text-muted-foreground/40"
                      )} />
                    )}
                    <span className={cn(
                      "text-sm",
                      included
                        ? highlight ? "text-primary-foreground" : "text-foreground"
                        : highlight ? "text-primary-foreground/40" : "text-muted-foreground/50"
                    )}>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          NFC tags sold separately. Volume discounts available on all plans.{" "}
          <Link href="#contact" className="text-foreground underline underline-offset-4">
            Talk to sales
          </Link>{" "}
          for custom tag pricing.
        </p>

      </div>
    </section>
  )
}
