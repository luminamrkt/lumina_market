"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/stores/ui-store"

interface ToastProps {
  title: string
  description?: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colorMap = {
  success: "border-green-500/30 bg-green-500/10",
  error: "border-red-500/30 bg-red-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
  warning: "border-yellow-500/30 bg-yellow-500/10",
}

const iconColorMap = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-blue-400",
  warning: "text-yellow-400",
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type || "info"]
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl",
              "animate-in slide-in-from-right duration-300",
              colorMap[toast.type || "info"]
            )}
          >
            <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconColorMap[toast.type || "info"])} />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-white/60 mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-full p-1 text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function useToast() {
  const addToast = useUIStore((state) => state.addToast)
  const removeToast = useUIStore((state) => state.removeToast)

  const toast = React.useCallback(
    (props: ToastProps) => {
      const id = Date.now().toString()
      addToast({ ...props, id })
      const duration = props.duration || 4000
      setTimeout(() => removeToast(id), duration)
    },
    [addToast, removeToast]
  )

  return { toast }
}
