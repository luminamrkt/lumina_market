"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Coins,
  TrendingUp,
  Trophy,
  Crown,
  Gem,
  Shield,
} from "lucide-react"

const categories = [
  {
    icon: Coins,
    name: "Akun Murah",
    desc: "Akun starter dengan harga terjangkau, cocok untuk pemula.",
    price: "Mulai Rp 50K",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: TrendingUp,
    name: "Akun Menengah",
    desc: "Rank Epic sampai Legend dengan koleksi skin menarik.",
    price: "Mulai Rp 150K",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Trophy,
    name: "Akun Rank Tinggi",
    desc: "Mythic, Mythical Glory, sampai Immortal rank tinggi.",
    price: "Mulai Rp 400K",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Crown,
    name: "Akun Sultan",
    desc: "Koleksi skin limited & legend lengkap, status elite.",
    price: "Mulai Rp 1Jt",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: Gem,
    name: "Akun Kolektor",
    desc: "Skin collector edisi terbatas & event spesial.",
    price: "Mulai Rp 800K",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Shield,
    name: "Akun Full Skin",
    desc: "Punya hampir semua skin di game. Pilihan ultimate.",
    price: "Mulai Rp 3Jt",
    color: "from-red-500 to-amber-600",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Categories() {
  return (
    <section id="categories" className="py-24 relative">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Kategori <span className="gradient-text">Akun</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Berbagai pilihan akun Mobile Legends sesuai kebutuhan dan budgetmu
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.name}
                variants={cardVariants}
                className="group glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 cursor-default"
              >
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{cat.name}</h3>
                <p className="text-sm text-white/50 mb-4 leading-relaxed">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold gradient-text">{cat.price}</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Lihat Detail
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
