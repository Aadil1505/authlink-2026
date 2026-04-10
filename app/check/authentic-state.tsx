"use client";

import type { product, tag } from "@/db/schema";
import {
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Fingerprint,
  Globe,
  Hash,
  KeyRound,
  ShieldCheck,
  Tally5
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const MotionLink = motion(Link);

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function AuthenticState({
  tag: tagRecord,
  product: productRecord,
  cluster,
  txUrl,
  mfgUrl,
}: {
  tag: typeof tag.$inferSelect;
  product: typeof product.$inferSelect;
  cluster: string;
  txUrl: string;
  mfgUrl: string;
}) {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const ctr = searchParams.get("ctr");
  const cmac = searchParams.get("cmac");

  const ts = new Date(tagRecord.registeredAt);
  const registeredDate = ts.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const registeredTime = ts.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const tagRows = [
    ...(uid
      ? [
          {
            icon: <Fingerprint className="size-3.5" />,
            label: "Tag UID",
            content: (
              <code className="text-xs font-mono bg-muted rounded px-1.5 py-0.5">
                {uid}
              </code>
            ),
          },
        ]
      : []),
    ...(ctr
      ? [
          {
            icon: <Tally5 className="size-3.5" />,
            label: "Counter",
            content: (
              <code className="text-xs font-mono bg-muted rounded px-1.5 py-0.5">
                {ctr}
              </code>
            ),
          },
        ]
      : []),
    ...(cmac
      ? [
          {
            icon: <KeyRound className="size-3.5" />,
            label: "CMAC",
            content: (
              <code className="text-xs font-mono bg-muted rounded px-1.5 py-0.5">
                {cmac}
              </code>
            ),
          },
        ]
      : []),
  ];

  const chainRows = [
    {
      icon: <Calendar className="size-3.5" />,
      label: "Registered",
      content: <span className="text-sm font-medium">{registeredDate}</span>,
    },
    {
      icon: <Clock className="size-3.5" />,
      label: "Time",
      content: <span className="text-sm">{registeredTime}</span>,
    },
    {
      icon: <Building2 className="size-3.5" />,
      label: "Manufacturer",
      content: (
        <Link
          href={mfgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline underline-offset-2"
        >
          <code className="text-xs font-mono px-1.5 py-0.5">
            {tagRecord.manufacturerPda.slice(0, 6)}…
            {tagRecord.manufacturerPda.slice(-4)}
          </code>
          <ExternalLink className="size-3" />
        </Link>
      ),
    },
    {
      icon: <Hash className="size-3.5" />,
      label: "Transaction",
      content: (
        <Link
          href={txUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline underline-offset-2"
        >
          <code className="text-xs font-mono px-1.5 py-0.5">
            {tagRecord.registrationTx.slice(0, 6)}…
            {tagRecord.registrationTx.slice(-4)}
          </code>
          <ExternalLink className="size-3" />
        </Link>
      ),
    },
    {
      icon: <Globe className="size-3.5" />,
      label: "Network",
      content: <span className="text-sm capitalize">{cluster}</span>,
    },
  ];

  return (
    <div className="min-h-svh bg-background flex flex-col">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-5 pt-5 pb-0 md:px-10 md:pt-8 max-w-5xl mx-auto w-full"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <span className="font-heading text-sm font-bold tracking-tight text-foreground">
          Authlink
        </span>
        <motion.div
          className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 border border-emerald-200 dark:border-emerald-500/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease }}
        >
          <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            Verified
          </span>
        </motion.div>
      </motion.header>

      {/* Main */}
      <main className="flex-1 flex flex-col md:justify-center px-5 pt-6 pb-10 md:px-10 md:py-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:gap-10 md:items-stretch">
          
          {/* Image */}
          <motion.div
            className="md:w-[45%] md:shrink-0 flex"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
          >
            <div className="rounded-2xl overflow-hidden w-full h-full relative flex">
              {productRecord.imageUrl ? (
                <img
                  src={productRecord.imageUrl}
                  alt={productRecord.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-linear-to-br from-primary/5 via-primary/8 to-primary/15">
                  <div className="rounded-full bg-primary/10 p-5">
                    <ShieldCheck
                      className="size-12 text-primary/70"
                      strokeWidth={1.25}
                    />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/40">
                    No image
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            className="mt-6 md:mt-0 md:flex-1 space-y-6"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
          >
            {/* Name & description */}
            <motion.div
              className="space-y-2"
              variants={fadeUp}
              transition={{ duration: 0.45, delay: 0.2, ease }}
            >
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-tight">
                {productRecord.name}
              </h1>
              {productRecord.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {productRecord.description}
                </p>
              )}
            </motion.div>

            {/* Blockchain record */}
            <motion.div
              className="rounded-2xl border border-border overflow-hidden"
              variants={fadeUp}
              transition={{ duration: 0.45, delay: 0.3, ease }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  PRODUCT RECORD
                </h2>
              </div>

              <div className="divide-y divide-border">
                {[...tagRows, ...chainRows].map((row, i) => (
                  <motion.div
                    key={row.label}
                    className="flex items-center justify-between px-4 py-3"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.06, ease }}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {row.icon}
                      <span className="text-sm">{row.label}</span>
                    </div>
                    {row.content}
                  </motion.div>
                ))}
              </div>

              <MotionLink
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 border-t border-border text-sm text-primary hover:bg-muted/40 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.75, ease }}
              >
                <span className="font-medium">View on Solana Explorer</span>
                <ExternalLink className="size-3.5" />
              </MotionLink>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <motion.footer
        className="pb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.85, ease }}
      >
        <p className="text-xs text-muted-foreground">
          Secured by{" "}
          <span className="font-semibold text-foreground">Authlink</span>
        </p>
      </motion.footer>
    </div>
  );
}