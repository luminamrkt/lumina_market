"use client"

import { create } from "zustand"

export interface ToastItem {
  id: string
  title: string
  description?: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
}

interface UIState {
  toasts: ToastItem[]
  addToast: (toast: ToastItem) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))
