import { eq } from "drizzle-orm"
import { adminDb, adminSql, runtimeSql } from "../db/client.js"
import { adminUsers } from "../db/schema.js"

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function main() {
  const email = getArg("email")?.trim().toLowerCase()
  if (!email) {
    throw new Error('Usage: npm run admin:disable -- --email <email>')
  }

  const [admin] = await adminDb
    .update(adminUsers)
    .set({ status: "disabled", credentialsChangedAt: new Date(), updatedAt: new Date() })
    .where(eq(adminUsers.email, email))
    .returning({ email: adminUsers.email, status: adminUsers.status })

  if (!admin) {
    throw new Error(`Admin ${email} not found`)
  }

  console.log(`Disabled admin: ${admin.email}`)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await Promise.all([adminSql.end(), runtimeSql.end()])
  })
