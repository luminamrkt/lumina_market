import { relations, sql } from "drizzle-orm"
import {
  bigint,
  boolean,
  index,
  inet,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

export const adminRoleEnum = pgEnum("admin_role", ["owner", "admin"])
export const adminStatusEnum = pgEnum("admin_status", ["active", "disabled"])
export const accountCategoryEnum = pgEnum("account_category", [
  "sultan",
  "collector",
  "skin-rich",
  "mythic-glory",
  "rare-limited",
  "top-global-ready",
  "tournament-ready",
  "starlight-collection",
  "budget-friendly",
])
export const accountStatusEnum = pgEnum("account_status", ["available", "sold", "reserved"])
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "processing",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
])
export const deliveryStatusEnum = pgEnum("delivery_status", [
  "awaiting_payment",
  "payment_confirmed",
  "preparing_account",
  "credentials_ready",
  "unlocked",
  "completed",
])
export const bookingStatusEnum = pgEnum("booking_status", ["active", "paid", "expired"])
export const deliveryMethodEnum = pgEnum("delivery_method", ["email", "phone", "both"])
export const soldoutDeliveryStatusEnum = pgEnum("soldout_delivery_status", ["sent", "confirmed"])
export const noteVisibilityEnum = pgEnum("note_visibility", ["shared", "private"])

export interface SkinItem {
  name: string
  rarity: string
  image?: string
}

export interface HeroItem {
  name: string
  role: string
  image?: string
}

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authUserId: uuid("auth_user_id").notNull(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    role: adminRoleEnum("role").notNull().default("owner"),
    status: adminStatusEnum("status").notNull().default("active"),
    mfaRequired: boolean("mfa_required").notNull().default(true),
    credentialsChangedAt: timestamp("credentials_changed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("admin_users_auth_user_id_key").on(table.authUserId),
    uniqueIndex("admin_users_email_key").on(table.email),
    index("admin_users_status_idx").on(table.status),
  ]
)

export const adminProfiles = pgTable("admin_profiles", {
  adminId: uuid("admin_id")
    .primaryKey()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  position: text("position").notNull().default(""),
  bio: text("bio").notNull().default(""),
  phone: text("phone").notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    title: text("title").notNull(),
    category: accountCategoryEnum("category").notNull(),
    rank: text("rank").notNull(),
    highestRank: text("highest_rank").notNull(),
    totalSkins: integer("total_skins").notNull().default(0),
    totalHeroes: integer("total_heroes").notNull().default(0),
    rareSkins: integer("rare_skins").notNull().default(0),
    emblems: integer("emblems").notNull().default(0),
    server: text("server").notNull(),
    price: bigint("price", { mode: "number" }).notNull(),
    originalPrice: bigint("original_price", { mode: "number" }),
    status: accountStatusEnum("status").notNull().default("available"),
    featured: boolean("featured").notNull().default(false),
    isVerified: boolean("is_verified").notNull().default(true),
    description: text("description").notNull().default(""),
    images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
    videoPreview: text("video_preview"),
    skinCollection: jsonb("skin_collection").$type<SkinItem[]>().notNull().default(sql`'[]'::jsonb`),
    heroCollection: jsonb("hero_collection").$type<HeroItem[]>().notNull().default(sql`'[]'::jsonb`),
    views: integer("views").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("accounts_status_category_idx").on(table.status, table.category),
    index("accounts_featured_idx").on(table.featured),
    index("accounts_price_idx").on(table.price),
    index("accounts_created_at_idx").on(table.createdAt),
  ]
)

export const accountCredentials = pgTable("account_credentials", {
  accountId: text("account_id")
    .primaryKey()
    .references(() => accounts.id, { onDelete: "cascade" }),
  gameId: text("game_id").notNull().default(""),
  serverId: text("server_id").notNull().default(""),
  loginEmail: text("login_email").notNull().default(""),
  loginPasswordEncrypted: text("login_password_encrypted").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: text("invoice_id").notNull(),
    accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
    buyerName: text("buyer_name").notNull(),
    buyerEmail: text("buyer_email").notNull().default(""),
    buyerPhone: text("buyer_phone").notNull().default(""),
    accountTitle: text("account_title").notNull(),
    accountImage: text("account_image").notNull().default(""),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: text("currency").notNull().default("IDR"),
    paymentMethod: text("payment_method").notNull().default(""),
    paymentGateway: text("payment_gateway"),
    transactionFee: bigint("transaction_fee", { mode: "number" }).notNull().default(0),
    status: orderStatusEnum("status").notNull().default("pending_payment"),
    deliveryStatus: deliveryStatusEnum("delivery_status").notNull().default("awaiting_payment"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    notes: text("notes"),
  },
  (table) => [
    uniqueIndex("orders_invoice_id_key").on(table.invoiceId),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_account_id_idx").on(table.accountId),
  ]
)

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: text("invoice_id").notNull(),
    accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
    accountTitle: text("account_title").notNull(),
    buyerName: text("buyer_name").notNull(),
    buyerContact: text("buyer_contact").notNull().default(""),
    bookedAt: timestamp("booked_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    status: bookingStatusEnum("status").notNull().default("active"),
    amount: bigint("amount", { mode: "number" }).notNull(),
  },
  (table) => [
    uniqueIndex("bookings_invoice_id_key").on(table.invoiceId),
    index("bookings_status_expires_idx").on(table.status, table.expiresAt),
  ]
)

export const soldoutItems = pgTable(
  "soldout_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: text("invoice_id").notNull(),
    accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
    accountTitle: text("account_title").notNull(),
    buyerName: text("buyer_name").notNull(),
    buyerEmail: text("buyer_email").notNull().default(""),
    buyerPhone: text("buyer_phone").notNull().default(""),
    soldAt: timestamp("sold_at", { withTimezone: true }).notNull().defaultNow(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    deliveredVia: deliveryMethodEnum("delivered_via").notNull().default("email"),
    deliveryStatus: soldoutDeliveryStatusEnum("delivery_status").notNull().default("sent"),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("soldout_items_invoice_id_key").on(table.invoiceId),
    index("soldout_items_sold_at_idx").on(table.soldAt),
  ]
)

export const adminNotes = pgTable(
  "admin_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    visibility: noteVisibilityEnum("visibility").notNull().default("shared"),
    title: text("title").notNull(),
    content: text("content").notNull(),
    pinned: boolean("pinned").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("admin_notes_visibility_admin_idx").on(table.visibility, table.adminId),
    index("admin_notes_pinned_created_idx").on(table.pinned, table.createdAt),
  ]
)

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id").references(() => adminUsers.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entity: text("entity").notNull().default(""),
    entityId: text("entity_id").notNull().default(""),
    ip: inet("ip"),
    userAgent: text("user_agent").notNull().default(""),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("admin_audit_logs_created_at_idx").on(table.createdAt),
    index("admin_audit_logs_admin_id_idx").on(table.adminId),
  ]
)

export const adminUsersRelations = relations(adminUsers, ({ one, many }) => ({
  profile: one(adminProfiles, {
    fields: [adminUsers.id],
    references: [adminProfiles.adminId],
  }),
  notes: many(adminNotes),
  auditLogs: many(adminAuditLogs),
}))
