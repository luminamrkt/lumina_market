import { eq } from "drizzle-orm"
import type { FastifyReply, FastifyRequest } from "fastify"
import { createRemoteJWKSet, jwtVerify } from "jose"
import { config } from "../config.js"
import { db } from "../db/client.js"
import { adminUsers } from "../db/schema.js"

export interface AdminContext {
  id: string
  authUserId: string
  email: string
  displayName: string
  role: "owner" | "admin"
  createdAt: Date
  authTime: Date
  lastLoginAt: Date | null
}

declare module "fastify" {
  interface FastifyRequest {
    admin?: AdminContext
  }
}

const jwks = createRemoteJWKSet(new URL(config.jwksUrl), {
  cacheMaxAge: 10 * 60 * 1000,
  cooldownDuration: 30_000,
})

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: { code: "unauthorized", message: "Authentication required" } })
  }

  const token = header.slice("Bearer ".length).trim()
  if (!token) {
    return reply.code(401).send({ error: { code: "unauthorized", message: "Authentication required" } })
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: config.expectedIssuer,
      audience: "authenticated",
      clockTolerance: 5,
    })

    if (payload.aal !== "aal2") {
      return reply.code(403).send({ error: { code: "mfa_required", message: "MFA verification required" } })
    }

    const authUserId = payload.sub
    if (!authUserId) {
      return reply.code(401).send({ error: { code: "unauthorized", message: "Invalid session" } })
    }

    const [admin] = await db
      .select({
        id: adminUsers.id,
        authUserId: adminUsers.authUserId,
        email: adminUsers.email,
        displayName: adminUsers.displayName,
        role: adminUsers.role,
        status: adminUsers.status,
        createdAt: adminUsers.createdAt,
        credentialsChangedAt: adminUsers.credentialsChangedAt,
        mfaRequired: adminUsers.mfaRequired,
        lastLoginAt: adminUsers.lastLoginAt,
      })
      .from(adminUsers)
      .where(eq(adminUsers.authUserId, authUserId))
      .limit(1)

    if (!admin || admin.status !== "active") {
      return reply.code(403).send({ error: { code: "forbidden", message: "Admin access denied" } })
    }

    if (admin.mfaRequired && payload.aal !== "aal2") {
      return reply.code(403).send({ error: { code: "mfa_required", message: "MFA verification required" } })
    }

    const issuedAt = typeof payload.iat === "number" ? payload.iat * 1000 : 0
    if (issuedAt && admin.credentialsChangedAt.getTime() > issuedAt) {
      return reply
        .code(401)
        .send({ error: { code: "session_revoked", message: "Session expired, please sign in again" } })
    }

    request.admin = {
      id: admin.id,
      authUserId: admin.authUserId,
      email: admin.email,
      displayName: admin.displayName,
      role: admin.role,
      createdAt: admin.createdAt,
      authTime: new Date(issuedAt || Date.now()),
      lastLoginAt: admin.lastLoginAt,
    }
  } catch {
    return reply.code(401).send({ error: { code: "unauthorized", message: "Invalid or expired session" } })
  }
}

export function requireInternalKey(request: FastifyRequest, reply: FastifyReply) {
  const key = request.headers["x-internal-key"]
  if (typeof key !== "string" || key !== config.INTERNAL_API_KEY) {
    return reply.code(401).send({ error: { code: "unauthorized", message: "Invalid API key" } })
  }
}
