"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Crown,
  Check,
  Shield,
  Zap,
  MessageCircle,
  Copy,
  Share2,
  ShoppingCart,
  Gamepad2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import RelatedAccounts from "@/components/catalog/RelatedAccounts"
import {
  formatPrice,
  getCategoryLabel,
  getStatusBadgeClass,
  getStatusLabel,
  getStatusColor,
  type Account,
  type SkinItem,
  type HeroItem,
} from "@/data/accounts"
import { cn } from "@/lib/utils"

const rarityColors: Record<string, string> = {
  legend: "text-yellow-400 bg-yellow-500/10",
  collector: "text-purple-400 bg-purple-500/10",
  epic: "text-blue-400 bg-blue-500/10",
  starlight: "text-pink-400 bg-pink-500/10",
  elite: "text-green-400 bg-green-500/10",
  special: "text-cyan-400 bg-cyan-500/10",
  basic: "text-white/40 bg-white/5",
  all: "text-amber-400 bg-amber-500/10",
}

function subscribeNoop() {
  return () => {}
}

function getCanShareSnapshot() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function"
}

function getServerCanShareSnapshot() {
  return false
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

function SkinCard({ skin }: { skin: SkinItem }) {
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:bg-white/10">
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-lg", rarityColors[skin.rarity] || "bg-white/5")}>
        💠
      </div>
      <div>
        <p className="text-sm font-medium text-white">{skin.name}</p>
        <p className={cn("text-[11px] capitalize", rarityColors[skin.rarity]?.split(" ")[0] || "text-white/40")}>
          {skin.rarity}
        </p>
      </div>
    </div>
  )
}

function HeroCard({ hero }: { hero: HeroItem }) {
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:bg-white/10">
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-lg">
        🦸
      </div>
      <div>
        <p className="text-sm font-medium text-white">{hero.name}</p>
        <p className="text-[11px] text-white/40 capitalize">{hero.role}</p>
      </div>
    </div>
  )
}

export default function AccountDetail({
  account,
  relatedAccounts,
}: {
  account: Account
  relatedAccounts: Account[]
}) {
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)
  const canShare = useSyncExternalStore(
    subscribeNoop,
    getCanShareSnapshot,
    getServerCanShareSnapshot
  )

  const acc: Account = account
  const gradient = categoryGradients[acc.category] || "from-blue-600 to-purple-700"
  const isSold = acc.status === "sold"
  const isReserved = acc.status === "reserved"
  const galleryImages = acc.images.length > 0 ? acc.images : Array(4).fill(null)

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShare() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      void navigator.share({ title: acc.title, url: window.location.href }).catch(() => undefined)
    }
  }

  return (
    <>
      <Navbar />
      <main className="relative overflow-x-clip min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Katalog
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "aspect-[4/3] rounded-2xl bg-gradient-to-br flex items-center justify-center relative overflow-hidden",
                    gradient
                  )}
                >
                  <Crown className="h-32 w-32 text-white/10" />
                  {acc.videoPreview && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/40 text-xs flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Video
                      </Badge>
                    </div>
                  )}
                  <div className={cn(
                    "absolute top-3 right-3 px-2.5 py-0.5 rounded-full border text-xs font-semibold flex items-center gap-1.5",
                    getStatusBadgeClass(acc.status)
                  )}>
                    <span className={cn("h-2 w-2 rounded-full", getStatusColor(acc.status).replace("text-", "bg-"))} />
                    {getStatusLabel(acc.status)}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "shrink-0 w-20 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center transition-all duration-200 cursor-pointer",
                      gradient,
                      activeImage === i ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a0f]" : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <Crown className="h-6 w-6 text-white/20" />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={acc.category === "sultan" ? "premium" : "default"} className="text-xs">
                  {getCategoryLabel(acc.category)}
                </Badge>
                {acc.isVerified && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs flex items-center gap-1">
                    <Check className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {acc.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <span>⭐</span>
                  <span className="text-white/80">{acc.rank}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                  <ArrowLeft className="h-3.5 w-3.5 rotate-90" />
                  <span>Highest: <span className="text-white/70">{acc.highestRank}</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: "🎨", label: "Skins", value: acc.totalSkins.toLocaleString() },
                  { icon: "🦸", label: "Heroes", value: acc.totalHeroes.toString() },
                  { icon: "💎", label: "Rare Skins", value: acc.rareSkins.toString() },
                  { icon: "⚡", label: "Emblems", value: `${acc.emblems}%` },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-3 text-center">
                    <div className="text-lg mb-0.5">{stat.icon}</div>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-[11px] text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-white/50">
                <Gamepad2 className="h-4 w-4" />
                Server: <span className="text-white/80">{acc.server}</span>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold gradient-text">{formatPrice(acc.price)}</span>
                  {acc.originalPrice && (
                    <span className="text-lg text-white/30 line-through">{formatPrice(acc.originalPrice)}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 group"
                  disabled={isSold}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isSold ? "Akun Terjual" : isReserved ? "Akun Dipesan" : "Beli Sekarang"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  asChild
                >
                  <a
                    href="https://wa.me/6282326860797"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5 text-green-400" />
                    Hubungi Admin
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="text-xs"
                >
                  {copied ? (
                    <span className="flex items-center gap-1.5 text-green-400">
                      <Check className="h-3.5 w-3.5" /> Tersalin!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" /> Copy Link
                    </span>
                  )}
                </Button>
                {canShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </span>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-16 space-y-16">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Deskripsi Akun</h2>
              <div className="h-px bg-white/10 mb-6" />
              <p className="text-sm text-white/60 leading-relaxed max-w-3xl">
                {acc.description}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Skin Collection</h2>
                <span className="text-sm text-white/40">{acc.totalSkins.toLocaleString()} Skins</span>
              </div>
              <div className="h-px bg-white/10 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {acc.skinCollection.map((skin) => (
                  <SkinCard key={skin.name} skin={skin} />
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Hero Collection</h2>
                <span className="text-sm text-white/40">{acc.totalHeroes} Heroes</span>
              </div>
              <div className="h-px bg-white/10 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {acc.heroCollection.map((hero) => (
                  <HeroCard key={hero.name} hero={hero} />
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Informasi Transaksi</h2>
              <div className="h-px bg-white/10 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Shield,
                    title: "Proses Aman",
                    desc: "Transaksi menggunakan sistem yang terenkripsi dan aman.",
                  },
                  {
                    icon: Check,
                    title: "Verifikasi Admin",
                    desc: "Setiap akun diverifikasi manual oleh admin sebelum dijual.",
                  },
                  {
                    icon: ArrowLeft,
                    title: "Transfer Kepemilikan",
                    desc: "Proses transfer akun dilakukan dengan aman dan terjamin.",
                  },
                  {
                    icon: MessageCircle,
                    title: "Dukungan 24/7",
                    desc: "Tim support siap membantu kapanpun kamu butuh bantuan.",
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="glass rounded-xl p-5 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-bg mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                      <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </motion.section>

            <RelatedAccounts
              currentId={acc.id}
              category={acc.category}
              price={acc.price}
              allAccounts={relatedAccounts}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
