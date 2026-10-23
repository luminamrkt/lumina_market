import { notFound } from "next/navigation"
import { BackendError, backendJson } from "@/lib/backend"
import type { Account } from "@/data/accounts"
import AccountDetail from "./account-detail"

export const dynamic = "force-dynamic"

async function getAccount(id: string) {
  try {
    const result = await backendJson<{ data: Account }>(
      `/api/accounts/${encodeURIComponent(id)}`
    )
    return result.data
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) {
      return null
    }
    throw error
  }
}

async function getRelatedAccounts() {
  try {
    const result = await backendJson<{ data: Account[] }>("/api/accounts?limit=50")
    return result.data
  } catch {
    return []
  }
}

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [account, relatedAccounts] = await Promise.all([
    getAccount(id),
    getRelatedAccounts(),
  ])

  if (!account) {
    notFound()
  }

  return <AccountDetail account={account} relatedAccounts={relatedAccounts} />
}
