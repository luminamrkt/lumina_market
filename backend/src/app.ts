import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import rateLimit from "@fastify/rate-limit"
import Fastify from "fastify"
import { ZodError } from "zod"
import { config } from "./config.js"
import { requireInternalKey } from "./lib/auth.js"
import accountRoutes from "./routes/accounts.js"
import adminRoutes from "./routes/admin.js"
import { startMonitoringListener, stopMonitoringListener } from "./services/monitoring.js"

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === "production" ? "info" : "debug",
    },
    trustProxy: config.NODE_ENV === "production",
    bodyLimit: 1024 * 1024,
    requestIdHeader: "x-request-id",
  })

  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })

  await app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error("Origin not allowed"), false)
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Internal-Key", "X-Request-Id"],
    maxAge: 600,
  })

  await app.register(rateLimit, {
    global: true,
    max: 300,
    timeWindow: "1 minute",
  })

  app.addHook("onRequest", async (request, reply) => {
    if (request.url === "/health") return
    if (request.url.startsWith("/api/")) {
      const response = requireInternalKey(request, reply)
      if (response) return response
    }
  })

  app.get("/health", async () => ({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  }))

  await app.register(accountRoutes)
  await app.register(adminRoutes)

  app.setNotFoundHandler((_request, reply) => {
    return reply.code(404).send({ error: { code: "not_found", message: "Route not found" } })
  })

  app.setErrorHandler((error: unknown, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({ error: { code: "invalid_request", message: "Invalid request" } })
    }

    const fastifyError = error as { statusCode?: number }
    const statusCode =
      fastifyError.statusCode && fastifyError.statusCode >= 400 ? fastifyError.statusCode : 500
    request.log.error({ err: error }, "Request failed")

    return reply.code(statusCode).send({
      error: {
        code: statusCode >= 500 ? "internal_error" : "request_error",
        message: statusCode >= 500 ? "Internal server error" : "Request could not be processed",
      },
    })
  })

  app.addHook("onReady", async () => {
    await startMonitoringListener()
  })

  app.addHook("onClose", async () => {
    await stopMonitoringListener()
  })

  return app
}
