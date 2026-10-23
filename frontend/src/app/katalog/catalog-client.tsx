"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Gamepad2 } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import AccountCard from "@/components/catalog/AccountCard"
import FeaturedAccount from "@/components/catalog/FeaturedAccount"
import QuickFilters from "@/components/catalog/QuickFilters"
import CatalogFilters from "@/components/catalog/CatalogFilters"
import LoadMore from "@/components/catalog/LoadMore"
import { type Account } from "@/data/accounts"

const ITEMS_PER_PAGE = 8

export default function CatalogClient({ accounts }: { accounts: Account[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [quickFilter, setQuickFilter] = useState("")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [loading, setLoading] = useState(false)

  const featuredAccount = useMemo(
    () => accounts.find((a) => a.featured && a.status === "available"),
    [accounts]
  )

  const filtered = useMemo(() => {
    let result = [...accounts]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.rank.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    }

    if (quickFilter) {
      if (quickFilter === "under-500k") {
        result = result.filter((a) => a.price < 500000)
      } else if (quickFilter === "newest") {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (quickFilter !== "all") {
        result = result.filter((a) => a.category === quickFilter)
      }
    }

    if (category !== "all") {
      result = result.filter((a) => a.category === category)
    }

    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-100k":
          result = result.filter((a) => a.price < 100000)
          break
        case "100k-500k":
          result = result.filter((a) => a.price >= 100000 && a.price <= 500000)
          break
        case "500k-1m":
          result = result.filter((a) => a.price > 500000 && a.price <= 1000000)
          break
        case "1m-5m":
          result = result.filter((a) => a.price > 1000000 && a.price <= 5000000)
          break
        case "above-5m":
          result = result.filter((a) => a.price > 5000000)
          break
      }
    }

    switch (sortBy) {
      case "lowest":
        result.sort((a, b) => a.price - b.price)
        break
      case "highest":
        result.sort((a, b) => b.price - a.price)
        break
      case "popular":
        result.sort((a, b) => b.views - a.views)
        break
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [accounts, search, category, priceRange, sortBy, quickFilter])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  function handleLoadMore() {
    setLoading(true)
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4)
      setLoading(false)
    }, 400)
  }

  return (
    <>
      <Navbar />
      <main className="relative overflow-x-clip min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Gamepad2 className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-white/60">Lumina Market</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Mobile Legends <span className="gradient-text">Accounts</span>
            </h1>
            <p className="mt-4 text-base text-white/50 max-w-xl mx-auto">
              Jelajahi dan dapatkan akun premium dengan proses aman dan cepat. Semua akun sudah melalui verifikasi admin.
            </p>
          </motion.div>

          <div className="mb-8">
            <CatalogFilters
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>

          <div className="mb-10">
            <QuickFilters active={quickFilter} onChange={(v) => setQuickFilter(quickFilter === v ? "" : v)} />
          </div>

          {featuredAccount && (
            <div className="mb-12">
              <FeaturedAccount account={featuredAccount} />
            </div>
          )}

          {visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Akun Ditemukan</h3>
              <p className="text-sm text-white/50 max-w-md mx-auto">
                Coba ubah filter atau kata kunci pencarian untuk menemukan akun yang sesuai.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-white/40">
                  Menampilkan {visible.length} dari {filtered.length} akun
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visible.map((account, i) => (
                  <AccountCard key={account.id} account={account} index={i} />
                ))}
              </div>
              <LoadMore
                onClick={handleLoadMore}
                visible={visible.length}
                total={filtered.length}
                loading={loading}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
