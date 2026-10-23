import { redirect } from "next/navigation"
import LoginForm from "./login-form"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getClaims()

  if (data?.claims) {
    if (data.claims.aal === "aal2") {
      redirect("/admin")
    }
    redirect("/login/mfa")
  }

  return <LoginForm />
}
