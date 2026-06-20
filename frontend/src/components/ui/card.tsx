import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn(
          "glass rounded-2xl transition-all duration-300",
          className
        )}
        {...props}
      />
    )
  )
)
Card.displayName = "Card"

const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
    )
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
    )
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("text-sm text-white/60", className)} {...props} />
    )
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
    )
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
