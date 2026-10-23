export interface AdminIdentity {
  id: string
  email: string
  displayName: string
  role: "owner" | "admin"
  status: "active" | "disabled"
  mfaRequired: boolean
  lastLoginAt: string | null
  createdAt: string
}

export interface AdminProfile {
  position: string
  bio: string
  phone: string
  avatar: string
}

export interface AdminMonitoringSnapshot {
  totalAdmins: number
  totalAccounts: number
  soldAccounts: number
  totalOrders: number
  pendingOrders: number
  totalBookings: number
  activeBookings: number
  totalSoldout: number
  totalRevenue: number
  monthlyRevenue: number
  weeklyRevenue: number
  revenueByMonth: { month: string; revenue: number; orders: number }[]
  recentOrders: {
    id: string
    invoiceId: string
    accountTitle: string
    buyer: string
    amount: number
    status: string
    date: string
  }[]
  updatedAt: string
}
