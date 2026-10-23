"use client"

import { useActionState } from "react"
import { motion } from "framer-motion"
import { Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { cn } from "@/lib/utils"
import { loginAction, type LoginState } from "./actions"

const initialState: LoginState = {}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2.5 mb-6 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">Lumina Admin</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Akses Admin</h1>
        <p className="text-sm text-white/50 mt-1.5">Masuk dengan akun internal yang terdaftar</p>
      </div>

      <form action={formAction} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-2"
        >
          <Label htmlFor="email">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors duration-200 group-focus-within:text-blue-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="Email admin"
              className="flex h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-12 text-sm text-white placeholder:text-white/20 transition-all duration-300 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:border-white/20"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="space-y-2"
        >
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Password"
          />
        </motion.div>

        {state.error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="alert"
            className="text-xs text-red-400 pl-1"
          >
            {state.error}
          </motion.p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className={cn("w-full h-14 text-base rounded-2xl", pending && "opacity-70")}
        >
          {pending ? "Memverifikasi..." : "Masuk"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-white/30">
        Akses terbatas. Semua aktivitas dicatat.
      </p>
    </>
  )
}
