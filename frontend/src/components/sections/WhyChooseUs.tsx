"use client"

import { motion } from "framer-motion"
import { Shield, Wallet, Zap, MessageCircle, Layers, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Akun Aman",
    desc: "Semua akun telah diverifikasi dan dijamin keamanannya.",
  },
  {
    icon: Wallet,
    title: "Harga Terjangkau",
    desc: "Harga kompetitif dengan banyak pilihan sesuai budget.",
  },
  {
    icon: Zap,
    title: "Proses Cepat",
    desc: "Transaksi diproses dalam hitungan menit setelah pembayaran.",
  },
  {
    icon: MessageCircle,
    title: "Support Ramah",
    desc: "Tim support siap membantu 24/7 dengan respons cepat.",
  },
  {
    icon: Layers,
    title: "Banyak Pilihan",
    desc: "Ribuan akun tersedia dari berbagai rank dan koleksi skin.",
  },
  {
    icon: ShieldCheck,
    title: "Garansi Sesuai Ketentuan",
    desc: "Garansi akun sesuai dengan ketentuan yang telah disepakati.",
  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 relative">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Kenapa Pilih <span className="gradient-text">Kami?</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Kami berkomitmen memberikan pengalaman terbaik dalam menyediakan berbagai macam akun Mobile Legends
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group glass rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl gradient-bg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
