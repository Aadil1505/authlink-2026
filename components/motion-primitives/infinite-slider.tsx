"use client"

import { useRef, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface InfiniteSliderProps {
  children: React.ReactNode
  speed?: number
  speedOnHover?: number
  gap?: number
  className?: string
}

export function InfiniteSlider({
  children,
  speed = 40,
  speedOnHover,
  gap = 80,
  className,
}: InfiniteSliderProps) {
  const [hovered, setHovered] = useState(false)
  const duration = hovered && speedOnHover ? speedOnHover : speed

  return (
    <div
      className={cn("flex overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ maskImage: "none" }}
    >
      <motion.div
        className="flex shrink-0 items-center"
        style={{ gap }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}
