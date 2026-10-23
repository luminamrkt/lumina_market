import { adminDb, adminSql, runtimeSql } from "../db/client.js"
import { adminProfiles, adminUsers } from "../db/schema.js"

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function main() {
  const email = getArg("email")?.trim().toLowerCase()
  const name = getArg("name")?.trim()
  const role = (getArg("role") ?? "owner") as "owner" | "admin"

  if (!email || !name) {
    throw new Error('Usage: npm run admin:link -- --email <email> --name "<display name>" [--role owner|admin]')
  }
  if (!["owner", "admin"].includes(role)) {
    throw new Error("Role must be owner or admin")
  }

  const users = await adminSql<{ id: string; email: string }[]>`
    select id, email from auth.users where lower(email) = ${email} limit 1
  `

  const authUser = users[0]
  if (!authUser) {
    throw new Error(
      `Supabase Auth user ${email} not found. Create it first in Supabase Dashboard > Authentication > Users.`
    )
  }

  const [admin] = await adminDb
    .insert(adminUsers)
    .values({
      authUserId: authUser.id,
      email: authUser.email,
      displayName: name,
      role,
      status: "active",
      mfaRequired: true,
    })
    .onConflictDoUpdate({
      target: adminUsers.authUserId,
      set: {
        email: authUser.email,
        displayName: name,
        role,
        status: "active",
        updatedAt: new Date(),
      },
    })
    .returning({ id: adminUsers.id, email: adminUsers.email, role: adminUsers.role })

  if (!admin) {
    throw new Error("Failed to link admin user")
  }

  await adminDb
    .insert(adminProfiles)
    .values({ adminId: admin.id })
    .onConflictDoNothing({ target: adminProfiles.adminId })

  console.log(`Linked admin: ${admin.email} (${admin.role}) id=${admin.id}`)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await Promise.all([adminSql.end(), runtimeSql.end()])
  })
