"use client"

import { useState, useEffect, useCallback } from "react"
import { StickyNote, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatePresence } from "framer-motion"
import NoteCard from "@/components/admin/note-card"
import NoteEditor from "@/components/admin/note-editor"
import { fetchAdminMe, fetchAdminNotes, createAdminNote, updateAdminNote, deleteAdminNote, togglePinAdminNote } from "@/lib/admin-service"
import type { AdminNote } from "@/types"

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<AdminNote[]>([])
  const [adminId, setAdminId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const [editingNote, setEditingNote] = useState<AdminNote | null>(null)

  useEffect(() => {
    Promise.all([fetchAdminNotes(), fetchAdminMe()])
      .then(([adminNotes, session]) => {
        setNotes(adminNotes)
        setAdminId(session.admin.id)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = useCallback(async ({
    title,
    content,
    visibility,
  }: {
    title: string
    content: string
    visibility: "shared" | "private"
  }) => {
    if (editingNote) {
      const updated = await updateAdminNote(editingNote.id, { title, content, visibility })
      if (updated) {
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? updated : n)))
      }
    } else {
      const created = await createAdminNote({ title, content, visibility })
      if (created) {
        setNotes((prev) => [created, ...prev])
      }
    }
  }, [editingNote])

  const handleDelete = useCallback(async (id: string) => {
    await deleteAdminNote(id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const handleTogglePin = useCallback(async (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (!note) return
    const updated = await togglePinAdminNote(id, note.pinned)
    if (updated) {
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
    }
  }, [notes])

  const handleEdit = useCallback((note: AdminNote) => {
    setEditingNote(note)
    setEditorKey((key) => key + 1)
    setEditorOpen(true)
  }, [])

  const openNewNote = useCallback(() => {
    setEditingNote(null)
    setEditorKey((key) => key + 1)
    setEditorOpen(true)
  }, [])

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
          <Skeleton className="h-9 w-36 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Notes</h1>
          <p className="text-sm text-white/50">Catatan internal untuk admin ({notes.length})</p>
        </div>
        <Button size="sm" onClick={openNewNote}>
          <Plus className="h-4 w-4 mr-1.5" />
          Buat Catatan
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
              <StickyNote className="h-6 w-6 text-white/30" />
            </div>
          </div>
          <p className="text-sm text-white/40">Belum ada catatan</p>
          <p className="text-xs text-white/20 mt-1">Buat catatan pertama untuk tim admin</p>
          <Button size="sm" className="mt-4" onClick={openNewNote}>
            <Plus className="h-4 w-4 mr-1.5" />
            Buat Catatan Baru
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                canManage={note.adminId === adminId}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <NoteEditor
        key={editorKey}
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false)
          setEditingNote(null)
        }}
        onSave={handleSave}
        editingNote={editingNote}
      />
    </div>
  )
}
