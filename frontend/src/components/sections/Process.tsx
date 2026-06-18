"use client"

import { motion } from "framer-motion"
import { Search, CreditCard, ShieldCheck, Send } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Pilih Akun",
    desc: "Cari dan pilih akun Mobile Legends yang sesuai keinginanmu.",
  },
  {
    icon: CreditCard,
    title: "Lakukan Pembayaran",
    desc: "Bayar melalui metode pembayaran yang tersedia dengan aman.",
  },
  {
    icon: ShieldCheck,
    title: "Verifikasi Pesanan",
    desc: "Tim kami akan memverifikasi pesanan dan menyiapkan akun.",
  },
  {
    icon: Send,
    title: "Akun Dikirim",
    desc: "Data akun dikirimkan ke email atau WhatsApp kamu.",
  },
]

export default function Process() {
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
            Cara <span className="gradient-text">Transaksi</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Proses mudah dan cepat, akun langsung dikirim setelah pembayaran
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative text-center group"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-blue-500/40 to-purple-500/40" />
                )}
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full gradient-bg mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-xs text-white/60 mb-3 -mt-2">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
