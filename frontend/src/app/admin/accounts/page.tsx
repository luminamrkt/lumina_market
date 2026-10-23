"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, MoreHorizontal, CheckCircle, XCircle, Plus } from "lucide-react"
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
import { formatPrice } from "@/lib/format"
import {
  AdminApiError,
  deleteAdminAccount,
  fetchAccounts,
  updateAdminAccount,
  type AdminAccount,
} from "@/lib/admin-service"
import AccountForm from "@/components/admin/account-form"

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAccounts()
      .then(setAccounts)
      .catch(() => setError("Gagal memuat data akun"))
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = useCallback(
    (account: AdminAccount, mode: "created" | "updated") => {
      setAccounts((prev) =>
        mode === "created"
          ? [account, ...prev]
          : prev.map((item) => (item.id === account.id ? account : item))
      )
      toast({
        title: mode === "created" ? "Akun ditambahkan" : "Akun diperbarui",
        description: account.title,
        type: "success",
      })
    },
    [toast]
  )

  const handleDelete = useCallback(
    async (account: AdminAccount) => {
      if (!window.confirm(`Hapus akun "${account.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
        return
      }
      try {
        await deleteAdminAccount(account.id)
        setAccounts((prev) => prev.filter((item) => item.id !== account.id))
        toast({ title: "Akun dihapus", type: "success" })
      } catch (error) {
        toast({
          title: "Gagal menghapus akun",
          description: error instanceof AdminApiError ? error.message : undefined,
          type: "error",
        })
      }
    },
    [toast]
  )

  const handleToggleFeatured = useCallback(
    async (account: AdminAccount) => {
      try {
        const updated = await updateAdminAccount(account.id, { featured: !account.featured })
        setAccounts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        toast({
          title: updated.featured ? "Akun dijadikan featured" : "Featured dinonaktifkan",
          type: "success",
        })
      } catch (error) {
        toast({
          title: "Gagal memperbarui featured",
          description: error instanceof AdminApiError ? error.message : undefined,
          type: "error",
        })
      }
    },
    [toast]
  )

  const filtered = accounts.filter((account) =>
    account.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
          <Skeleton className="h-9 w-32 rounded-2xl" />
        </div>
        <Skeleton className="h-10 w-80 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Kelola Akun</h1>
          <p className="text-sm text-white/50">{accounts.length} total akun</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingAccount(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Tambah Akun
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          placeholder="Cari akun..."
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
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Akun</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Rank</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Harga</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-white/30">
                    {accounts.length === 0 ? "Belum ada akun" : "Tidak ada akun ditemukan"}
                  </td>
                </tr>
              ) : (
                filtered.map((account) => (
                  <tr key={account.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white/80 font-medium">{account.title}</p>
                      <p className="text-xs text-white/40">
                        {account.category} · ID: {account.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-white/60">{account.rank}</td>
                    <td className="px-4 py-3 font-medium text-white">{formatPrice(account.price)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={account.status === "available" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {account.status === "available"
                          ? "Tersedia"
                          : account.status === "sold"
                            ? "Terjual"
                            : "Dipesan"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {account.featured ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-white/20" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingAccount(account)
                              setFormOpen(true)
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void handleToggleFeatured(account)}>
                            {account.featured ? "Hapus Featured" : "Jadikan Featured"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-400 hover:text-red-300"
                            onClick={() => void handleDelete(account)}
                          >
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <AccountForm
          key={editingAccount?.id ?? "new"}
          account={editingAccount}
          onClose={() => {
            setFormOpen(false)
            setEditingAccount(null)
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
