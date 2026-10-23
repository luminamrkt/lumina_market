export type UserRole = "user" | "admin"
export type UserStatus = "active" | "banned"

export interface User {
  id: string
  fullName: string
  username: string
  email: string
  phone: string
  avatar: string
  role: UserRole
  status: UserStatus
  lastLogin: string
  memberSince: string
  emailVerified: boolean
  twoFactorEnabled: boolean
}

export interface Session {
  user: User
  token: string
  expiresAt: string
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded"

export type DeliveryStatus =
  | "awaiting_payment"
  | "payment_confirmed"
  | "preparing_account"
  | "credentials_ready"
  | "unlocked"
  | "completed"

export interface Order {
  id: string
  invoiceId: string
  accountId: string
  userId: string
  accountTitle: string
  accountImage: string
  amount: number
  currency: string
  paymentMethod: string
  paymentGateway?: string
  transactionFee: number
  status: OrderStatus
  deliveryStatus: DeliveryStatus
  createdAt: string
  updatedAt: string
  paidAt?: string
  deliveredAt?: string
  completedAt?: string
  cancelledAt?: string
  notes?: string
}

export interface AccountCredentials {
  gameId: string
  serverId: string
  loginEmail?: string
  loginPassword?: string
  emailMasked: string
  passwordMasked: string
  revealedAt?: string
  revealedCount: number
}

export interface CredentialAccessLog {
  id: string
  accountId: string
  userId: string
  action: "revealed" | "copied_email" | "copied_password" | "copied_game_id"
  timestamp: string
  ip?: string
}

export type TransactionStatus = "completed" | "pending" | "processing" | "cancelled"

export interface Transaction {
  invoiceId: string
  product: string
  accountId: string
  paymentMethod: string
  paymentGateway?: string
  amount: number
  transactionFee: number
  currency: string
  status: TransactionStatus
  orderStatus: OrderStatus
  date: string
}

export type NotificationType = "order" | "payment" | "security" | "promotion"

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  date: string
  read: boolean
  actionUrl?: string
}

export type TicketStatus = "open" | "waiting" | "resolved" | "closed"

export interface SupportTicket {
  id: string
  subject: string
  status: TicketStatus
  category: string
  date: string
  lastUpdate: string
}

export interface DashboardStats {
  totalPurchases: number
  totalSpent: number
  activeOrders: number
  wishlistCount: number
  pendingDelivery: number
}

export interface RevenueAnalytics {
  totalRevenue: number
  monthlyRevenue: number
  weeklyRevenue: number
  totalOrders: number
  pendingOrders: number
  totalUsers: number
  totalAccounts: number
  revenueByMonth: { month: string; revenue: number; orders: number }[]
}

export interface PurchasedAccount {
  id: string
  orderId: string
  invoiceId: string
  coverImage: string
  title: string
  rank: string
  heroCount: number
  skinCount: number
  level: number
  server: string
  price: number
  purchaseDate: string
  status: string
  deliveryStatus: DeliveryStatus
  credentials?: AccountCredentials
}

export interface LoginActivityItem {
  id: string
  device: string
  browser: string
  location: string
  ip: string
  date: string
  status: "success" | "failed"
}

export interface WishlistItem {
  id: string
  accountId: string
  image: string
  title: string
  rank: string
  price: number
  originalPrice?: number
  heroCount: number
  skinCount: number
  availability: "available" | "sold" | "reserved"
}

export interface FAQItem {
  question: string
  answer: string
}

export interface AdminProfile {
  position: string
  bio: string
  phone: string
  avatar: string
}

export type BookingStatus = "active" | "paid" | "expired"

export interface Booking {
  id: string
  invoiceId: string
  accountTitle: string
  buyerName: string
  buyerContact: string
  bookedAt: string
  expiresAt: string
  status: BookingStatus
  amount: number
}

export type DeliveryMethod = "email" | "phone" | "both"

export type SoldoutDeliveryStatus = "sent" | "confirmed"

export interface SoldoutItem {
  id: string
  invoiceId: string
  accountTitle: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  soldAt: string
  amount: number
  deliveredVia: DeliveryMethod
  deliveryStatus: SoldoutDeliveryStatus
  deliveredAt?: string
}

export interface AdminNote {
  id: string
  adminId: string
  visibility: "shared" | "private"
  title: string
  content: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  pinned: boolean
}
