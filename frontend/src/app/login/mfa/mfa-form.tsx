"use client"

import { useEffect, useRef, useState } from "react"
import { useActionState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { KeyRound, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  beginEnrollmentAction,
  verifyMfaAction,
  type EnrollmentState,
  type LoginState,
} from "../actions"

interface MfaFormProps {
  mode: "challenge" | "enroll"
  factorId?: string
  email: string
}

const initialState: LoginState = {}

function getQrSvg(value: string) {
  const trimmed = value.trim()
  const encodedPrefixes = [
    "data:image/svg+xml;utf-8,",
    "data:image/svg+xml;charset=utf-8,",
    "data:image/svg+xml,",
  ]
  const encodedPrefix = encodedPrefixes.find((prefix) => trimmed.startsWith(prefix))
  if (encodedPrefix) {
    try {
      return decodeURIComponent(trimmed.slice(encodedPrefix.length))
    } catch {
      return null
    }
  }

  const base64Prefix = "data:image/svg+xml;base64,"
  if (trimmed.startsWith(base64Prefix)) {
    try {
      return atob(trimmed.slice(base64Prefix.length))
    } catch {
      return null
    }
  }

  const svgIndex = trimmed.indexOf("<svg")
  return svgIndex >= 0 ? trimmed.slice(svgIndex) : null
}

function getQrSrc(value: string) {
  const svg = getQrSvg(value)
  return svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : null
}

export default function MfaForm({ mode, factorId, email }: MfaFormProps) {
  const [state, formAction, pending] = useActionState(verifyMfaAction, initialState)
  const [enrollment, setEnrollment] = useState<EnrollmentState | null>(null)
  const [code, setCode] = useState("")
  const started = useRef(false)

  useEffect(() => {
    if (mode !== "enroll" || started.current) return
    started.current = true
    beginEnrollmentAction()
      .then(setEnrollment)
      .catch(() => setEnrollment({ error: "Gagal memulai verifikasi MFA. Coba lagi." }))
  }, [mode])

  const activeFactorId = mode === "challenge" ? factorId : enrollment?.factorId
  const ready = Boolean(activeFactorId) && code.length === 6
  const loadingEnrollment = mode === "enroll" && !enrollment
  const qrSrc = enrollment?.qrCode ? getQrSrc(enrollment.qrCode) : null

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2.5 mb-6 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">Lumina Admin</span>
        </div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <KeyRound className="h-6 w-6 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">
          {mode === "challenge" ? "Verifikasi MFA" : "Aktifkan MFA"}
        </h1>
        <p className="text-sm text-white/50 mt-1.5">
          {mode === "challenge"
            ? `Masukkan kode dari aplikasi authenticator untuk ${email}`
            : `Hubungkan aplikasi authenticator ke akun ${email}`}
        </p>
      </div>

      {loadingEnrollment && (
        <div className="flex flex-col items-center gap-3 py-10 text-sm text-white/40">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          Menyiapkan kode MFA...
        </div>
      )}

      {enrollment?.error && (
        <p role="alert" className="text-sm text-red-400 text-center py-6">
          {enrollment.error}
        </p>
      )}

      {mode === "enroll" && enrollment?.qrCode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-2xl bg-white p-4 w-fit mx-auto">
            {qrSrc ? (
              <Image
                src={qrSrc}
                alt="QR code untuk aplikasi authenticator"
                width={176}
                height={176}
                unoptimized
                className="h-44 w-44"
              />
            ) : (
              <p className="w-44 text-center text-xs text-black/60">
                QR tidak dapat ditampilkan. Gunakan kode manual di bawah.
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40 mb-2">Atau masukkan kode manual ini:</p>
            <code className="block text-sm text-white tracking-widest break-all">
              {enrollment.secret}
            </code>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            Simpan secret ini di tempat aman. Kode 6 digit berubah setiap 30 detik dan jangan
            dibagikan kepada siapa pun.
          </p>
        </motion.div>
      )}

      {(mode === "challenge" || enrollment?.factorId) && (
        <form action={formAction} className="space-y-5 mt-6">
          <input type="hidden" name="factorId" value={activeFactorId ?? ""} />
          <div className="space-y-2">
            <Label htmlFor="code">Kode 6 digit</Label>
            <input
              id="code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              required
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="flex h-16 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-center text-2xl tracking-[0.5em] text-white placeholder:text-white/20 transition-all focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {state.error && (
            <p role="alert" className="text-xs text-red-400 pl-1">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!ready || pending}
            className={cn("w-full h-14 text-base rounded-2xl", (!ready || pending) && "opacity-70")}
          >
            {pending ? "Memverifikasi..." : "Verifikasi"}
          </Button>
        </form>
      )}
    </>
  )
}
