"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import PasswordStrength from "@/components/auth/PasswordStrength"
import SocialButtons from "@/components/auth/SocialButtons"

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string) => {
    const errs = { ...errors }
    switch (name) {
      case "username":
        if (!value.trim()) errs.username = "Username wajib diisi"
        else if (value.length < 3) errs.username = "Minimal 3 karakter"
        else delete errs.username
        break
      case "email":
        if (!value) errs.email = "Email wajib diisi"
        else if (!/\S+@\S+\.\S+/.test(value)) errs.email = "Format email tidak valid"
        else delete errs.email
        break
      case "password":
        if (!value) errs.password = "Password wajib diisi"
        else if (value.length < 6) errs.password = "Minimal 6 karakter"
        else delete errs.password
        break
      case "confirmPassword":
        if (value !== form.password) errs.confirmPassword = "Password tidak cocok"
        else delete errs.confirmPassword
        break
    }
    setErrors(errs)
  }

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.username.trim()) errs.username = "Username wajib diisi"
    else if (form.username.length < 3) errs.username = "Minimal 3 karakter"
    if (!form.email) errs.email = "Email wajib diisi"
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Format email tidak valid"
    if (!form.password) errs.password = "Password wajib diisi"
    else if (form.password.length < 6) errs.password = "Minimal 6 karakter"
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Password tidak cocok"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) router.push("/")
  }

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2.5 mb-6 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 20h12"/><path d="M12 12v8"/></svg>
          </div>
          <span className="text-lg font-bold gradient-text">Lumina Market</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Buat Akun</h1>
        <p className="text-sm text-white/50 mt-1.5">Daftar akun Lumina Market baru</p>
      </div>

      <motion.form
        variants={formVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <motion.div variants={fieldVariants} className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors duration-200 group-focus-within:text-blue-400" />
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Masukkan username"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="flex h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-12 text-sm text-white placeholder:text-white/20 transition-all duration-300 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:border-white/20"
            />
          </div>
          {errors.username && <p className="text-xs text-red-400 pl-1">{errors.username}</p>}
        </motion.div>

        <motion.div variants={fieldVariants} className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors duration-200 group-focus-within:text-blue-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="contoh@email.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="flex h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-12 text-sm text-white placeholder:text-white/20 transition-all duration-300 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:border-white/20"
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 pl-1">{errors.email}</p>}
        </motion.div>

        <motion.div variants={fieldVariants} className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
          />
          <PasswordStrength password={form.password} />
        </motion.div>

        <motion.div variants={fieldVariants} className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Ulangi password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <Button type="submit" className="w-full h-14 text-base rounded-2xl group">
            Daftar
          </Button>
        </motion.div>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex items-center gap-3 my-8"
      >
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30 shrink-0">Atau daftar dengan</span>
        <div className="flex-1 h-px bg-white/10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <SocialButtons />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="mt-8 text-center text-sm text-white/50"
      >
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
        >
          Masuk
        </Link>
      </motion.p>
    </>
  )
}
