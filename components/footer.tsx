import Image from "next/image"
import Link from "next/link"

const links = [
  { title: "How It Works", href: "#how-it-works" },
  { title: "Features", href: "#features" },
  { title: "Use Cases", href: "#use-cases" },
  { title: "Pricing", href: "#pricing" },
  { title: "Contact", href: "#contact" },
]

const socials = [
  {
    label: "X / Twitter",
    href: "#",
    icon: (
      <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">

        {/* Logo */}
        <Link href="/" aria-label="Go home" className="mx-auto flex w-fit items-center gap-2.5">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="Authlink"
            width={26}
            height={26}
            className="dark:invert"
          />
          <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
            Authlink
          </span>
        </Link>

        {/* Nav links */}
        <div className="my-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {links.map(({ title, href }) => (
            <Link
              key={title}
              href={href}
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {title}
            </Link>
          ))}
        </div>

        {/* Social icons */}
        <div className="my-8 flex justify-center gap-5">
          {socials.map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {icon}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-border" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Authlink. All rights reserved.
          </p>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-foreground">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
