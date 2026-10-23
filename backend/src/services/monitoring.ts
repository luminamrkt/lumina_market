import { EventEmitter } from "node:events"
import { count, desc, eq, inArray, sql } from "drizzle-orm"
import { db, runtimeSql } from "../db/client.js"
import { accounts, adminUsers, bookings, orders, soldoutItems } from "../db/schema.js"
import { serializeOrder } from "../lib/serialize.js"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
const REVENUE_STATUSES = ["completed", "delivered", "paid"] as const
const events = new EventEmitter()
events.setMaxListeners(100)

let cachedSnapshot: Awaited<ReturnType<typeof buildSnapshot>> | null = null
let cachedAt = 0
let debounceTimer: NodeJS.Timeout | null = null
let unlisten: (() => Promise<void>) | null = null

async function buildSnapshot() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    activeAdminsResult,
    totalAccountsResult,
    soldAccountsResult,
    totalOrdersResult,
    pendingOrdersResult,
    totalBookingsResult,
    activeBookingsResult,
    soldoutResult,
    revenueRows,
    recentOrders,
  ] = await Promise.all([
    db.select({ value: count() }).from(adminUsers).where(eq(adminUsers.status, "active")),
    db.select({ value: count() }).from(accounts),
    db.select({ value: count() }).from(accounts).where(eq(accounts.status, "sold")),
    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(orders).where(eq(orders.status, "pending_payment")),
    db.select({ value: count() }).from(bookings),
    db.select({ value: count() }).from(bookings).where(eq(bookings.status, "active")),
    db.select({ value: count() }).from(soldoutItems),
    db
      .select({ amount: orders.amount, createdAt: orders.createdAt })
      .from(orders)
      .where(inArray(orders.status, [...REVENUE_STATUSES])),
    db
      .select({
        id: orders.id,
        invoiceId: orders.invoiceId,
        accountId: orders.accountId,
        buyerName: orders.buyerName,
        buyerEmail: orders.buyerEmail,
        buyerPhone: orders.buyerPhone,
        accountTitle: orders.accountTitle,
        accountImage: orders.accountImage,
        amount: orders.amount,
        currency: orders.currency,
        paymentMethod: orders.paymentMethod,
        paymentGateway: orders.paymentGateway,
        transactionFee: orders.transactionFee,
        status: orders.status,
        deliveryStatus: orders.deliveryStatus,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        paidAt: orders.paidAt,
        deliveredAt: orders.deliveredAt,
        completedAt: orders.completedAt,
        cancelledAt: orders.cancelledAt,
        notes: orders.notes,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(6),
  ])

  const totalRevenue = revenueRows.reduce((sum, row) => sum + Number(row.amount), 0)
  const monthlyRevenue = revenueRows
    .filter((row) => row.createdAt >= startOfMonth)
    .reduce((sum, row) => sum + Number(row.amount), 0)

  const revenueByMonth = MONTHS.map((month, index) => {
    const monthRows = revenueRows.filter(
      (row) =>
        row.createdAt.getFullYear() === now.getFullYear() && row.createdAt.getMonth() === index
    )
    return {
      month,
      revenue: monthRows.reduce((sum, row) => sum + Number(row.amount), 0),
      orders: monthRows.length,
    }
  })

  return {
    totalAdmins: Number(activeAdminsResult[0]?.value ?? 0),
    totalAccounts: Number(totalAccountsResult[0]?.value ?? 0),
    soldAccounts: Number(soldAccountsResult[0]?.value ?? 0),
    totalOrders: Number(totalOrdersResult[0]?.value ?? 0),
    pendingOrders: Number(pendingOrdersResult[0]?.value ?? 0),
    totalBookings: Number(totalBookingsResult[0]?.value ?? 0),
    activeBookings: Number(activeBookingsResult[0]?.value ?? 0),
    totalSoldout: Number(soldoutResult[0]?.value ?? 0),
    totalRevenue,
    monthlyRevenue,
    weeklyRevenue: revenueRows
      .filter((row) => row.createdAt >= new Date(now.getTime() - 7 * 86_400_000))
      .reduce((sum, row) => sum + Number(row.amount), 0),
    revenueByMonth,
    recentOrders: recentOrders.map(serializeOrder),
    updatedAt: now.toISOString(),
  }
}

export async function getMonitoringSnapshot() {
  const now = Date.now()
  if (cachedSnapshot && now - cachedAt < 500) {
    return cachedSnapshot
  }
  cachedSnapshot = await buildSnapshot()
  cachedAt = now
  return cachedSnapshot
}

async function broadcast() {
  cachedSnapshot = null
  const snapshot = await getMonitoringSnapshot()
  events.emit("snapshot", snapshot)
}

function scheduleBroadcast() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void broadcast().catch((error) => {
      console.error("Failed to broadcast monitoring snapshot", error)
    })
  }, 300)
}

export async function startMonitoringListener() {
  const listener = await runtimeSql.listen("monitoring_changed", () => scheduleBroadcast())
  unlisten = listener.unlisten
}

export async function stopMonitoringListener() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = null
  if (unlisten) {
    await unlisten()
    unlisten = null
  }
}

export function subscribeMonitoring(listener: (snapshot: Awaited<ReturnType<typeof buildSnapshot>>) => void) {
  events.on("snapshot", listener)
  return () => events.off("snapshot", listener)
}

export async function getRevenueSummary() {
  const [row] = await db
    .select({
      total: sql<string | null>`sum(${orders.amount})`,
      totalOrders: count(),
    })
    .from(orders)
    .where(inArray(orders.status, [...REVENUE_STATUSES]))

  return {
    totalRevenue: Number(row?.total ?? 0),
    totalOrders: Number(row?.totalOrders ?? 0),
  }
}
