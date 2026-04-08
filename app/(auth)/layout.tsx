import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-7">
        <div className="text-center space-y-1">
          <Link href="/">
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Authlink
            </span>
          </Link>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Manufacturer Portal
          </p>
        </div>

        {children}
      </div>
    </div>
  )
}
