"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface SheetContentProps {
  side?: "left" | "right"
  children: React.ReactNode
  className?: string
}

const SheetContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({ open: false, onOpenChange: () => {} })

function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

function SheetTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { onOpenChange } = React.useContext(SheetContext)
  const child = React.Children.only(children) as React.ReactElement<{ onClick?: () => void }>

  if (asChild) {
    return React.cloneElement(child, { onClick: () => onOpenChange(true) })
  }

  return (
    <button onClick={() => onOpenChange(true)} className="cursor-pointer">
      {children}
    </button>
  )
}

function SheetContent({ side = "right", children, className }: SheetContentProps) {
  const { open, onOpenChange } = React.useContext(SheetContext)

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-[280px] glass-strong p-6 shadow-2xl transition-transform duration-300",
          side === "right" ? "right-0" : "left-0",
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </>
  )
}

function SheetClose({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = React.useContext(SheetContext)
  const child = React.Children.only(children) as React.ReactElement<{ onClick?: () => void }>
  return React.cloneElement(child, { onClick: () => onOpenChange(false) })
}

export { Sheet, SheetTrigger, SheetContent, SheetClose }
