export type AccountCategory =
  | "sultan"
  | "collector"
  | "skin-rich"
  | "mythic-glory"
  | "rare-limited"
  | "top-global-ready"
  | "tournament-ready"
  | "starlight-collection"
  | "budget-friendly"

export type AccountStatus = "available" | "sold" | "reserved"

export interface SkinItem {
  name: string
  rarity: string
  image?: string
}

export interface HeroItem {
  name: string
  role: string
  image?: string
}

export interface Account {
  id: string
  title: string
  category: AccountCategory
  rank: string
  highestRank: string
  totalSkins: number
  totalHeroes: number
  rareSkins: number
  emblems: number
  server: string
  price: number
  originalPrice?: number
  status: AccountStatus
  featured: boolean
  isVerified: boolean
  description: string
  images: string[]
  videoPreview?: string
  skinCollection: SkinItem[]
  heroCollection: HeroItem[]
  createdAt: string
  views: number
}

export const categories: { value: AccountCategory | "all"; label: string; icon: string }[] = [
  { value: "all", label: "Semua Akun", icon: "📋" },
  { value: "sultan", label: "Sultan", icon: "👑" },
  { value: "collector", label: "Collector", icon: "💎" },
  { value: "skin-rich", label: "Skin Rich", icon: "🎨" },
  { value: "mythic-glory", label: "Mythic Glory", icon: "🏆" },
  { value: "rare-limited", label: "Rare Limited", icon: "⭐" },
  { value: "top-global-ready", label: "Top Global", icon: "🌍" },
  { value: "tournament-ready", label: "Tournament", icon: "⚔️" },
  { value: "starlight-collection", label: "Starlight", icon: "✨" },
  { value: "budget-friendly", label: "Budget", icon: "💰" },
]

export const priceRanges = [
  { value: "all", label: "Semua Harga" },
  { value: "under-100k", label: "Under Rp100.000" },
  { value: "100k-500k", label: "Rp100.000 - Rp500.000" },
  { value: "500k-1m", label: "Rp500.000 - Rp1.000.000" },
  { value: "1m-5m", label: "Rp1.000.000 - Rp5.000.000" },
  { value: "above-5m", label: "Above Rp5.000.000" },
]

export const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "lowest", label: "Termurah" },
  { value: "highest", label: "Termahal" },
  { value: "popular", label: "Terpopuler" },
]

export const quickFilters = [
  { value: "sultan", label: "Sultan", icon: "👑" },
  { value: "collector", label: "Collector", icon: "💎" },
  { value: "mythic-glory", label: "Mythic Glory", icon: "🏆" },
  { value: "under-500k", label: "Dibawah 500K", icon: "💰" },
  { value: "newest", label: "Baru Ditambahkan", icon: "⚡" },
]

export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`
}

export function getCategoryIcon(category: AccountCategory): string {
  const found = categories.find((c) => c.value === category)
  return found?.icon ?? "📋"
}

export function getCategoryLabel(category: AccountCategory): string {
  const found = categories.find((c) => c.value === category)
  return found?.label ?? category
}

export function getStatusLabel(status: AccountStatus): string {
  const labels: Record<AccountStatus, string> = {
    available: "Available",
    sold: "Sold",
    reserved: "Reserved",
  }
  return labels[status]
}

export function getStatusColor(status: AccountStatus): string {
  const colors: Record<AccountStatus, string> = {
    available: "text-green-400",
    sold: "text-red-400",
    reserved: "text-yellow-400",
  }
  return colors[status]
}

export function getStatusBadgeClass(status: AccountStatus): string {
  const classes: Record<AccountStatus, string> = {
    available: "bg-green-500/20 text-green-400 border-green-500/30",
    sold: "bg-red-500/20 text-red-400 border-red-500/30",
    reserved: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  }
  return classes[status]
}
