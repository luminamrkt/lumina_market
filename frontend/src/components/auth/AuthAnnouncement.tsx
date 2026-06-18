"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export default function AuthAnnouncement() {
  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
      animate={{ y: [0, -12, 0] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 backdrop-blur-xl p-4 shadow-xl shadow-amber-500/10">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-200">
              Login & Signup Belum Tersedia
            </p>
            <p className="mt-1 text-xs text-amber-300/70 leading-relaxed">
              Website masih dalam tahap pengembangan. Pantau terus
              perkembangannya di Instagram{" "}
              <span className="font-semibold text-amber-200">@lumina_mrkt</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
