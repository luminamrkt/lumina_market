"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AdminApiError,
  createAdminAccount,
  updateAdminAccount,
  type AccountCategory,
  type AccountStatus,
  type AdminAccount,
  type AdminAccountInput,
} from "@/lib/admin-service"

const categories: { value: AccountCategory; label: string }[] = [
  { value: "sultan", label: "Sultan" },
  { value: "collector", label: "Collector" },
  { value: "skin-rich", label: "Skin Rich" },
  { value: "mythic-glory", label: "Mythic Glory" },
  { value: "rare-limited", label: "Rare Limited" },
  { value: "top-global-ready", label: "Top Global Ready" },
  { value: "tournament-ready", label: "Tournament Ready" },
  { value: "starlight-collection", label: "Starlight Collection" },
  { value: "budget-friendly", label: "Budget Friendly" },
]

const statuses: { value: AccountStatus; label: string }[] = [
  { value: "available", label: "Tersedia" },
  { value: "reserved", label: "Dipesan" },
  { value: "sold", label: "Terjual" },
]

const inputClass =
  "h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
const selectClass =
  "h-10 w-full rounded-xl border border-white/10 bg-[#0f0f1a] px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"

function parseNumber(value: string) {
  if (!value.trim()) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

interface AccountFormProps {
  account: AdminAccount | null
  onClose: () => void
  onSaved: (account: AdminAccount, mode: "created" | "updated") => void
}

export default function AccountForm({ account, onClose, onSaved }: AccountFormProps) {
  const [title, setTitle] = useState(account?.title ?? "")
  const [category, setCategory] = useState<AccountCategory>(account?.category ?? "sultan")
  const [rank, setRank] = useState(account?.rank ?? "")
  const [highestRank, setHighestRank] = useState(account?.highestRank ?? "")
  const [server, setServer] = useState(account?.server ?? "")
  const [price, setPrice] = useState(account ? String(account.price) : "")
  const [originalPrice, setOriginalPrice] = useState(
    account?.originalPrice ? String(account.originalPrice) : ""
  )
  const [totalSkins, setTotalSkins] = useState(account ? String(account.totalSkins) : "0")
  const [totalHeroes, setTotalHeroes] = useState(account ? String(account.totalHeroes) : "0")
  const [rareSkins, setRareSkins] = useState(account ? String(account.rareSkins) : "0")
  const [emblems, setEmblems] = useState(account ? String(account.emblems) : "0")
  const [status, setStatus] = useState<AccountStatus>(account?.status ?? "available")
  const [featured, setFeatured] = useState(account?.featured ?? false)
  const [isVerified, setIsVerified] = useState(account?.isVerified ?? true)
  const [description, setDescription] = useState(account?.description ?? "")
  const [images, setImages] = useState(account?.images.join("\n") ?? "")
  const [videoPreview, setVideoPreview] = useState(account?.videoPreview ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    const payload: AdminAccountInput = {
      title: title.trim(),
      category,
      rank: rank.trim(),
      highestRank: highestRank.trim(),
      server: server.trim(),
      price: parseNumber(price),
      originalPrice: originalPrice.trim() ? parseNumber(originalPrice) : null,
      totalSkins: parseNumber(totalSkins),
      totalHeroes: parseNumber(totalHeroes),
      rareSkins: parseNumber(rareSkins),
      emblems: parseNumber(emblems),
      status,
      featured,
      isVerified,
      description: description.trim(),
      images: images
        .split(/[\n,]/)
        .map((image) => image.trim())
        .filter(Boolean),
      videoPreview: videoPreview.trim() || null,
      skinCollection: account?.skinCollection,
      heroCollection: account?.heroCollection,
    }

    if (!payload.title || !payload.rank || !payload.highestRank || !payload.server) {
      setError("Judul, rank, highest rank, dan server wajib diisi")
      return
    }
    if (payload.price <= 0) {
      setError("Harga harus lebih dari 0")
      return
    }

    setSaving(true)
    try {
      if (account) {
        const updated = await updateAdminAccount(account.id, payload)
        onSaved(updated, "updated")
      } else {
        const created = await createAdminAccount(payload)
        onSaved(created, "created")
      }
      onClose()
    } catch (error) {
      setError(error instanceof AdminApiError ? error.message : "Gagal menyimpan akun")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        title={account ? "Edit Akun" : "Tambah Akun"}
        description={account ? "Perbarui detail akun katalog" : "Buat akun katalog baru"}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account-title">Judul</Label>
            <Input
              id="account-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account-category">Kategori</Label>
              <select
                id="account-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as AccountCategory)}
                className={selectClass}
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="account-status">Status</Label>
              <select
                id="account-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as AccountStatus)}
                className={selectClass}
              >
                {statuses.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account-rank">Rank</Label>
              <Input
                id="account-rank"
                value={rank}
                onChange={(event) => setRank(event.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <Label htmlFor="account-highest-rank">Highest Rank</Label>
              <Input
                id="account-highest-rank"
                value={highestRank}
                onChange={(event) => setHighestRank(event.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="account-server">Server</Label>
              <Input
                id="account-server"
                value={server}
                onChange={(event) => setServer(event.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <Label htmlFor="account-price">Harga</Label>
              <Input
                id="account-price"
                type="number"
                min={1}
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <Label htmlFor="account-original-price">Harga Asli</Label>
              <Input
                id="account-original-price"
                type="number"
                min={0}
                value={originalPrice}
                onChange={(event) => setOriginalPrice(event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="account-skins">Total Skin</Label>
              <Input
                id="account-skins"
                type="number"
                min={0}
                value={totalSkins}
                onChange={(event) => setTotalSkins(event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="account-heroes">Total Hero</Label>
              <Input
                id="account-heroes"
                type="number"
                min={0}
                value={totalHeroes}
                onChange={(event) => setTotalHeroes(event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="account-rare">Rare Skin</Label>
              <Input
                id="account-rare"
                type="number"
                min={0}
                value={rareSkins}
                onChange={(event) => setRareSkins(event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="account-emblems">Emblem (%)</Label>
              <Input
                id="account-emblems"
                type="number"
                min={0}
                max={100}
                value={emblems}
                onChange={(event) => setEmblems(event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="account-description">Deskripsi</Label>
            <textarea
              id="account-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="account-images">Gambar (satu URL per baris)</Label>
            <textarea
              id="account-images"
              value={images}
              onChange={(event) => setImages(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="account-video">Video Preview</Label>
            <Input
              id="account-video"
              value={videoPreview}
              onChange={(event) => setVideoPreview(event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(event) => setIsVerified(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
              />
              Terverifikasi
            </label>
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {account ? "Simpan Perubahan" : "Tambah Akun"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
