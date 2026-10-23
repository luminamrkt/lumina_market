export const ROUTES = {
  HOME: "/",
  KATALOG: "/katalog",
  LOGIN: "/login",
  ADMIN: "/admin",
  ADMIN_ACCOUNTS: "/admin/accounts",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_SOLDOUT: "/admin/soldout",
  ADMIN_NOTES: "/admin/notes",
  ADMIN_USERS: "/admin/users",
  ADMIN_PROFILE: "/admin/profile",
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: "Menunggu Pembayaran",
  paid: "Dibayar",
  processing: "Diproses",
  delivered: "Terkirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  refunded: "Refund",
}

export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  awaiting_payment: "Menunggu Pembayaran",
  payment_confirmed: "Pembayaran Dikonfirmasi",
  preparing_account: "Menyiapkan Akun",
  credentials_ready: "Siap Diterima",
  unlocked: "Kredensial Terlihat",
  completed: "Selesai",
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending_payment: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  paid: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  processing: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  delivered: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  completed: "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  refunded: "text-orange-400 bg-orange-400/10 border-orange-400/20",
}

export const TRANSACTION_STATUS_COLORS: Record<string, string> = {
  completed: "text-green-400 bg-green-400/10 border-green-400/20",
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
}

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  completed: "Selesai",
  pending: "Tertunda",
  processing: "Diproses",
  cancelled: "Dibatalkan",
}

export const TICKET_STATUS_COLORS: Record<string, string> = {
  open: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  waiting: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  resolved: "text-green-400 bg-green-400/10 border-green-400/20",
  closed: "text-white/40 bg-white/5 border-white/10",
}

export const TICKET_STATUS_LABELS: Record<string, string> = {
  open: "Terbuka",
  waiting: "Menunggu",
  resolved: "Teratasi",
  closed: "Ditutup",
}
