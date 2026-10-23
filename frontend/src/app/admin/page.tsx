"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, ShoppingCart, Users, Gamepad2 } from "lucide-react"
import StatCard from "@/components/admin/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/format"
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants"
import {
  fetchAdminStats,
  fetchRevenueAnalytics,
  fetchRecentOrders,
  type AdminOrder,
} from "@/lib/admin-service"
import { useAdminMonitoring } from "@/hooks/useAdminMonitoring"

type Stats = Awaited<ReturnType<typeof fetchAdminStats>>
type Analytics = Awaited<ReturnType<typeof fetchRevenueAnalytics>>
type OverviewOrder = Pick<
  AdminOrder,
  "id" | "invoiceId" | "accountTitle" | "buyer" | "amount" | "status" | "date"
>

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const { snapshot, connected } = useAdminMonitoring()

  useEffect(() => {
    Promise.all([
      fetchAdminStats(),
      fetchRevenueAnalytics(),
      fetchRecentOrders(),
    ]).then(([s, a, o]) => {
      setStats(s)
      setAnalytics(a)
      setOrders(o)
    }).finally(() => setLoading(false))
  }, [])

  const displayStats: Stats | null = snapshot
    ? {
        totalUsers: snapshot.totalAdmins,
        activeUsers: snapshot.totalAdmins,
        totalAccounts: snapshot.totalAccounts,
        soldAccounts: snapshot.soldAccounts,
        pendingOrders: snapshot.pendingOrders,
        totalRevenue: snapshot.totalRevenue,
        monthlyRevenue: snapshot.monthlyRevenue,
        growth: 0,
      }
    : stats

  const displayAnalytics: Analytics | null = snapshot
    ? {
        totalRevenue: snapshot.totalRevenue,
        monthlyRevenue: snapshot.monthlyRevenue,
        weeklyRevenue: snapshot.weeklyRevenue,
        totalOrders: snapshot.totalOrders,
        pendingOrders: snapshot.pendingOrders,
        totalUsers: snapshot.totalAdmins,
        totalAccounts: snapshot.totalAccounts,
        revenueByMonth: snapshot.revenueByMonth,
      }
    : analytics

  const displayOrders: OverviewOrder[] = snapshot ? snapshot.recentOrders : orders

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (!displayStats || !displayAnalytics) return null

  const statItems = [
    { icon: DollarSign, label: "Total Revenue", value: formatPrice(displayStats.totalRevenue), trend: displayStats.growth, trendLabel: "growth" as const, delay: 0.1 },
    { icon: ShoppingCart, label: "Total Pesanan", value: displayAnalytics.totalOrders.toString(), delay: 0.15 },
    { icon: Gamepad2, label: "Total Akun", value: displayStats.totalAccounts.toString(), delay: 0.2 },
    { icon: Users, label: "Admin Aktif", value: displayStats.activeUsers.toString(), delay: 0.25 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Admin Overview</h1>
          <p className="text-sm text-white/50">Pantau performa bisnis Lumina Market</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/50">
          <span
            className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-green-400" : "bg-white/20"}`}
          />
          {connected ? "Realtime" : "Menghubungkan"}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Bulanan</h3>
          <div className="flex items-end gap-3 h-48">
            {displayAnalytics.revenueByMonth.map((item, i) => {
              const maxRevenue = Math.max(...displayAnalytics.revenueByMonth.map((r) => r.revenue), 1)
              const height = (item.revenue / maxRevenue) * 100
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-white/30">{formatPrice(item.revenue).replace("Rp ", "")}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                    className="w-full rounded-lg bg-gradient-to-t from-blue-500 to-purple-600 max-w-[32px]"
                  />
                  <span className="text-[10px] text-white/40">{item.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Ringkasan</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Pesanan Bulan Ini</span>
              <span className="text-sm font-semibold text-white">{displayAnalytics.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Revenue Bulan Ini</span>
              <span className="text-sm font-semibold text-white">{formatPrice(displayAnalytics.monthlyRevenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Revenue Minggu Ini</span>
              <span className="text-sm font-semibold text-white">{formatPrice(displayAnalytics.weeklyRevenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Pesanan Tertunda</span>
              <span className="text-sm font-semibold text-yellow-400">{displayAnalytics.pendingOrders}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
      >
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Pesanan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Akun</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Pembeli</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Jumlah</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-white/30">
                    Belum ada pesanan
                  </td>
                </tr>
              ) : (
                displayOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-white/60">{order.invoiceId}</td>
                    <td className="px-4 py-3 text-white/80">{order.accountTitle}</td>
                    <td className="px-4 py-3 text-white/60">{order.buyer}</td>
                    <td className="px-4 py-3 font-medium text-white">{formatPrice(order.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">{order.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

