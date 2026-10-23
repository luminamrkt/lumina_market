"use client"

import { Pin, Pencil, Trash2, Lock } from "lucide-react"
import { motion } from "framer-motion"
import type { AdminNote } from "@/types"
import { cn } from "@/lib/utils"

interface NoteCardProps {
  note: AdminNote
  canManage: boolean
  onEdit: (note: AdminNote) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
}

export default function NoteCard({ note, canManage, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative rounded-2xl border p-5 transition-all",
        note.pinned
          ? "border-blue-500/30 bg-blue-500/5"
          : "border-white/10 bg-white/[0.03] hover:border-white/20"
      )}
    >
      {note.pinned && (
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/25">
          <Pin className="h-3 w-3 text-white" />
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
          {note.title}
        </h3>
      </div>

      <p className="text-xs text-white/50 leading-relaxed line-clamp-4 mb-4">
        {note.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-white/30">
          {note.visibility === "private" && <Lock className="h-3 w-3" />}
          <span>{note.createdBy ?? "Admin"}</span>
          <span>•</span>
          <span>{new Date(note.createdAt).toLocaleDateString("id-ID")}</span>
        </div>

        {canManage ? (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onTogglePin(note.id)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                note.pinned ? "text-blue-400 hover:bg-blue-500/20" : "text-white/30 hover:text-white hover:bg-white/10"
              )}
            >
              <Pin className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onEdit(note)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[10px] text-white/20">Read-only</span>
        )}
      </div>
    </motion.div>
  )
}
