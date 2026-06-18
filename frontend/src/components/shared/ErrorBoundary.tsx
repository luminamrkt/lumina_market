"use client"

import { Component, type ReactNode } from "react"
import { TriangleAlert } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
          <div className="max-w-md text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <TriangleAlert className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-white">Terjadi Kesalahan</h1>
            <p className="text-sm text-white/50">
              Maaf, terjadi kesalahan saat memuat halaman. Silakan muat ulang atau coba lagi nanti.
            </p>
            <pre className="text-xs text-left text-red-400/70 bg-white/5 rounded-xl p-4 overflow-auto max-h-32">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-bg text-white text-sm font-medium hover:gradient-bg-hover transition-all duration-300 cursor-pointer"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
