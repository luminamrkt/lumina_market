import "server-only"

import type { AdminIdentity, AdminProfile } from "@/types/admin"
import { BackendError, backendJson } from "./backend"
import { createServerSupabaseClient } from "./supabase/server"

type AdminSessionResult =
  | { status: "unauthenticated" }
  | { status: "mfa_required" }
  | { status: "forbidden" }
  | { status: "authenticated"; admin: AdminIdentity; profile: AdminProfile; token: string }

export async function getAdminSession(): Promise<AdminSessionResult> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    return { status: "unauthenticated" }
  }

  if (data.claims.aal !== "aal2") {
    return { status: "mfa_required" }
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return { status: "unauthenticated" }
  }

  try {
    const payload = await backendJson<{ admin: AdminIdentity; profile: AdminProfile }>(
      "/api/admin/me",
      { token: session.access_token }
    )
    return {
      status: "authenticated",
      admin: payload.admin,
      profile: payload.profile,
      token: session.access_token,
    }
  } catch (error) {
    if (error instanceof BackendError && (error.status === 401 || error.status === 403)) {
      return { status: "forbidden" }
    }
    throw error
  }
}
