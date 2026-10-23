"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, MoreHorizontal, Shield, ShieldCheck, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import {
  AdminApiError,
  fetchAdminMe,
  fetchAdminUsers,
  updateAdminUser,
  type AdminUser,
} from "@/lib/admin-service"
import type { AdminIdentity } from "@/types/admin"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [me, setMe] = useState<AdminIdentity | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([fetchAdminUsers(), fetchAdminMe()])
      .then(([adminUsers, session]) => {
        setUsers(adminUsers)
        setMe(session.admin)
      })
      .catch(() => setError("Gagal memuat data admin"))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = useCallback(
    async (
      user: AdminUser,
      updates: { status?: "active" | "disabled"; role?: "owner" | "admin" }
    ) => {
      const action =
        updates.status === "disabled"
          ? `Nonaktifkan admin ${user.fullName}?`
          : updates.status === "active"
            ? `Aktifkan kembali admin ${user.fullName}?`
            : updates.role === "owner"
              ? `Jadikan ${user.fullName} owner?`
              : `Turunkan ${user.fullName} menjadi admin?`

      if (!window.confirm(action)) return

      setUpdatingId(user.id)
      try {
        const updated = await updateAdminUser(user.id, updates)
        setUsers((prev) =>
          prev.map((item) =>
            item.id === updated.id
              ? {
                  ...item,
                  fullName: updated.displayName,
                  role: updated.role,
                  status: updated.status,
                  mfaRequired: updated.mfaRequired,
                  lastLoginAt: updated.lastLoginAt,
                  position: updated.position,
                }
              : item
          )
        )
        toast({ title: "Data admin diperbarui", description: updated.email, type: "success" })
      } catch (error) {
        toast({
          title: "Gagal memperbarui admin",
          description: error instanceof AdminApiError ? error.message : undefined,
          type: "error",
        })
      } finally {
        setUpdatingId(null)
      }
    },
    [toast]
  )

  const filtered = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
        <Skeleton className="h-10 w-80 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Kelola Admin</h1>
        <p className="text-sm text-white/50">{users.length} total admin</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          placeholder="Cari admin..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full h-10 rounded-2xl border border-white/10 bg-white/[0.03] pl-9 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Admin</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">MFA</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Login Terakhir</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Bergabung</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-white/30">
                    {users.length === 0 ? "Belum ada admin" : "Tidak ada admin ditemukan"}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const isSelf = user.id === me?.id
                  const canManage = me?.role === "owner" && !isSelf
                  const isUpdating = updatingId === user.id

                  return (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white/80 font-medium">
                              {user.fullName}
                              {isSelf && <span className="ml-2 text-[10px] text-blue-400">Anda</span>}
                            </p>
                            <p className="text-xs text-white/40">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-purple-400">
                          {user.role === "owner" ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : (
                            <Shield className="h-3 w-3" />
                          )}
                          {user.role === "owner" ? "Owner" : "Admin"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={user.status === "active" ? "default" : "destructive"}
                          className="text-[10px]"
                        >
                          {user.status === "active" ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <KeyRound className="h-3 w-3" />
                          Wajib
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs">{user.joined}</td>
                      <td className="px-4 py-3">
                        {canManage ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  void handleUpdate(user, {
                                    status: user.status === "active" ? "disabled" : "active",
                                  })
                                }
                              >
                                {user.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  void handleUpdate(user, {
                                    role: user.role === "owner" ? "admin" : "owner",
                                  })
                                }
                              >
                                {user.role === "owner" ? "Jadikan Admin" : "Jadikan Owner"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <div className="px-3 py-2 text-[10px] text-white/30">
                                ID: {user.id.slice(0, 8)}
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-[10px] text-white/20">
                            {isSelf ? "Akun Anda" : "Owner only"}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
