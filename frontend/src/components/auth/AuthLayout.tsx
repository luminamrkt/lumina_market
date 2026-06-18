"use client"

import { motion } from "framer-motion"
import { Gamepad2, Crown, Swords, Star, Shield, Zap, Users } from "lucide-react"
import AuthAnnouncement from "@/components/auth/AuthAnnouncement"

const floatingCards = [
  {
    title: "Sultan 800+ Skin",
    price: "Rp 3.800.000",
    badge: "Sultan",
    delay: 0,
    x: "5%",
    y: "10%",
    gradient: "from-yellow-500 to-red-600",
    icon: Crown,
  },
  {
    title: "Mythic Glory",
    price: "Rp 850.000",
    badge: "Hot",
    delay: 0.5,
    x: "55%",
    y: "5%",
    gradient: "from-blue-500 to-purple-600",
    icon: Swords,
  },
  {
    title: "Collector Edition",
    price: "Rp 2.500.000",
    badge: "Langka",
    delay: 1,
    x: "65%",
    y: "55%",
    gradient: "from-amber-500 to-orange-700",
    icon: Star,
  },
]

const trustItems = [
  { icon: Shield, label: "Aman & Terpercaya" },
  { icon: Zap, label: "Proses Cepat" },
  { icon: Users, label: "10.000+ Pelanggan" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Branding Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-background via-blue-950/30 to-purple-950/30 p-10 xl:p-14 flex-col">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: "4s" }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 mb-auto"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Lumina Market</span>
        </motion.div>

        {/* Headline & Floating Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col justify-center max-w-lg"
        >
          <motion.h1 variants={itemVariants} className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-white">
            Discover Your <br />
            <span className="gradient-text">Next Favorite</span> Game
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 text-base text-white/50 leading-relaxed max-w-md">
            Platform jual beli akun Mobile Legends terpercaya. Ribuan akun premium siap dimainkan dengan proses cepat dan aman.
          </motion.p>

          {/* Floating Cards */}
          <motion.div variants={itemVariants} className="relative h-[240px] mt-8 w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full gradient-bg blur-3xl opacity-15 animate-pulse-slow" />
            </div>
            {floatingCards.map((card) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  className="absolute bg-[rgba(10,10,15,0.8)] backdrop-blur-xl rounded-2xl p-3.5 shadow-xl border border-white/10"
                  style={{ left: card.x, top: card.y }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + card.delay, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{card.title}</p>
                      <p className="text-xs text-white/50">{card.price}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex items-center gap-6 pt-8 border-t border-white/5 mt-auto"
        >
          {trustItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-2 text-sm text-white/50">
                <Icon className="h-4 w-4 text-blue-400" />
                <span>{item.label}</span>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden min-h-screen lg:min-h-0">
        <AuthAnnouncement />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-strong rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-500/5 relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
