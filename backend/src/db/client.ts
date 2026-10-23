import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { config } from "../config.js"
import * as schema from "./schema.js"

export const runtimeSql = postgres(config.APP_DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 15,
  prepare: false,
  ssl: "require",
})

export const db = drizzle(runtimeSql, { schema })

export const adminSql = postgres(config.DATABASE_URL, {
  max: 3,
  idle_timeout: 20,
  connect_timeout: 15,
  prepare: false,
  ssl: "require",
})

export const adminDb = drizzle(adminSql, { schema })
