"use client"

import { useEffect } from "react"
import { TriangleAlert } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#0a0a0f]">
      <div className="max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <TriangleAlert className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-white">Terjadi Kesalahan</h1>
        <p className="text-sm text-white/50">
          Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-bg text-white text-sm font-medium hover:gradient-bg-hover transition-all duration-300 cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  )
}
