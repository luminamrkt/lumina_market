"use client"

import { useState, useEffect } from "react"
import { Shield, Mail, Calendar, Clock, Smartphone } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchAdminMe, fetchAdminProfile } from "@/lib/admin-service"
import type { AdminIdentity, AdminProfile } from "@/types/admin"

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<AdminIdentity | null>(null)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchAdminMe(), fetchAdminProfile()])
      .then(([me, adminProfile]) => {
        setAdmin(me.admin)
        setProfile(adminProfile)
      })
      .catch(() => setError("Gagal memuat profil admin"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !admin) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
        {error ?? "Profil admin tidak tersedia"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Profile Admin</h1>
        <p className="text-sm text-white/50">Informasi akun administrator</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                <span className="text-2xl font-bold text-white">
                  {admin.displayName.charAt(0)}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white">{admin.displayName}</h2>
            <p className="text-sm text-blue-400 mt-1">{profile?.position ?? "-"}</p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
              <Shield className="h-3 w-3" />
              Administrator
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Detail Informasi</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <Shield className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Username</p>
                  <p className="text-sm text-white font-medium">{admin.displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Email</p>
                  <p className="text-sm text-white font-medium">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <Smartphone className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40">No. Telepon</p>
                  <p className="text-sm text-white font-medium">{profile?.phone ?? "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Bergabung Sejak</p>
                  <p className="text-sm text-white font-medium">
                    {new Date(admin.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Terakhir Login</p>
                  <p className="text-sm text-white font-medium">
                    {admin.lastLoginAt
                      ? new Date(admin.lastLoginAt).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-white mb-2">Bio</h3>
            <p className="text-sm text-white/60 leading-relaxed">{profile?.bio ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
