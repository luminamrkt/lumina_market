"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TriangleAlert, X } from "lucide-react"
import { useScrollPosition } from "@/hooks/useScrollPosition"

export default function DevelopmentBanner() {
  const [dismissed, setDismissed] = useState(false)
  const { isScrolled } = useScrollPosition()

  const navbarHeight = isScrolled ? 64 : 80

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="fixed left-0 right-0 z-30 overflow-hidden"
          style={{ top: navbarHeight }}
        >
          <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-b border-amber-500/25 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-100/90 relative">
              <TriangleAlert className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-center max-w-[95%] sm:max-w-none">
                <span className="hidden sm:inline">Website ini masih dalam tahap perkembangan. Akan tersedia sepenuhnya dalam waktu dekat. </span>
                <span className="sm:hidden">Website dalam pengembangan. </span>
                Pantau terus perkembangannya di{" "}
                <a
                  href="https://www.instagram.com/lumina_mrkt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-2 transition-colors"
                >
                  @lumina_mrkt
                </a>
              </span>
              <button
                onClick={() => setDismissed(true)}
                className="absolute right-3 sm:right-4 text-amber-400/50 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
