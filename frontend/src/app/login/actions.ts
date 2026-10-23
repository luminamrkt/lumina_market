"use server"

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export interface LoginState {
  error?: string
}

export interface EnrollmentState {
  error?: string
  factorId?: string
  qrCode?: string
  secret?: string
}

function normalizeCode(value: FormDataEntryValue | null) {
  return String(value ?? "").replace(/\s+/g, "")
}

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email dan password wajib diisi" }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length > 256) {
    return { error: "Email atau password salah" }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "Email atau password salah" }
  }

  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (assurance?.currentLevel === "aal2") {
    redirect("/admin")
  }

  redirect("/login/mfa")
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function beginEnrollmentAction(): Promise<EnrollmentState> {
  const supabase = await createServerSupabaseClient()
  const { data: claimsData } = await supabase.auth.getClaims()

  if (!claimsData?.claims) {
    redirect("/login")
  }

  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
  if (factorsError) {
    return { error: "Gagal memeriksa status MFA. Coba lagi." }
  }

  const hasVerifiedFactor = (factors?.all ?? []).some(
    (factor) => factor.status === "verified"
  )
  if (hasVerifiedFactor && claimsData.claims.aal !== "aal2") {
    return {
      error: "Akun ini sudah memiliki MFA terverifikasi. Muat ulang halaman untuk memverifikasi.",
    }
  }

  for (const factor of factors?.all ?? []) {
    if (factor.status === "unverified") {
      await supabase.auth.mfa.unenroll({ factorId: factor.id })
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Lumina Admin",
  })

  if (error || !data) {
    return { error: "Gagal memulai verifikasi MFA. Coba lagi." }
  }

  return {
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  }
}

export async function verifyMfaAction(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const factorId = String(formData.get("factorId") ?? "")
  const code = normalizeCode(formData.get("code"))

  if (!factorId || !/^\d{6}$/.test(code)) {
    return { error: "Kode verifikasi harus 6 digit" }
  }

  const supabase = await createServerSupabaseClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) {
    redirect("/login")
  }

  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId,
  })

  if (challengeError || !challenge) {
    return { error: "Sesi verifikasi tidak valid. Muat ulang halaman." }
  }

  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  })

  if (error) {
    return { error: "Kode verifikasi salah atau kedaluwarsa" }
  }

  redirect("/admin")
}
