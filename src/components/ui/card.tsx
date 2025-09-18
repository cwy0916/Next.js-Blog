import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

type CardContentProps = {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  )
}