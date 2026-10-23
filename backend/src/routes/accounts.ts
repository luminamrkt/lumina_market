import { and, asc, count, desc, eq, gte, ilike, lte, or, sql, type SQL } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import { z } from "zod"
import { db } from "../db/client.js"
import { accounts } from "../db/schema.js"
import { serializeAccount } from "../lib/serialize.js"

export const CATEGORIES = [
  "sultan",
  "collector",
  "skin-rich",
  "mythic-glory",
  "rare-limited",
  "top-global-ready",
  "tournament-ready",
  "starlight-collection",
  "budget-friendly",
] as const

export const STATUSES = ["available", "sold", "reserved"] as const

const listQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(STATUSES).optional(),
  priceMin: z.coerce.number().int().nonnegative().optional(),
  priceMax: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(["newest", "lowest", "highest", "popular"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export async function listAccounts(input: z.infer<typeof listQuerySchema>) {
  const conditions: SQL[] = []

  if (input.search) {
    const term = `%${input.search}%`
    const searchCondition = or(
      ilike(accounts.title, term),
      ilike(accounts.rank, term),
      ilike(accounts.category, term)
    )
    if (searchCondition) conditions.push(searchCondition)
  }
  if (input.category) conditions.push(eq(accounts.category, input.category))
  if (input.status) conditions.push(eq(accounts.status, input.status))
  if (input.priceMin !== undefined) conditions.push(gte(accounts.price, input.priceMin))
  if (input.priceMax !== undefined) conditions.push(lte(accounts.price, input.priceMax))

  const where = conditions.length > 0 ? and(...conditions) : undefined
  const orderBy =
    input.sort === "lowest"
      ? asc(accounts.price)
      : input.sort === "highest"
        ? desc(accounts.price)
        : input.sort === "popular"
          ? desc(accounts.views)
          : desc(accounts.createdAt)

  const offset = (input.page - 1) * input.limit

  const [rows, totalResult] = await Promise.all([
    db.select().from(accounts).where(where).orderBy(orderBy).limit(input.limit).offset(offset),
    db.select({ value: count() }).from(accounts).where(where),
  ])

  const total = Number(totalResult[0]?.value ?? 0)

  return {
    data: rows.map(serializeAccount),
    meta: {
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.ceil(total / input.limit),
    },
  }
}

export default async function accountRoutes(app: FastifyInstance) {
  app.get("/api/accounts", async (request, reply) => {
    const parsed = listQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.code(400).send({ error: { code: "invalid_query", message: "Invalid query parameters" } })
    }
    return listAccounts(parsed.data)
  })

  app.get("/api/accounts/featured", async (_request, reply) => {
    const [row] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.featured, true), eq(accounts.status, "available")))
      .orderBy(desc(accounts.createdAt))
      .limit(1)

    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "No featured account" } })
    }
    return { data: serializeAccount(row) }
  })

  app.get("/api/accounts/:id", async (request, reply) => {
    const params = z.object({ id: z.string().min(1).max(120) }).safeParse(request.params)
    if (!params.success) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid account id" } })
    }

    const [row] = await db.select().from(accounts).where(eq(accounts.id, params.data.id)).limit(1)
    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "Account not found" } })
    }
    return { data: serializeAccount(row) }
  })

  app.post("/api/accounts/:id/view", async (request, reply) => {
    const params = z.object({ id: z.string().min(1).max(120) }).safeParse(request.params)
    if (!params.success) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid account id" } })
    }

    const [row] = await db
      .update(accounts)
      .set({ views: sql`${accounts.views} + 1` })
      .where(eq(accounts.id, params.data.id))
      .returning({ id: accounts.id, views: accounts.views })

    if (!row) {
      return reply.code(404).send({ error: { code: "not_found", message: "Account not found" } })
    }
    return { data: row }
  })
}
