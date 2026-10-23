"use client"

import { Search, ChevronDown, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { categories, priceRanges, sortOptions } from "@/data/accounts"
import { useState } from "react"

interface CatalogFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  priceRange: string
  onPriceRangeChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
}

export default function CatalogFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
}: CatalogFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const filters = [
    {
      id: "category",
      label: categories.find((c) => c.value === category)?.label || "Kategori",
      options: categories,
    },
    {
      id: "price",
      label: priceRanges.find((p) => p.value === priceRange)?.label || "Harga",
      options: priceRanges,
    },
    {
      id: "sort",
      label: sortOptions.find((s) => s.value === sortBy)?.label || "Urutkan",
      options: sortOptions,
    },
  ]

  function handleSelect(id: string, value: string) {
    if (id === "category") onCategoryChange(value)
    else if (id === "price") onPriceRangeChange(value)
    else if (id === "sort") onSortByChange(value)
    setOpenDropdown(null)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <Input
          placeholder="Cari akun atau keyword..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-12"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-white/40 mr-1">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter
        </div>
        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === filter.id ? null : filter.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer whitespace-nowrap border",
                openDropdown === filter.id
                  ? "bg-white/10 backdrop-blur-xl text-white border-blue-500/50 shadow-lg shadow-blue-500/10"
                  : "bg-white/[0.08] backdrop-blur-xl text-white/70 hover:text-white hover:bg-white/[0.14] border-white/10 hover:border-white/20"
              )}
            >
              {filter.label}
              <ChevronDown className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                openDropdown === filter.id && "rotate-180"
              )} />
            </button>

            {openDropdown === filter.id && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                <div className="absolute top-full left-0 mt-1 z-50 w-56 bg-[#14141f] backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                  {filter.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(filter.id, opt.value)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer",
                        (
                          (filter.id === "category" && category === opt.value) ||
                          (filter.id === "price" && priceRange === opt.value) ||
                          (filter.id === "sort" && sortBy === opt.value)
                        )
                          ? "text-white bg-blue-500/25"
                          : "text-white/60 hover:text-white hover:bg-white/[0.08]"
                      )}
                    >
                      {"icon" in opt && typeof opt.icon === "string"
                        ? `${opt.icon} ${opt.label}`
                        : opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {(category !== "all" || priceRange !== "all" || sortBy !== "newest") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onCategoryChange("all")
              onPriceRangeChange("all")
              onSortByChange("newest")
            }}
            className="text-xs"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
