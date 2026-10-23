"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { AdminNote } from "@/types"

interface NoteEditorProps {
  open: boolean
  onClose: () => void
  onSave: (note: {
    title: string
    content: string
    visibility: "shared" | "private"
  }) => void
  editingNote?: AdminNote | null
}

export default function NoteEditor({ open, onClose, onSave, editingNote }: NoteEditorProps) {
  const [title, setTitle] = useState(editingNote?.title ?? "")
  const [content, setContent] = useState(editingNote?.content ?? "")
  const [visibility, setVisibility] = useState<"shared" | "private">(
    editingNote?.visibility ?? "shared"
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSave({ title: title.trim(), content: content.trim(), visibility })
    setTitle("")
    setContent("")
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0f] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">
                {editingNote ? "Edit Catatan" : "Buat Catatan Baru"}
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Judul</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul catatan..."
                  className="w-full h-10 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Isi Catatan</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis catatan di sini..."
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={visibility === "private"}
                  onChange={(event) =>
                    setVisibility(event.target.checked ? "private" : "shared")
                  }
                  className="h-4 w-4 rounded border-white/20 bg-white/5"
                />
                Catatan privat (hanya saya)
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose} className="text-sm">
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={!title.trim() || !content.trim()}>
                  {editingNote ? "Simpan Perubahan" : "Simpan Catatan"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
