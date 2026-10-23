import { and, count, desc, eq, ne, or, type SQL } from "drizzle-orm"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { db } from "../db/client.js"
import {
  accounts,
  adminAuditLogs,
  adminNotes,
  adminProfiles,
  adminUsers,
  bookings,
  orders,
  soldoutItems,
} from "../db/schema.js"
import { requireAdmin } from "../lib/auth.js"
import {
  serializeAccount,
  serializeBooking,
  serializeNote,
  serializeOrder,
  serializeSoldout,
} from "../lib/serialize.js"
import { getMonitoringSnapshot, subscribeMonitoring } from "../services/monitoring.js"
import { CATEGORIES, listAccounts, STATUSES } from "./accounts.js"

const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "processing",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
] as const

const DELIVERY_STATUSES = [
  "awaiting_payment",
  "payment_confirmed",
  "preparing_account",
  "credentials_ready",
  "unlocked",
  "completed",
] as const

const noteVisibilitySchema = z.enum(["shared", "private"])

const skinItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  rarity: z.string().trim().min(1).max(60),
  image: z.string().trim().max(2000).optional(),
})

const heroItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(60),
  image: z.string().trim().max(2000).optional(),
})

const accountCreateSchema = z.object({
  title: z.string().trim().min(3).max(180),
  category: z.enum(CATEGORIES),
  rank: z.string().trim().min(1).max(80),
  highestRank: z.string().trim().min(1).max(80),
  totalSkins: z.number().int().nonnegative().max(100_000).default(0),
  totalHeroes: z.number().int().nonnegative().max(10_000).default(0),
  rareSkins: z.number().int().nonnegative().max(100_000).default(0),
  emblems: z.number().int().min(0).max(100).default(0),
  server: z.string().trim().min(1).max(80),
  price: z.number().int().positive().max(1_000_000_000_000),
  originalPrice: z.number().int().nonnegative().max(1_000_000_000_000).nullable().optional(),
  status: z.enum(STATUSES).default("available"),
  featured: z.boolean().default(false),
  isVerified: z.boolean().default(true),
  description: z.string().trim().max(10_000).default(""),
  images: z.array(z.string().trim().min(1).max(2000)).max(20).default([]),
  videoPreview: z.string().trim().max(2000).nullable().optional(),
  skinCollection: z.array(skinItemSchema).max(500).default([]),
  heroCollection: z.array(heroItemSchema).max(500).default([]),
})

const accountUpdateSchema = accountCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: "No changes provided" })

