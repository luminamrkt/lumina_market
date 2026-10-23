import { readFileSync } from "node:fs"
import { adminDb, adminSql, runtimeSql } from "./client.js"
import { accounts, adminNotes, adminUsers, bookings, orders, soldoutItems } from "./schema.js"

interface SeedAccount {
  id: string
  title: string
  category: (typeof accounts.$inferInsert)["category"]
  rank: string
  highestRank: string
  totalSkins: number
  totalHeroes: number
  rareSkins: number
  emblems: number
  server: string
  price: number
  originalPrice?: number
  status: (typeof accounts.$inferInsert)["status"]
  featured: boolean
  isVerified: boolean
  description: string
  images: string[]
  videoPreview?: string
  skinCollection: { name: string; rarity: string; image?: string }[]
  heroCollection: { name: string; role: string; image?: string }[]
  createdAt: string
  views: number
}

const staticAccounts = JSON.parse(
  readFileSync(new URL("./accounts.seed.json", import.meta.url), "utf8")
) as SeedAccount[]

async function seedAccounts() {
  for (const account of staticAccounts) {
    await adminDb
      .insert(accounts)
      .values({
        id: account.id,
        title: account.title,
        category: account.category,
        rank: account.rank,
        highestRank: account.highestRank,
        totalSkins: account.totalSkins,
        totalHeroes: account.totalHeroes,
        rareSkins: account.rareSkins,
        emblems: account.emblems,
        server: account.server,
        price: account.price,
        originalPrice: account.originalPrice ?? null,
        status: account.status,
        featured: account.featured,
        isVerified: account.isVerified,
        description: account.description,
        images: account.images,
        videoPreview: account.videoPreview ?? null,
        skinCollection: account.skinCollection,
        heroCollection: account.heroCollection,
        views: account.views,
        createdAt: new Date(account.createdAt),
      })
      .onConflictDoNothing({ target: accounts.id })
  }

  console.log(`Accounts ready: ${staticAccounts.length}`)
}

async function seedMonitoringData() {
  const now = new Date()
  const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000)

  await adminDb
    .insert(orders)
    .values([
      {
        invoiceId: "INV-DEMO-001",
        accountId: "ml-001",
        buyerName: "Rizky Pratama",
        buyerEmail: "rizky@example.com",
        buyerPhone: "081234567890",
        accountTitle: "Sultan Immortal 800+ Skins",
        amount: 3_800_000,
        paymentMethod: "Bank Transfer",
        paymentGateway: "BCA",
        transactionFee: 19_000,
        status: "completed",
        deliveryStatus: "completed",
        createdAt: daysAgo(3),
        paidAt: daysAgo(3),
        deliveredAt: daysAgo(2),
        completedAt: daysAgo(2),
      },
      {
        invoiceId: "INV-DEMO-002",
        accountId: "ml-002",
        buyerName: "Nadia Putri",
        buyerEmail: "nadia@example.com",
        buyerPhone: "081298765432",
        accountTitle: "Collector Edition 500+ Skins",
        amount: 2_500_000,
        paymentMethod: "E-Wallet",
        paymentGateway: "GoPay",
        transactionFee: 12_500,
        status: "processing",
        deliveryStatus: "preparing_account",
        createdAt: daysAgo(1),
        paidAt: daysAgo(1),
      },
      {
        invoiceId: "INV-DEMO-003",
        accountId: "ml-003",
        buyerName: "Bagas Saputra",
        buyerEmail: "bagas@example.com",
        buyerPhone: "081212345678",
        accountTitle: "Skin Rich Mythical Glory",
        amount: 1_200_000,
        paymentMethod: "QRIS",
        paymentGateway: "Midtrans",
        transactionFee: 6_000,
        status: "pending_payment",
        deliveryStatus: "awaiting_payment",
        createdAt: now,
      },
    ])
    .onConflictDoNothing({ target: orders.invoiceId })

  await adminDb
    .insert(bookings)
    .values([
      {
        invoiceId: "BKG-DEMO-001",
        accountId: "ml-004",
        accountTitle: "Mythic Honor 300+ Skins",
        buyerName: "Fajar Ramadhan",
        buyerContact: "081377788899",
        bookedAt: daysAgo(0),
        expiresAt: new Date(now.getTime() + 86_400_000),
        status: "active",
        amount: 850_000,
      },
      {
        invoiceId: "BKG-DEMO-002",
        accountId: "ml-005",
        accountTitle: "Epic Account 200+ Skins",
        buyerName: "Sinta Maharani",
        buyerContact: "081355566677",
        bookedAt: daysAgo(2),
        expiresAt: daysAgo(1),
        status: "expired",
        amount: 450_000,
      },
    ])
    .onConflictDoNothing({ target: bookings.invoiceId })

  await adminDb
    .insert(soldoutItems)
    .values([
      {
        invoiceId: "SOLD-DEMO-001",
        accountId: "ml-001",
        accountTitle: "Sultan Immortal 800+ Skins",
        buyerName: "Rizky Pratama",
        buyerEmail: "rizky@example.com",
        buyerPhone: "081234567890",
        soldAt: daysAgo(2),
        amount: 3_800_000,
        deliveredVia: "email",
        deliveryStatus: "confirmed",
        deliveredAt: daysAgo(2),
      },
    ])
    .onConflictDoNothing({ target: soldoutItems.invoiceId })

  console.log("Sample monitoring data ready")
}

async function seedNotes() {
  const [admin] = await adminDb.select({ id: adminUsers.id }).from(adminUsers).limit(1)

  if (!admin) {
    console.log("No admin linked yet, skipping notes")
    return
  }

  await adminDb
    .insert(adminNotes)
    .values([
      {
        adminId: admin.id,
        visibility: "shared",
        title: "Checklist verifikasi akun",
        content:
          "Pastikan email, password, dan backup code akun sudah diuji sebelum akun dipublikasikan ke katalog.",
        pinned: true,
      },
      {
        adminId: admin.id,
        visibility: "private",
        title: "Catatan pribadi",
        content: "Contoh catatan private. Hanya admin pembuat yang dapat melihat catatan ini.",
        pinned: false,
      },
    ])
    .onConflictDoNothing()

  console.log("Admin notes ready")
}

async function main() {
  await seedAccounts()
  await seedMonitoringData()
  await seedNotes()
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await Promise.all([adminSql.end(), runtimeSql.end()])
  })
