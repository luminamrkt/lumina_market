"use client"

import { useMemo } from "react"

interface PasswordStrengthProps {
  password: string
}

function getStrength(password: string): { score: number; label: string; color: string; width: string } {
  if (!password) return { score: 0, label: "", color: "", width: "0%" }

  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: "Lemah", color: "bg-red-500", width: "25%" }
  if (score <= 2) return { score, label: "Sedang", color: "bg-orange-500", width: "50%" }
  if (score <= 3) return { score, label: "Kuat", color: "bg-yellow-500", width: "75%" }
  return { score, label: "Sangat Kuat", color: "bg-green-500", width: "100%" }
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => getStrength(password), [password])

  if (!password) return null

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              strength.score >= i ? strength.color : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength.color.replace("bg-", "text-")}`}>
        {strength.label}
      </p>
    </div>
  )
}
