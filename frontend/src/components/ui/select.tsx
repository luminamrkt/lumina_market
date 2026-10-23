"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  children?: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

export function Select({ value, onValueChange, placeholder, className, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getDisplayValue = () => {
    const childArray = React.Children.toArray(children)
    for (const child of childArray) {
      if (React.isValidElement<SelectItemProps>(child) && child.props.value === value) {
        return child.props.children
      }
    }
    return placeholder || "Pilih..."
  }

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className={cn("relative", className)}>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white/80 transition-all duration-300 hover:border-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
        >
          <span className={value ? "text-white" : "text-white/20"}>{getDisplayValue()}</span>
          <ChevronDown className={cn("h-4 w-4 text-white/40 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[#0a0a0f] p-1 shadow-2xl">
            {children}
          </div>
        )}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectItem({ value, children }: SelectItemProps) {
  const ctx = React.useContext(SelectContext)
  const isSelected = ctx.value === value

  return (
    <button
      onClick={() => {
        ctx.onValueChange(value)
        ctx.setOpen(false)
      }}
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
        isSelected
          ? "bg-blue-500/20 text-blue-400"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      {children}
    </button>
  )
}
