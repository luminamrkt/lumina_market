"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface LoadMoreProps {
  onClick: () => void
  visible: number
  total: number
  loading?: boolean
}

export default function LoadMore({ onClick, visible, total, loading }: LoadMoreProps) {
  if (visible >= total) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex justify-center pt-8"
    >
      <Button
        variant="outline"
        size="lg"
        onClick={onClick}
        disabled={loading}
        className="group px-8"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Memuat...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Muat Lainnya ({total - visible} tersisa)
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </span>
        )}
      </Button>
    </motion.div>
  )
}
