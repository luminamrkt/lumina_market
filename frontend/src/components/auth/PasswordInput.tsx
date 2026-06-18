"use client"

import { useState, forwardRef } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [show, setShow] = useState(false)

    return (
      <div className="space-y-2">
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors duration-200 group-focus-within:text-blue-400" />
          <input
            ref={ref}
            type={show ? "text" : "password"}
            className={cn(
              "flex h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-12 text-sm text-white",
              "placeholder:text-white/20 transition-all duration-300",
              "focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
              "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
              "hover:border-white/20",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer"
            tabIndex={-1}
            aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
