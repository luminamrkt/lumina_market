"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, ArrowRight, Check } from "lucide-react"
import { type Account, formatPrice, getCategoryLabel, getStatusBadgeClass, getStatusLabel } from "@/data/accounts"
import { cn } from "@/lib/utils"

interface FeaturedAccountProps {
  account: Account
}

const categoryGradients: Record<string, string> = {
  sultan: "from-yellow-600 to-red-700",
  collector: "from-purple-600 to-pink-700",
  "skin-rich": "from-blue-600 to-cyan-700",
  "mythic-glory": "from-violet-600 to-indigo-700",
  "rare-limited": "from-amber-600 to-orange-700",
  "top-global-ready": "from-emerald-600 to-teal-700",
  "tournament-ready": "from-red-600 to-rose-700",
  "starlight-collection": "from-pink-600 to-fuchsia-700",
  "budget-friendly": "from-green-600 to-emerald-700",
}

export default function FeaturedAccount({ account }: FeaturedAccountProps) {
  const gradient = categoryGradients[account.category] || "from-blue-600 to-purple-700"

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div className={cn("rounded-2xl bg-gradient-to-br p-[2px]", gradient)}>
        <div className="rounded-2xl bg-[#0a0a0f] p-6 sm:p-8">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-2 relative">
              <div className={cn("aspect-[4/3] rounded-xl bg-gradient-to-br flex items-center justify-center", gradient)}>
                <Crown className="h-24 w-24 text-white/15" />
              </div>
              <div className="absolute top-3 left-3">
                <Badge variant="premium" className="text-xs">🔥 Featured</Badge>
              </div>
              <div className={cn(
                "absolute top-3 right-3 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold",
                getStatusBadgeClass(account.status)
              )}>
                {getStatusLabel(account.status)}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <Badge variant="premium" className="text-xs">{getCategoryLabel(account.category)}</Badge>

              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {account.title}
              </h3>

              <div className="flex items-center gap-1.5 text-sm text-purple-400">
                <span>⭐</span>
                <span className="text-white/80">{account.rank}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/60">
                <span>🎨 {account.totalSkins.toLocaleString()} Skins</span>
                <span>🦸 {account.totalHeroes} Heroes</span>
                <span>💎 {account.rareSkins} Rare</span>
                {account.isVerified && (
                  <span className="text-blue-400 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold gradient-text">{formatPrice(account.price)}</span>
                {account.originalPrice && (
                  <span className="text-sm text-white/30 line-through">{formatPrice(account.originalPrice)}</span>
                )}
              </div>

              <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
                {account.description}
              </p>

              <Link href={`/katalog/${account.id}`}>
                <Button size="lg" className="group">
                  Lihat Detail
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
