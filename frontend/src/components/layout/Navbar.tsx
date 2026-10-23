"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Gamepad2 } from "lucide-react"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Katalog", href: "/katalog" },
  { label: "FAQ", href: "/#faq" },
  { label: "Kontak", href: "/#contact" },
]

export default function Navbar() {
  const { isScrolled } = useScrollPosition()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navElevated = isScrolled || mobileOpen

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false)
    }

    const desktopQuery = window.matchMedia("(min-width: 768px)")
    const handleDesktop = () => {
      if (desktopQuery.matches) setMobileOpen(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    desktopQuery.addEventListener("change", handleDesktop)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
      desktopQuery.removeEventListener("change", handleDesktop)
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          navElevated
            ? "bg-[rgba(10,10,15,0.85)] backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl shadow-black/30"
            : "bg-transparent py-5"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Lumina Market
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-white/70 hover:text-white transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-white p-2 cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-[60] h-dvh w-[280px] overflow-y-auto bg-[rgba(10,10,15,0.95)] backdrop-blur-2xl border-l border-white/10 p-6 shadow-2xl md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mt-12 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base text-white/80 hover:text-white hover:bg-white/5 transition-all rounded-lg px-4 py-3"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
