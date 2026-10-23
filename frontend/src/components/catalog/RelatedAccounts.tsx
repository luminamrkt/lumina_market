"use client"

import { motion } from "framer-motion"
import AccountCard from "./AccountCard"
import { type Account } from "@/data/accounts"

interface RelatedAccountsProps {
  currentId: string
  category: string
  price: number
  allAccounts: Account[]
}

export default function RelatedAccounts({ currentId, category, price, allAccounts }: RelatedAccountsProps) {
  const related = allAccounts
    .filter((a) => a.id !== currentId)
    .filter((a) => a.category === category || Math.abs(a.price - price) < 1000000)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold">
          Kamu Mungkin Juga Suka
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Akun lain dengan kategori atau harga serupa
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((acc, i) => (
          <AccountCard key={acc.id} account={acc} index={i} />
        ))}
      </div>
    </section>
  )
}
