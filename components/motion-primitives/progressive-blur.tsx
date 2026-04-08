import { cn } from "@/lib/utils"

interface ProgressiveBlurProps {
  className?: string
  direction?: "left" | "right"
  blurIntensity?: number
}

export function ProgressiveBlur({
  className,
  direction = "left",
  blurIntensity = 1,
}: ProgressiveBlurProps) {
  const gradient =
    direction === "left"
      ? "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0))"
      : "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))"

  return (
    <div
      className={cn("pointer-events-none", className)}
      style={{
        backdropFilter: `blur(${blurIntensity}px)`,
        maskImage: gradient,
        WebkitMaskImage: gradient,
      }}
    />
  )
}
