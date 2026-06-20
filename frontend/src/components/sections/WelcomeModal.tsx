"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

// ============================================
// Ganti URL di bawah ini dengan link gambar
// yang ingin ditampilkan di modal pengumuman.
// ============================================
const IMAGE_URL = "https://res.cloudinary.com/dnre7nel7/image/upload/v1781764407/pengumuman_k0w2oy.jpg"

export default function WelcomeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const seen = localStorage.getItem("welcome_modal_seen")
      if (seen !== "true") {
        setOpen(true)
      }
    } catch {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    try {
      localStorage.setItem("welcome_modal_seen", "true")
    } catch {}
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl glass rounded-3xl overflow-hidden shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
              {IMAGE_URL ? (
                <Image
                  src={IMAGE_URL}
                  alt="Pengumuman"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 672px) 100vw, 672px"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Bell className="h-16 w-16 text-white/30" />
                </div>
              )}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-3">
                Pengumuman
              </h2>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
                Selamat datang di Lumina Market. Platform ini merupakan tempat
                jual beli akun Mobile Legends yang aman, cepat, dan terpercaya.
                Simak informasi terbaru pada gambar di atas dan pantau terus
                perkembangan kami melalui media sosial resmi yang tertera.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  asChild
                  className="flex-1"
                >
                  <a
                    href="https://www.instagram.com/lumina_mrkt/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    @lumina_market
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
