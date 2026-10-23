"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Eye, Crown } from "lucide-react"
import { type Account, formatPrice, getCategoryLabel, getStatusBadgeClass, getStatusLabel } from "@/data/accounts"
import { cn } from "@/lib/utils"

interface AccountCardProps {
  account: Account
  index: number
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

export default function AccountCard({ account, index }: AccountCardProps) {
  const gradient = categoryGradients[account.category] || "from-blue-600 to-purple-700"
  const isSold = account.status === "sold"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={cn(
        "group glass rounded-2xl overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:shadow-blue-500/10",
        isSold ? "opacity-70" : "hover:scale-[1.02]"
      )}
    >
      <div className={cn("h-44 bg-gradient-to-br relative flex items-center justify-center", gradient)}>
        <Crown className="h-16 w-16 text-white/10 absolute" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant={account.category === "sultan" ? "premium" : "default"} className="text-[11px]">
            {getCategoryLabel(account.category)}
          </Badge>
          {account.isVerified && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[11px] flex items-center gap-1">
              <Check className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
        <div className={cn(
          "absolute top-3 right-3 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold",
          getStatusBadgeClass(account.status)
        )}>
          {getStatusLabel(account.status)}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/60 text-xs">
          <Eye className="h-3 w-3" />
          {account.views.toLocaleString()}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-white mb-2 leading-snug line-clamp-1">{account.title}</h3>

        <div className="flex items-center gap-1.5 text-sm text-purple-400 mb-3">
          <span>⭐</span>
          <span className="text-white/80">{account.rank}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
          <span>🎨 {account.totalSkins.toLocaleString()} Skins</span>
          <span>🦸 {account.totalHeroes} Heroes</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold gradient-text">{formatPrice(account.price)}</span>
            {account.originalPrice && (
              <span className="text-xs text-white/30 line-through ml-2">{formatPrice(account.originalPrice)}</span>
            )}
          </div>
        </div>

        <Link href={`/katalog/${account.id}`} className="block w-full">
          <Button
            className="w-full"
            variant={isSold ? "secondary" : "default"}
            disabled={isSold}
          >
            {isSold ? "Akun Terjual" : "Lihat Detail"}
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
