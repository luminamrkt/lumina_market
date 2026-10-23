"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { formatPrice } from "@/lib/format"
import {
  DELIVERY_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "@/lib/constants"
import {
  AdminApiError,
  fetchOrders,
  updateOrderStatus,
  type AdminOrder,
} from "@/lib/admin-service"

const statuses = [
  "all",
  "pending_payment",
  "paid",
  "processing",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
]

const editableStatuses = statuses.filter((status) => status !== "all")

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => setError("Gagal memuat data pesanan"))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdateStatus = useCallback(
    async (order: AdminOrder, status: string) => {
      setUpdatingId(order.id)
      try {
        const updated = await updateOrderStatus(order.id, status)
        setOrders((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        toast({
          title: "Status pesanan diperbarui",
          description: `${order.invoiceId} → ${ORDER_STATUS_LABELS[status] ?? status}`,
          type: "success",
        })
      } catch (error) {
        toast({
          title: "Gagal memperbarui status",
          description: error instanceof AdminApiError ? error.message : undefined,
          type: "error",
        })
      } finally {
        setUpdatingId(null)
      }
    },
    [toast]
  )

  const filtered = filter === "all" ? orders : orders.filter((order) => order.status === filter)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
        <Skeleton className="h-10 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Kelola Pesanan</h1>
        <p className="text-sm text-white/50">{orders.length} pesanan</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === status
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-white/5 text-white/50 hover:text-white border border-white/10"
            }`}
          >
            {status === "all" ? "Semua" : ORDER_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Akun</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Pembeli</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Jumlah</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Pengiriman</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Tanggal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-white/30">
                    {orders.length === 0 ? "Belum ada pesanan" : "Tidak ada pesanan ditemukan"}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isUpdating = updatingId === order.id
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-white/60">{order.invoiceId}</td>
                      <td className="px-4 py-3 text-white/80">{order.accountTitle}</td>
                      <td className="px-4 py-3">
                        <p className="text-white/60">{order.buyer}</p>
                        <p className="text-[10px] text-white/30">{order.buyerEmail}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-white">{formatPrice(order.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                          {ORDER_STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/50">
                        {DELIVERY_STATUS_LABELS[order.deliveryStatus] ?? order.deliveryStatus}
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs">{order.date}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {editableStatuses
                              .filter((status) => status !== order.status)
                              .map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => void handleUpdateStatus(order, status)}
                                >
                                  {ORDER_STATUS_LABELS[status] ?? status}
                                </DropdownMenuItem>
                              ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                void navigator.clipboard.writeText(order.invoiceId)
                                toast({ title: "Invoice disalin", type: "success" })
                              }}
                            >
                              Salin Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
