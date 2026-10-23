"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  trend?: number
  trendLabel?: string
  delay?: number
}

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, delay = 0 }: StatCardProps) {
  const isPositive = trend && trend > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/5 hover:shadow-lg hover:shadow-blue-500/5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            isPositive ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      {trendLabel && <p className="text-xs text-white/30 mt-1">{trendLabel}</p>}
    </motion.div>
  )
}
