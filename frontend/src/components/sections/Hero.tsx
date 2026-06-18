"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Sparkles, Gamepad2, Swords, Crown, Star } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const floatingCards = [
  {
    title: "Sultan 800+ Skin",
    price: "Rp 3.800.000",
    badge: "Sultan",
    delay: 0.5,
    x: "10%",
    y: "20%",
    gradient: "from-yellow-500 to-red-600",
    icon: Crown,
  },
  {
    title: "Mythic Glory",
    price: "Rp 850K",
    badge: "Hot",
    delay: 0,
    x: "70%",
    y: "15%",
    gradient: "from-blue-500 to-purple-600",
    icon: Swords,
  },
  {
    title: "Collector Edition",
    price: "Rp 2.500.000",
    badge: "Langka",
    delay: 1,
    x: "80%",
    y: "55%",
    gradient: "from-amber-500 to-orange-700",
    icon: Star,
  },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-16"
    >

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-white/70">
                Platform Jual Beli Akun Mobile Legends Terpercaya
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight"
            >
              Temukan Akun{" "}
              <span className="gradient-text">Mobile Legends</span>{" "}
              Impianmu
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-base sm:text-lg text-white/60 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Dari akun murah hingga akun sultan dengan koleksi skin langka, semuanya tersedia dengan proses aman dan cepat.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="w-full sm:w-auto group">
                Beli Sekarang
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Lihat Katalog
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Aman & Terpercaya</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Gamepad2 className="h-4 w-4 text-blue-400" />
                <span>100% Siap Pakai</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative hidden lg:block h-[500px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full gradient-bg blur-3xl opacity-20 animate-pulse-slow" />
            </div>

            {floatingCards.map((card) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  className="absolute bg-[rgba(10,10,15,0.8)] backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/10"
                  style={{ left: card.x, top: card.y }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + card.delay, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{card.title}</p>
                      <p className="text-xs text-white/50">{card.price}</p>
                    </div>
                    <Badge
                      variant={
                        card.badge === "Sultan" || card.badge === "Langka"
                          ? "premium"
                          : "default"
                      }
                      className="ml-2"
                    >
                      {card.badge}
                    </Badge>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
