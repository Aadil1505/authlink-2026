import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, MessageSquare } from "lucide-react"

export function Contact() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid lg:grid-cols-2">

            {/* Left — CTA */}
            <div className="flex flex-col justify-center gap-6 p-10 lg:p-14">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Get in Touch
                </p>
                <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-tight text-foreground lg:text-4xl">
                  Ready to protect
                  <br />
                  your products?
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Book a 30-minute demo and we'll walk you through the full
                  platform — from NFC tag setup to your first blockchain-verified
                  product.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="h-11 gap-2 px-6 text-sm font-medium">
                  Book a Demo <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" className="h-11 px-6 text-sm font-medium">
                  Contact Sales
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                <a
                  href="mailto:hello@authlink.io"
                  className="transition-colors hover:text-foreground"
                >
                  hello@authlink.io
                </a>
              </div>
            </div>

            {/* Right — form */}
            <div className="border-t border-border bg-muted/40 p-10 lg:border-l lg:border-t-0 lg:p-14">
              <form className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="Alex"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="Johnson"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Work email
                  </label>
                  <input
                    type="email"
                    placeholder="alex@company.com"
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your product and volume..."
                    className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>

                <Button className="mt-1 h-10 w-full gap-2 text-sm font-medium">
                  <MessageSquare className="size-4" />
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
