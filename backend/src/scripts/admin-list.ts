import { adminDb, adminSql, runtimeSql } from "../db/client.js"
import { adminUsers } from "../db/schema.js"

async function main() {
  const rows = await adminDb
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      displayName: adminUsers.displayName,
      role: adminUsers.role,
      status: adminUsers.status,
      mfaRequired: adminUsers.mfaRequired,
      lastLoginAt: adminUsers.lastLoginAt,
    })
    .from(adminUsers)
    .orderBy(adminUsers.createdAt)

  if (rows.length === 0) {
    console.log("No admins linked yet")
    return
  }

  console.table(rows)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await Promise.all([adminSql.end(), runtimeSql.end()])
  })
