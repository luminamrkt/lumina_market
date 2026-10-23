type AccountRow = {
  id: string
  title: string
  category: string
  rank: string
  highestRank: string
  totalSkins: number
  totalHeroes: number
  rareSkins: number
  emblems: number
  server: string
  price: number
  originalPrice: number | null
  status: string
  featured: boolean
  isVerified: boolean
  description: string
  images: string[]
  videoPreview: string | null
  skinCollection: { name: string; rarity: string; image?: string }[]
  heroCollection: { name: string; role: string; image?: string }[]
  createdAt: Date
  views: number
}

type OrderRow = {
  id: string
  invoiceId: string
  accountId: string | null
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  accountTitle: string
  accountImage: string
  amount: number
  currency: string
  paymentMethod: string
  paymentGateway: string | null
  transactionFee: number
  status: string
  deliveryStatus: string
  createdAt: Date
  updatedAt: Date
  paidAt: Date | null
  deliveredAt: Date | null
  completedAt: Date | null
  cancelledAt: Date | null
  notes: string | null
}

export function serializeAccount(row: AccountRow) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    rank: row.rank,
    highestRank: row.highestRank,
    totalSkins: row.totalSkins,
    totalHeroes: row.totalHeroes,
    rareSkins: row.rareSkins,
    emblems: row.emblems,
    server: row.server,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    status: row.status,
    featured: row.featured,
    isVerified: row.isVerified,
    description: row.description,
    images: row.images,
    videoPreview: row.videoPreview ?? undefined,
    skinCollection: row.skinCollection,
    heroCollection: row.heroCollection,
    createdAt: row.createdAt.toISOString(),
    views: row.views,
  }
}

export function serializeOrder(row: OrderRow) {
  return {
    id: row.id,
    invoiceId: row.invoiceId,
    accountId: row.accountId,
    buyer: row.buyerName,
    buyerName: row.buyerName,
    buyerEmail: row.buyerEmail,
    buyerPhone: row.buyerPhone,
    accountTitle: row.accountTitle,
    accountImage: row.accountImage,
    amount: row.amount,
    currency: row.currency,
    paymentMethod: row.paymentMethod,
    paymentGateway: row.paymentGateway,
    transactionFee: row.transactionFee,
    status: row.status,
    deliveryStatus: row.deliveryStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    paidAt: row.paidAt?.toISOString() ?? null,
    deliveredAt: row.deliveredAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    cancelledAt: row.cancelledAt?.toISOString() ?? null,
    notes: row.notes,
    date: row.createdAt.toLocaleDateString("id-ID"),
  }
}

export function serializeBooking(row: {
  id: string
  invoiceId: string
  accountId: string | null
  accountTitle: string
  buyerName: string
  buyerContact: string
  bookedAt: Date
  expiresAt: Date
  status: string
  amount: number
}) {
  return {
    ...row,
    bookedAt: row.bookedAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
  }
}

export function serializeSoldout(row: {
  id: string
  invoiceId: string
  accountId: string | null
  accountTitle: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  soldAt: Date
  amount: number
  deliveredVia: string
  deliveryStatus: string
  deliveredAt: Date | null
}) {
  return {
    ...row,
    soldAt: row.soldAt.toLocaleDateString("id-ID"),
    soldAtIso: row.soldAt.toISOString(),
    deliveredAt: row.deliveredAt?.toISOString() ?? null,
  }
}

export function serializeNote(row: {
  id: string
  adminId: string
  visibility: string
  title: string
  content: string
  pinned: boolean
  createdAt: Date
  updatedAt: Date
  createdBy?: string | null
}) {
  return {
    id: row.id,
    adminId: row.adminId,
    visibility: row.visibility,
    title: row.title,
    content: row.content,
    pinned: row.pinned,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    createdBy: row.createdBy ?? undefined,
  }
}
