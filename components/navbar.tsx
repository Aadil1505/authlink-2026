"use client"

import Link from "next/link"
import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Get in Touch", href: "#contact" },
]

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header>
      <nav
        data-state={open ? "active" : undefined}
        className="fixed z-50 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            scrolled &&
              "max-w-4xl rounded-2xl border border-border bg-background/70 backdrop-blur-lg lg:px-6"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">

            {/* Logo + mobile toggle row */}
            <div className="flex w-full items-center justify-between lg:w-auto">
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/web-app-manifest-192x192.png"
                  alt="Authlink"
                  width={28}
                  height={28}
                  className="dark:invert"
                />
                <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
                  Authlink
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative z-20 text-muted-foreground lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 size-5 transition-all duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-5 -rotate-180 scale-0 opacity-0 transition-all duration-200" />
              </Button>
            </div>

            {/* Desktop center links */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-7 text-sm">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop + mobile CTAs panel */}
            <div className="in-data-[state=active]:block bg-background mb-6 hidden w-full rounded-2xl border border-border p-6 shadow-lg lg:mb-0 lg:flex lg:w-fit lg:items-center lg:gap-3 lg:rounded-none lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:bg-transparent">
              {/* Mobile links */}
              <ul className="mb-6 space-y-4 text-sm lg:hidden">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3 lg:w-auto">
                <Button asChild size="sm">
                  <Link href="#contact">Book a Demo</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </nav>
    </header>
  )
}
