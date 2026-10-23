import * as React from "react"
import { cn } from "@/lib/utils"

export function ScrollArea({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
}
