import { buildApp } from "./app.js"
import { config } from "./config.js"

const app = await buildApp()

async function shutdown(signal: string) {
  app.log.info({ signal }, "Shutting down")
  try {
    await app.close()
  } finally {
    process.exit(0)
  }
}

process.on("SIGINT", () => void shutdown("SIGINT"))
process.on("SIGTERM", () => void shutdown("SIGTERM"))

try {
  await app.listen({ host: config.HOST, port: config.PORT })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
