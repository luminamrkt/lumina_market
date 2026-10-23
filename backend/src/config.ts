import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("127.0.0.1"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  APP_DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  INTERNAL_API_KEY: z.string().min(32),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const config = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwksUrl: new URL("/auth/v1/.well-known/jwks.json", parsed.data.SUPABASE_URL).toString(),
  expectedIssuer: new URL("/auth/v1", parsed.data.SUPABASE_URL).toString(),
}
