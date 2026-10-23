import type { AdminNote, Booking, SoldoutItem } from "@/types"
import type { AdminIdentity, AdminProfile } from "@/types/admin"

export interface AdminOrder {
  id: string
  invoiceId: string
  accountId: string | null
  buyer: string
  buyerName: string
  buyerEmail: string
  accountTitle: string
  amount: number
  status: string
  deliveryStatus: string
  date: string
  createdAt: string
}

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

export interface AdminSkinItem {
  name: string
  rarity: string
  image?: string
}

export interface AdminHeroItem {
  name: string
  role: string
  image?: string
}

export interface AdminAccount {
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
  skinCollection: AdminSkinItem[]
  heroCollection: AdminHeroItem[]
  views: number
  createdAt: string
}

export interface AdminAccountInput {
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
  originalPrice?: number | null
  status: AccountStatus
  featured: boolean
  isVerified: boolean
  description: string
  images: string[]
  videoPreview?: string | null
  skinCollection?: AdminSkinItem[]
  heroCollection?: AdminHeroItem[]
}

export interface AdminUser {
  id: string
  fullName: string
  username: string
  email: string
  status: "active" | "disabled"
  role: "owner" | "admin"
  orders: number
  totalSpent: number
  joined: string
  lastLoginAt: string | null
  position: string | null
  mfaRequired: boolean
}

export class AdminApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "AdminApiError"
    this.status = status
  }
}

async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: { message?: string } }).error?.message ?? "Request failed")
        : "Request failed"
    throw new AdminApiError(response.status, message)
  }

  return payload as T
}

export async function fetchAdminMe() {
  return adminRequest<{ admin: AdminIdentity; profile: AdminProfile }>("me")
}

export async function fetchAdminStats() {
  return adminRequest<{
    totalUsers: number
    activeUsers: number
    totalAccounts: number
    soldAccounts: number
    pendingOrders: number
    totalRevenue: number
    monthlyRevenue: number
    growth: number
  }>("stats")
}

export async function fetchRevenueAnalytics() {
  return adminRequest<{
    totalRevenue: number
    monthlyRevenue: number
    weeklyRevenue: number
    totalOrders: number
    pendingOrders: number
    totalUsers: number
    totalAccounts: number
    revenueByMonth: { month: string; revenue: number; orders: number }[]
  }>("analytics")
}

export async function fetchRecentOrders(limit = 5) {
  const result = await adminRequest<{ data: AdminOrder[] }>(`orders/recent?limit=${limit}`)
  return result.data
}

export async function fetchOrders() {
  const result = await adminRequest<{ data: AdminOrder[] }>("orders")
  return result.data
}

export async function updateOrderStatus(
  id: string,
  status: string,
  deliveryStatus?: string
) {
  const result = await adminRequest<{ data: AdminOrder }>(
    `orders/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status, ...(deliveryStatus ? { deliveryStatus } : {}) }),
    }
  )
  return result.data
}

export async function fetchAccounts() {
  const result = await adminRequest<{ data: AdminAccount[] }>("accounts?limit=100")
  return result.data
}

export async function createAdminAccount(input: AdminAccountInput) {
  const result = await adminRequest<{ data: AdminAccount }>("accounts", {
    method: "POST",
    body: JSON.stringify(input),
  })
  return result.data
}

export async function updateAdminAccount(id: string, input: Partial<AdminAccountInput>) {
  const result = await adminRequest<{ data: AdminAccount }>(`accounts/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  })
  return result.data
}

export async function deleteAdminAccount(id: string) {
  await adminRequest(`accounts/${encodeURIComponent(id)}`, { method: "DELETE" })
}

export async function fetchBookings() {
  const result = await adminRequest<{ data: Booking[] }>("bookings")
  return result.data
}

export async function fetchSoldoutItems() {
  const result = await adminRequest<{ data: SoldoutItem[] }>("soldout")
  return result.data
}

export async function fetchAdminUsers() {
  const result = await adminRequest<{
    data: {
      id: string
      email: string
      displayName: string
      role: "owner" | "admin"
      status: "active" | "disabled"
      mfaRequired: boolean
      lastLoginAt: string | null
      createdAt: string
      position: string | null
    }[]
  }>("admins")

  return result.data.map<AdminUser>((admin) => ({
    id: admin.id,
    fullName: admin.displayName,
    username: admin.email.split("@")[0] ?? admin.email,
    email: admin.email,
    status: admin.status,
    role: admin.role,
    orders: 0,
    totalSpent: 0,
    joined: new Date(admin.createdAt).toLocaleDateString("id-ID"),
    lastLoginAt: admin.lastLoginAt,
    position: admin.position,
    mfaRequired: admin.mfaRequired,
  }))
}

export async function updateAdminUser(
  id: string,
  updates: {
    displayName?: string
    role?: "owner" | "admin"
    status?: "active" | "disabled"
  }
) {
  const result = await adminRequest<{
    data: {
      id: string
      email: string
      displayName: string
      role: "owner" | "admin"
      status: "active" | "disabled"
      mfaRequired: boolean
      lastLoginAt: string | null
      createdAt: string
      position: string | null
    }
  }>(`admins/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  })
  return result.data
}

export async function fetchAdminProfile() {
  const result = await adminRequest<{
    data: { position: string; bio: string; phone: string; avatar: string }
  }>("profile")
  return result.data
}

export async function updateAdminProfile(updates: {
  position?: string
  bio?: string
  phone?: string
  avatar?: string
}) {
  const result = await adminRequest<{
    data: { position: string; bio: string; phone: string; avatar: string }
  }>("profile", {
    method: "PATCH",
    body: JSON.stringify(updates),
  })
  return result.data
}

export async function fetchAdminNotes() {
  const result = await adminRequest<{ data: AdminNote[] }>("notes")
  return result.data
}

export async function createAdminNote(note: {
  title: string
  content: string
  createdBy?: string
  visibility?: "shared" | "private"
}) {
  const result = await adminRequest<{ data: AdminNote }>("notes", {
    method: "POST",
    body: JSON.stringify({
      title: note.title,
      content: note.content,
      visibility: note.visibility ?? "shared",
    }),
  })
  return result.data
}

export async function updateAdminNote(
  id: string,
  updates: { title: string; content: string; visibility?: "shared" | "private" }
) {
  const result = await adminRequest<{ data: AdminNote }>(`notes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  })
  return result.data
}

export async function deleteAdminNote(id: string) {
  await adminRequest(`notes/${encodeURIComponent(id)}`, { method: "DELETE" })
}

export async function togglePinAdminNote(id: string, pinned: boolean) {
  const result = await adminRequest<{ data: AdminNote }>(
    `notes/${encodeURIComponent(id)}/pin`,
    {
      method: "PATCH",
      body: JSON.stringify({ pinned: !pinned }),
    }
  )
  return result.data
}
