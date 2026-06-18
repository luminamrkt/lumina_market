"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Swords, Sparkles } from "lucide-react"

const accounts = [
  {
    title: "Mythic Immortal",
    rank: "Mythic Immortal",
    skins: 350,
    heroes: 120,
    price: "Rp 750.000",
    badge: "Hot",
    gradient: "from-blue-600 to-purple-700",
    icon: Swords,
  },
  {
    title: "500+ Skins",
    rank: "Mythic Glory",
    skins: 520,
    heroes: 115,
    price: "Rp 1.200.000",
    badge: "Premium",
    gradient: "from-purple-600 to-pink-700",
    icon: Sparkles,
  },
  {
    title: "Collector Edition",
    rank: "Legend",
    skins: 280,
    heroes: 100,
    price: "Rp 2.500.000",
    badge: "Langka",
    gradient: "from-amber-500 to-orange-700",
    icon: Star,
  },
  {
    title: "Sultan Account",
    rank: "Mythical Glory",
    skins: 800,
    heroes: 125,
    price: "Rp 3.800.000",
    badge: "Sultan",
    gradient: "from-yellow-500 to-red-700",
    icon: Shield,
  },
]

export default function PremiumAccounts() {
  return (
    <section className="py-24 relative">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Akun Premium <span className="gradient-text">Pilihan</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Koleksi akun premium terbaik dengan rank tinggi dan skin langka
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accounts.map((acc, i) => {
            const Icon = acc.icon
            return (
              <motion.div
                key={acc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className={`h-40 bg-gradient-to-br ${acc.gradient} relative flex items-center justify-center`}>
                  <Icon className="h-16 w-16 text-white/20 absolute" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={acc.badge === "Sultan" ? "premium" : "default"}>
                      {acc.badge}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-black/40 text-xs">
                      {acc.rank}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white mb-3">{acc.title}</h3>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-white/50">Skin: {acc.skins}</span>
                    <span className="text-white/50">Hero: {acc.heroes}</span>
                  </div>
                  <div className="text-lg font-bold gradient-text mb-4">{acc.price}</div>
                  <Button className="w-full group">
                    Beli Sekarang
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
