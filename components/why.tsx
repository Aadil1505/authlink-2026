import { TrendingUp, Users, Award, RefreshCw, ShieldAlert, LineChart } from "lucide-react"

const reasons = [
  {
    icon: ShieldAlert,
    title: "Counterfeits destroy brands.",
    description:
      "One viral fake — wrong materials, poor quality, a safety incident — can undo years of brand equity. Authlink makes it impossible for counterfeits to pass as genuine, at scale.",
  },
  {
    icon: TrendingUp,
    title: "Recover revenue you didn't know you were losing.",
    description:
      "The counterfeit market doesn't just hurt reputation — it directly displaces sales. Every fake sold is a customer you lost. Authlink closes that gap by making authenticity verifiable at the point of purchase.",
  },
  {
    icon: Users,
    title: "Customers who can verify, trust more.",
    description:
      "A buyer who taps their phone and sees 'Authentic' becomes a loyal customer. Authentication isn't just protection — it's a brand experience that builds confidence with every single purchase.",
  },
  {
    icon: Award,
    title: "Protect resale value.",
    description:
      "In luxury, sneakers, and collectibles, resale price is tied directly to provenance. Authlink-tagged products carry a verifiable history — driving premium resale prices and making your brand more desirable.",
  },
  {
    icon: RefreshCw,
    title: "Take control of the grey market.",
    description:
      "Parallel imports and grey market goods are hard to track and harder to stop. With Authlink, every registered unit has a verifiable identity — giving you the data to act.",
  },
  {
    icon: LineChart,
    title: "Intelligence, not just protection.",
    description:
      "Authlink's dashboard tells you where your products are being scanned, by whom, and how often. That's market intelligence you can act on — from spotting fraud hotspots to understanding where demand is emerging.",
  },
]

export function Why() {
  return (
    <section id="why" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">

        {/* Header */}
        <div className="mx-auto mb-16 flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Why Authlink
          </p>
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground lg:text-5xl">
            Your brand is worth
            <br />
            protecting.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Counterfeiting isn't just a legal problem — it's a brand problem, a
            revenue problem, and a customer trust problem. Authlink solves all
            three.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border border-border">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-muted/40"
            >
              <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
                <Icon className="size-4 text-foreground transition-colors group-hover:text-primary" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
