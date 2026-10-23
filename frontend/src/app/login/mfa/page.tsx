import { redirect } from "next/navigation"
import MfaForm from "./mfa-form"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function MfaPage() {
  const supabase = await createServerSupabaseClient()
  const { data: claimsData } = await supabase.auth.getClaims()

  if (!claimsData?.claims) {
    redirect("/login")
  }

  if (claimsData.claims.aal === "aal2") {
    redirect("/admin")
  }

  const { data: factors } = await supabase.auth.mfa.listFactors()
  const verifiedFactor = factors?.totp?.find((factor) => factor.status === "verified")

  return (
    <MfaForm
      mode={verifiedFactor ? "challenge" : "enroll"}
      factorId={verifiedFactor?.id}
      email={String(claimsData.claims.email ?? "")}
    />
  )
}
