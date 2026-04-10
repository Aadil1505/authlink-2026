import { Geist, Geist_Mono, Inter } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: {
    default: "Authlink — NFC Product Authentication on Solana",
    template: "%s | Authlink",
  },
  description:
    "Authlink protects your brand with NFC-powered authentication and permanent on-chain records. Customers verify product authenticity in one tap — no app required.",
  keywords: [
    "product authentication",
    "NFC authentication",
    "anti-counterfeit",
    "blockchain authentication",
    "Solana",
    "brand protection",
    "product verification",
  ],
  authors: [{ name: "Authlink" }],
  creator: "Authlink",
  metadataBase: new URL("https://authlink.app"),
  openGraph: {
    type: "website",
    url: "https://authlink.app",
    title: "Authlink — NFC Product Authentication on Solana",
    description:
      "Protect your brand with cryptographic NFC tags and permanent blockchain records. One tap. Instant proof. No app required.",
    siteName: "Authlink",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Authlink" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Authlink — NFC Product Authentication on Solana",
    description:
      "Protect your brand with cryptographic NFC tags and permanent blockchain records. One tap. Instant proof. No app required.",
    creator: "@authlink",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const interHeading = Inter({ subsets: ['latin'], variable: '--font-heading' });

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", geistMono.variable, interHeading.variable)}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
