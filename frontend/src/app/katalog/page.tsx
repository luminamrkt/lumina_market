import { backendJson } from "@/lib/backend"
import type { Account } from "@/data/accounts"
import CatalogClient from "./catalog-client"

export const dynamic = "force-dynamic"

async function getAccounts() {
  try {
    const result = await backendJson<{ data: Account[] }>("/api/accounts?limit=50")
    return result.data
  } catch {
    return []
  }
}

export default async function CatalogPage() {
  const accounts = await getAccounts()
  return <CatalogClient accounts={accounts} />
}
