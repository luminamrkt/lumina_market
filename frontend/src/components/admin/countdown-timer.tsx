"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  expiresAt: string
  onExpired?: () => void
}

function calculateRemaining(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.floor(diff / 1000))
}

export default function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateRemaining(expiresAt))

  useEffect(() => {
    let notified = false
    const interval = setInterval(() => {
      const remaining = calculateRemaining(expiresAt)
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        if (!notified) {
          notified = true
          onExpired?.()
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpired])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  const isUrgent = timeLeft > 0 && timeLeft <= 120
  const isExpired = timeLeft <= 0

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums",
        isExpired && "text-red-400",
        isUrgent && "text-red-400",
        !isUrgent && !isExpired && timeLeft > 120 && timeLeft <= 300 && "text-yellow-400",
        !isUrgent && !isExpired && timeLeft > 300 && "text-green-400"
      )}
    >
      {isExpired && (
        <span className="inline-block h-2 w-2 rounded-full bg-red-400 animate-pulse" />
      )}
      {isUrgent && (
        <span className="inline-block h-2 w-2 rounded-full bg-red-400 animate-pulse" />
      )}
      {isExpired ? "EXPIRED" : display}
    </span>
  )
}
