"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Apakah akun yang dijual aman?",
    a: "Ya, semua akun yang kami jual telah diverifikasi keamanannya. Kami memastikan akun tidak memiliki masalah seperti banned, recovery, atau issue keamanan lainnya.",
  },
  {
    q: "Apakah bisa mengganti email akun?",
    a: "Bisa. Sebagian besar akun yang kami jual bisa diganti emailnya. Kami akan membantu proses penggantian email agar akun sepenuhnya menjadi milikmu.",
  },
  {
    q: "Berapa lama proses transaksi?",
    a: "Proses transaksi sangat cepat. Setelah pembayaran dikonfirmasi, akun akan dikirim dalam waktu 5-15 menit melalui WhatsApp atau email.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima berbagai metode pembayaran: Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, Dana, ShopeePay), dan QRIS.",
  },
  {
    q: "Apakah ada garansi setelah pembelian?",
    a: "Ya, kami memberikan garansi sesuai ketentuan yang berlaku. Jika ada masalah dengan akun dalam periode garansi, kami akan bantu menyelesaikannya.",
  },
  {
    q: "Bagaimana cara melihat akun sebelum beli?",
    a: "Kami menyediakan screenshot atau video preview akun yang bisa kamu lihat sebelum memutuskan untuk membeli.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 relative">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Pertanyaan <span className="gradient-text">Umum</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-white text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-white/50 shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{
                  gridTemplateRows: openIndex === i ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