const adminUpdateSchema = z
  .object({
    displayName: z.string().trim().min(1).max(120).optional(),
    role: z.enum(["owner", "admin"]).optional(),
    status: z.enum(["active", "disabled"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, { message: "No changes provided" })

async function audit(
  request: FastifyRequest,
  action: string,
  entity: string,
  entityId: string,
  metadata: Record<string, unknown> = {}
) {
  await db.insert(adminAuditLogs).values({
    adminId: request.admin?.id,
    action,
    entity,
    entityId,
    ip: request.ip,
    userAgent: request.headers["user-agent"] ?? "",
    metadata,
  })
}

function requireAdminContext(request: FastifyRequest, reply: FastifyReply) {
  if (!request.admin) {
    return reply.code(401).send({ error: { code: "unauthorized", message: "Authentication required" } })
  }
  return undefined
}

export default async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAdmin)

  app.get("/api/admin/me", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const admin = request.admin!

    const [profile] = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.adminId, admin.id))
      .limit(1)

    const now = new Date()
    const shouldTouchLogin =
      !admin.lastLoginAt || admin.lastLoginAt.getTime() < admin.authTime.getTime()

    if (shouldTouchLogin) {
      await db
        .update(adminUsers)
        .set({ lastLoginAt: now, updatedAt: now })
        .where(eq(adminUsers.id, admin.id))
    }

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
        status: "active",
        mfaRequired: true,
        lastLoginAt: (shouldTouchLogin ? now : admin.lastLoginAt)?.toISOString() ?? null,
        createdAt: admin.createdAt.toISOString(),
      },
      profile: profile
        ? {
            position: profile.position,
            bio: profile.bio,
            phone: profile.phone,
            avatar: profile.avatar,
          }
        : { position: "", bio: "", phone: "", avatar: "" },
    }
  })

  app.get("/api/admin/monitoring", async () => {
    return { data: await getMonitoringSnapshot() }
  })

  app.get("/api/admin/monitoring/stream", async (request, reply) => {
    reply.hijack()
    const raw = reply.raw
    raw.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    })

    const send = (snapshot: Awaited<ReturnType<typeof getMonitoringSnapshot>>) => {
      raw.write(`event: monitoring\ndata: ${JSON.stringify(snapshot)}\n\n`)
    }

    send(await getMonitoringSnapshot())
    const unsubscribe = subscribeMonitoring(send)
    const heartbeat = setInterval(() => raw.write(": heartbeat\n\n"), 15_000)

    request.raw.on("close", () => {
      clearInterval(heartbeat)
      unsubscribe()
    })
  })

  app.get("/api/admin/stats", async () => {
    const snapshot = await getMonitoringSnapshot()
    return {
      totalUsers: snapshot.totalAdmins,
      activeUsers: snapshot.totalAdmins,
      totalAccounts: snapshot.totalAccounts,
      soldAccounts: snapshot.soldAccounts,
      pendingOrders: snapshot.pendingOrders,
      totalRevenue: snapshot.totalRevenue,
      monthlyRevenue: snapshot.monthlyRevenue,
      growth: 0,
    }
  })

  app.get("/api/admin/analytics", async () => {
    const snapshot = await getMonitoringSnapshot()
    return {
      totalRevenue: snapshot.totalRevenue,
      monthlyRevenue: snapshot.monthlyRevenue,
      weeklyRevenue: snapshot.weeklyRevenue,
      totalOrders: snapshot.totalOrders,
      pendingOrders: snapshot.pendingOrders,
      totalUsers: snapshot.totalAdmins,
      totalAccounts: snapshot.totalAccounts,
      revenueByMonth: snapshot.revenueByMonth,
    }
  })

  app.get("/api/admin/orders/recent", async (request, reply) => {
    const parsed = z
      .object({ limit: z.coerce.number().int().min(1).max(20).default(5) })
      .safeParse(request.query)
    if (!parsed.success) {
      return reply.code(400).send({ error: { code: "invalid_query", message: "Invalid limit" } })
    }
    const snapshot = await getMonitoringSnapshot()
    return { data: snapshot.recentOrders.slice(0, parsed.data.limit) }
  })

  app.get("/api/admin/orders", async (request, reply) => {
    const parsed = z
      .object({
        status: z.enum(ORDER_STATUSES).optional(),
        limit: z.coerce.number().int().min(1).max(200).default(100),
      })
      .safeParse(request.query)
    if (!parsed.success) {
      return reply.code(400).send({ error: { code: "invalid_query", message: "Invalid query" } })
    }

    const where = parsed.data.status ? eq(orders.status, parsed.data.status) : undefined
    const rows = await db
      .select()
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(parsed.data.limit)

    return { data: rows.map(serializeOrder) }
  })

  app.patch("/api/admin/orders/:id/status", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const params = z.object({ id: z.string().uuid() }).safeParse(request.params)
    const body = z
      .object({
        status: z.enum(ORDER_STATUSES),
        deliveryStatus: z.enum(DELIVERY_STATUSES).optional(),
        notes: z.string().max(2000).optional(),
      })
      .safeParse(request.body)

    if (!params.success || !body.success) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid payload" } })
    }

    const now = new Date()
    const update: Record<string, unknown> = {
      status: body.data.status,
      updatedAt: now,
    }
    if (body.data.deliveryStatus) update.deliveryStatus = body.data.deliveryStatus
    if (body.data.notes !== undefined) update.notes = body.data.notes

    if (body.data.status === "paid") {
      update.paidAt = now
      update.deliveryStatus ??= "payment_confirmed"
    } else if (body.data.status === "processing") {
      update.deliveryStatus ??= "preparing_account"
    } else if (body.data.status === "delivered") {
      update.deliveredAt = now
      update.deliveryStatus ??= "completed"
    } else if (body.data.status === "completed") {
      update.completedAt = now
      update.deliveryStatus ??= "completed"
    } else if (body.data.status === "cancelled" || body.data.status === "refunded") {
      update.cancelledAt = now
    }

    const [row] = await db
      .update(orders)
      .set(update)
      .where(eq(orders.id, params.data.id))
      .returning()

    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "Order not found" } })
    }

    await audit(request, "order.status_updated", "orders", row.id, {
      status: row.status,
      deliveryStatus: row.deliveryStatus,
    })

    return { data: serializeOrder(row) }
  })

  app.get("/api/admin/accounts", async (request, reply) => {
    const parsed = z
      .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(50),
      })
      .safeParse(request.query)
    if (!parsed.success) {
      return reply.code(400).send({ error: { code: "invalid_query", message: "Invalid query" } })
    }
    return listAccounts({ ...parsed.data, sort: "newest" })
  })

  app.post("/api/admin/accounts", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const parsed = accountCreateSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: { code: "invalid_request", message: "Invalid account payload" } })
    }

    const [row] = await db
      .insert(accounts)
      .values({
        ...parsed.data,
        originalPrice: parsed.data.originalPrice ?? null,
        videoPreview: parsed.data.videoPreview ?? null,
      })
      .returning()

    if (!row) {
      return reply
        .code(500)
        .send({ error: { code: "internal_error", message: "Failed to create account" } })
    }

    await audit(request, "account.created", "accounts", row.id)
    return reply.code(201).send({ data: serializeAccount(row) })
  })

  app.patch("/api/admin/accounts/:id", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const params = z.object({ id: z.string().min(1).max(120) }).safeParse(request.params)
    const body = accountUpdateSchema.safeParse(request.body)
    if (!params.success || !body.success) {
      return reply
        .code(400)
        .send({ error: { code: "invalid_request", message: "Invalid account payload" } })
    }

    const [row] = await db
      .update(accounts)
      .set({ ...body.data, updatedAt: new Date() })
      .where(eq(accounts.id, params.data.id))
      .returning()

    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "Account not found" } })
    }

    await audit(request, "account.updated", "accounts", row.id)
    return { data: serializeAccount(row) }
  })

  app.delete("/api/admin/accounts/:id", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const params = z.object({ id: z.string().min(1).max(120) }).safeParse(request.params)
    if (!params.success) {
      return reply
        .code(400)
        .send({ error: { code: "invalid_request", message: "Invalid account id" } })
    }

    const [row] = await db
      .delete(accounts)
      .where(eq(accounts.id, params.data.id))
      .returning({ id: accounts.id })

    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "Account not found" } })
    }

    await audit(request, "account.deleted", "accounts", row.id)
    return { data: { id: row.id } }
  })

  app.get("/api/admin/admins", async () => {
    const rows = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        displayName: adminUsers.displayName,
        role: adminUsers.role,
        status: adminUsers.status,
        mfaRequired: adminUsers.mfaRequired,
        lastLoginAt: adminUsers.lastLoginAt,
        createdAt: adminUsers.createdAt,
        position: adminProfiles.position,
      })
      .from(adminUsers)
      .leftJoin(adminProfiles, eq(adminProfiles.adminId, adminUsers.id))
      .orderBy(adminUsers.createdAt)

    return {
      data: rows.map((row) => ({
        ...row,
        lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
      })),
    }
  })

  app.patch("/api/admin/admins/:id", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const actor = request.admin!
    if (actor.role !== "owner") {
      return reply
        .code(403)
        .send({ error: { code: "forbidden", message: "Only owners can manage admins" } })
    }

    const params = z.object({ id: z.string().uuid() }).safeParse(request.params)
    const body = adminUpdateSchema.safeParse(request.body)
    if (!params.success || !body.success) {
      return reply
        .code(400)
        .send({ error: { code: "invalid_request", message: "Invalid admin payload" } })
    }

    if (params.data.id === actor.id && (body.data.status === "disabled" || body.data.role === "admin")) {
      return reply
        .code(400)
        .send({ error: { code: "invalid_request", message: "You cannot disable or demote yourself" } })
    }

    const [target] = await db
      .select({
        id: adminUsers.id,
        role: adminUsers.role,
        status: adminUsers.status,
        position: adminProfiles.position,
      })
      .from(adminUsers)
      .leftJoin(adminProfiles, eq(adminProfiles.adminId, adminUsers.id))
      .where(eq(adminUsers.id, params.data.id))
      .limit(1)

    if (!target) {
      return reply.code(404).send({ error: { code: "not_found", message: "Admin not found" } })
    }

    if (target.role === "owner" && (body.data.role === "admin" || body.data.status === "disabled")) {
      const [otherOwners] = await db
        .select({ value: count() })
        .from(adminUsers)
        .where(
          and(
            eq(adminUsers.role, "owner"),
            eq(adminUsers.status, "active"),
            ne(adminUsers.id, target.id)
          )
        )

      if (Number(otherOwners?.value ?? 0) === 0) {
        return reply
          .code(400)
          .send({ error: { code: "invalid_request", message: "At least one active owner is required" } })
      }
    }

    const now = new Date()
    const update: Record<string, unknown> = { ...body.data, updatedAt: now }
    if (body.data.status === "disabled" || body.data.role) {
      update.credentialsChangedAt = now
    }

    const [row] = await db
      .update(adminUsers)
      .set(update)
      .where(eq(adminUsers.id, target.id))
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        displayName: adminUsers.displayName,
        role: adminUsers.role,
        status: adminUsers.status,
        mfaRequired: adminUsers.mfaRequired,
        lastLoginAt: adminUsers.lastLoginAt,
        createdAt: adminUsers.createdAt,
      })

    if (!row) {
      return reply.code(500).send({ error: { code: "internal_error", message: "Failed to update admin" } })
    }

    await audit(request, "admin.updated", "admin_users", row.id, body.data)

    return {
      data: {
        ...row,
        position: target.position,
        lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
      },
    }
  })

  app.get("/api/admin/bookings", async () => {
    const rows = await db.select().from(bookings).orderBy(desc(bookings.bookedAt))
    return { data: rows.map(serializeBooking) }
  })

  app.get("/api/admin/soldout", async () => {
    const rows = await db.select().from(soldoutItems).orderBy(desc(soldoutItems.soldAt))
    return { data: rows.map(serializeSoldout) }
  })

  app.get("/api/admin/profile", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const admin = request.admin!
    const [profile] = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.adminId, admin.id))
      .limit(1)
    return {
      data: profile
        ? {
            position: profile.position,
            bio: profile.bio,
            phone: profile.phone,
            avatar: profile.avatar,
          }
        : { position: "", bio: "", phone: "", avatar: "" },
    }
  })

  app.patch("/api/admin/profile", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const admin = request.admin!
    const parsed = z
      .object({
        position: z.string().max(120).optional(),
        bio: z.string().max(2000).optional(),
        phone: z.string().max(40).optional(),
        avatar: z.string().url().max(500).or(z.literal("")).optional(),
      })
      .safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid profile" } })
    }

    const [profile] = await db
      .insert(adminProfiles)
      .values({ adminId: admin.id, ...parsed.data })
      .onConflictDoUpdate({
        target: adminProfiles.adminId,
        set: { ...parsed.data, updatedAt: new Date() },
      })
      .returning()

    await audit(request, "profile.updated", "admin_profiles", admin.id)

    return {
      data: profile
        ? {
            position: profile.position,
            bio: profile.bio,
            phone: profile.phone,
            avatar: profile.avatar,
          }
        : { position: "", bio: "", phone: "", avatar: "" },
    }
  })

  app.get("/api/admin/notes", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const admin = request.admin!
    const where = or(
      eq(adminNotes.visibility, "shared"),
      and(eq(adminNotes.visibility, "private"), eq(adminNotes.adminId, admin.id))
    )

    const rows = await db
      .select({
        id: adminNotes.id,
        adminId: adminNotes.adminId,
        visibility: adminNotes.visibility,
        title: adminNotes.title,
        content: adminNotes.content,
        pinned: adminNotes.pinned,
        createdAt: adminNotes.createdAt,
        updatedAt: adminNotes.updatedAt,
        createdBy: adminUsers.displayName,
      })
      .from(adminNotes)
      .leftJoin(adminUsers, eq(adminUsers.id, adminNotes.adminId))
      .where(where)
      .orderBy(desc(adminNotes.pinned), desc(adminNotes.createdAt))

    return { data: rows.map(serializeNote) }
  })

  app.post("/api/admin/notes", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const admin = request.admin!
    const parsed = z
      .object({
        title: z.string().trim().min(1).max(200),
        content: z.string().trim().min(1).max(10_000),
        visibility: noteVisibilitySchema.default("shared"),
        pinned: z.boolean().default(false),
      })
      .safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid note" } })
    }

    const [row] = await db
      .insert(adminNotes)
      .values({
        adminId: admin.id,
        title: parsed.data.title,
        content: parsed.data.content,
        visibility: parsed.data.visibility,
        pinned: parsed.data.pinned,
      })
      .returning()

    if (!row) {
      return reply.code(500).send({ error: { code: "internal_error", message: "Failed to create note" } })
    }

    await audit(request, "note.created", "admin_notes", row.id, {
      visibility: row.visibility,
    })

    return reply.code(201).send({ data: serializeNote({ ...row, createdBy: admin.displayName }) })
  })

  app.patch("/api/admin/notes/:id", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const admin = request.admin!
    const params = z.object({ id: z.string().uuid() }).safeParse(request.params)
    const body = z
      .object({
        title: z.string().trim().min(1).max(200).optional(),
        content: z.string().trim().min(1).max(10_000).optional(),
        visibility: noteVisibilitySchema.optional(),
      })
      .safeParse(request.body)

    if (!params.success || !body.success) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid note" } })
    }

    const [row] = await db
      .update(adminNotes)
      .set({ ...body.data, updatedAt: new Date() })
      .where(and(eq(adminNotes.id, params.data.id), eq(adminNotes.adminId, admin.id)))
      .returning()

    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "Note not found" } })
    }

    await audit(request, "note.updated", "admin_notes", row.id)
    return { data: serializeNote({ ...row, createdBy: admin.displayName }) }
  })

  app.delete("/api/admin/notes/:id", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const admin = request.admin!
    const params = z.object({ id: z.string().uuid() }).safeParse(request.params)
    if (!params.success) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid note id" } })
    }

    const [row] = await db
      .delete(adminNotes)
      .where(and(eq(adminNotes.id, params.data.id), eq(adminNotes.adminId, admin.id)))
      .returning({ id: adminNotes.id })

    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "Note not found" } })
    }

    await audit(request, "note.deleted", "admin_notes", row.id)
    return { data: { id: row.id } }
  })

  app.patch("/api/admin/notes/:id/pin", async (request, reply) => {
    if (requireAdminContext(request, reply)) return
    const admin = request.admin!
    const params = z.object({ id: z.string().uuid() }).safeParse(request.params)
    const body = z.object({ pinned: z.boolean() }).safeParse(request.body)
    if (!params.success || !body.success) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid payload" } })
    }

    const [row] = await db
      .update(adminNotes)
      .set({ pinned: body.data.pinned, updatedAt: new Date() })
      .where(and(eq(adminNotes.id, params.data.id), eq(adminNotes.adminId, admin.id)))
      .returning()

    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "Note not found" } })
    }

    await audit(request, "note.pin_updated", "admin_notes", row.id, { pinned: row.pinned })
    return { data: serializeNote({ ...row, createdBy: admin.displayName }) }
  })

  app.get("/api/admin/audit-logs", async (request, reply) => {
    const parsed = z
      .object({ limit: z.coerce.number().int().min(1).max(200).default(100) })
      .safeParse(request.query)
    if (!parsed.success) {
      return reply.code(400).send({ error: { code: "invalid_query", message: "Invalid limit" } })
    }

    const rows = await db
      .select({
        id: adminAuditLogs.id,
        adminId: adminAuditLogs.adminId,
        adminName: adminUsers.displayName,
        action: adminAuditLogs.action,
        entity: adminAuditLogs.entity,
        entityId: adminAuditLogs.entityId,
        ip: adminAuditLogs.ip,
        userAgent: adminAuditLogs.userAgent,
        metadata: adminAuditLogs.metadata,
        createdAt: adminAuditLogs.createdAt,
      })
      .from(adminAuditLogs)
      .leftJoin(adminUsers, eq(adminUsers.id, adminAuditLogs.adminId))
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(parsed.data.limit)

    return {
      data: rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
    }
  })
}
