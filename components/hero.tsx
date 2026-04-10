"use client"

import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react"

const ease = [0.25, 0.46, 0.45, 0.94] as const

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
        <motion.h1
          className="font-heading text-6xl font-semibold leading-[1.06] tracking-tight text-foreground lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
        >
          Authenticity Your
          <br />
          Customers Can Trust.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="max-w-115 text-lg leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.18 }}
        >
          Cryptographic and tamper-proof authenticity powered by Solana for any product.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.28 }}
        >
          <Button asChild className="h-11 gap-2 px-7 text-sm font-medium">
            <Link href="/check?uid=0454151AC21390&ctr=000004&cmac=7CDFACB7D9A8F7E4" target="_blank" rel="noopener noreferrer">
              See Demo <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-11 px-5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Link href="#contact">
              Contact Sales
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex w-full max-w-md items-center divide-x divide-border pt-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.38 }}
        >
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
        </motion.div>

        {/* Hero image */}
        <motion.div
          className="mt-6 max-w-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
        >
          <img
            src="/hero-img.png"
            alt="Authlink product verification"
            className="w-full rounded-2xl"
          />
        </motion.div>

      </div>
    </section>
  )
}
