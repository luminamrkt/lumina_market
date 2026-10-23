"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { quickFilters } from "@/data/accounts"

interface QuickFiltersProps {
  active: string
  onChange: (value: string) => void
}

export default function QuickFilters({ active, onChange }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {quickFilters.map((filter, i) => (
        <motion.button
          key={filter.value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onChange(filter.value)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border",
            active === filter.value
              ? "bg-white/[0.12] backdrop-blur-xl text-white border-blue-500/60 shadow-lg shadow-blue-500/15"
              : "bg-white/[0.08] backdrop-blur-xl text-white/60 hover:text-white hover:bg-white/[0.14] border-white/10 hover:border-white/20"
          )}
        >
          <span>{filter.icon}</span>
          <span>{filter.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
