import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type BadgeVariant = 
  | "default"
  | "secondary"
  | "outline"
  | "destructive"

type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ 
  children, 
  variant = "default", 
  className 
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": 
            variant === "default",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": 
            variant === "secondary",
          "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground": 
            variant === "outline",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": 
            variant === "destructive",
        },
        className
      )}
    >
      {children}
    </span>
  )
}