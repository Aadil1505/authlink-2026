import { cn } from "@/lib/utils"
import { Watch, Shirt, Cpu, Wine, Footprints } from "lucide-react"

const cases = [
  {
    icon: Watch,
    industry: "Luxury Goods",
    headline: "Every piece, provably genuine.",
    description:
      "Watches, handbags, and jewellery are among the most counterfeited categories in the world. Authlink gives each item an unforgeable digital identity — so customers buy with confidence and resale value is preserved.",
    tags: ["Watches", "Handbags", "Jewellery"],
    stat: { value: "$4.5B", label: "lost to luxury counterfeits annually" },
  },
  {
    icon: Footprints,
    industry: "Sneakers & Streetwear",
    headline: "Kill the replica market at the source.",
    description:
      "Limited drops and high-demand silhouettes attract sophisticated fakes. An Authlink NFC tag embedded during manufacturing lets buyers verify authenticity at purchase — and every time after.",
    tags: ["Limited Drops", "Resale", "Apparel"],
    stat: { value: "1 in 3", label: "sneakers sold online is counterfeit" },
  },
  {
    icon: Cpu,
    industry: "Electronics",
    headline: "Prove it came off your line.",
    description:
      "From components to finished goods, counterfeit electronics cost manufacturers billions and damage brand trust. Authlink tags bind physical hardware to an immutable on-chain identity.",
    tags: ["Components", "Warranty", "B2B"],
    stat: { value: "$169B", label: "lost to counterfeit electronics yearly" },
  },
  {
    icon: Wine,
    industry: "Spirits & Fine Wine",
    headline: "From the vineyard. Verifiably.",
    description:
      "Premium bottles command premium prices — and attract premium fakes. Embed an Authlink tag beneath the label or capsule so buyers can verify provenance at the point of pour.",
    tags: ["Provenance", "Collectibles", "Hospitality"],
    stat: { value: "20%", label: "of fine wine sold is counterfeit or mislabelled" },
  },
  {
    icon: Shirt,
    industry: "Fashion & Apparel",
    headline: "Authentication built into the garment.",
    description:
      "Embed NFC tags in care labels, buttons, or packaging. Retailers and customers get instant proof the piece is genuine — and brands retain control over the grey market.",
    tags: ["Labels", "Grey Market", "DTC"],
    stat: { value: "$50B+", label: "fashion counterfeiting market" },
  },
]

export function UseCases() {
  return (
    <section id="use-cases">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">

        {/* Header */}
        <div className="mx-auto mb-16 flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Use Cases
          </p>
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground lg:text-5xl">
            Built for industries
            <br />
            where trust is everything.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Wherever counterfeiting causes harm — to brands, customers, or
            public safety — Authlink provides a verifiable answer.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map(({ icon: Icon, industry, headline, description, tags, stat }, i) => (
            <div
              key={industry}
              className={cn(
                "group flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40",
                // first card spans 2 cols on lg for visual variety
                i === 0 && "lg:col-span-2"
              )}
            >
              {/* Icon + industry */}
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted">
                  <Icon className="size-4 text-foreground" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {industry}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
                  {headline}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stat */}
              <div className="mt-auto border-t border-border pt-5">
                <p className="font-heading text-xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
