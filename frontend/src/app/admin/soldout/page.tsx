"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle, Send, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/format"
import { fetchSoldoutItems } from "@/lib/admin-service"
import type { SoldoutItem } from "@/types"

const deliveryLabels: Record<string, string> = {
  email: "Email",
  phone: "No. HP",
  both: "Email & No. HP",
}

const deliveryBadge: Record<string, { label: string; class: string }> = {
  sent: { label: "Terkirim", class: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  confirmed: { label: "Dikonfirmasi", class: "text-green-400 bg-green-400/10 border-green-400/20" },
}

export default function AdminSoldoutPage() {
  const [items, setItems] = useState<SoldoutItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchSoldoutItems().then(setItems).finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(
    (item) =>
      item.accountTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      item.invoiceId.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-80 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Soldout</h1>
        <p className="text-sm text-white/50">Daftar akun yang berhasil terjual dan dikirim</p>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          placeholder="Cari akun, pembeli, atau invoice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 rounded-2xl border border-white/10 bg-white/[0.03] pl-9 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Akun</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Pembeli</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Harga</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Tanggal</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Dikirim Via</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Status Kirim</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-white/30">
                    {items.length === 0 ? "Belum ada data soldout" : "Tidak ada data ditemukan"}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-white/60">{item.invoiceId}</td>
                    <td className="px-4 py-3 text-white/80 font-medium">{item.accountTitle}</td>
                    <td className="px-4 py-3">
                      <p className="text-white/80">{item.buyerName}</p>
                      <p className="text-[10px] text-white/30">{item.buyerEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{formatPrice(item.amount)}</td>
                    <td className="px-4 py-3 text-white/60 text-xs">{item.soldAt}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{deliveryLabels[item.deliveredVia]}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${deliveryBadge[item.deliveryStatus]?.class}`}>
                        {item.deliveryStatus === "confirmed" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Send className="h-3 w-3" />
                        )}
                        {deliveryBadge[item.deliveryStatus]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Kirim Ulang Kredensial</DropdownMenuItem>
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
