"use client"

import { useEffect, useState } from "react"
import type { AdminMonitoringSnapshot } from "@/types/admin"

function isNewer(next: AdminMonitoringSnapshot, current: AdminMonitoringSnapshot | null) {
  if (!current) return true
  return new Date(next.updatedAt).getTime() >= new Date(current.updatedAt).getTime()
}

export function useAdminMonitoring() {
  const [snapshot, setSnapshot] = useState<AdminMonitoringSnapshot | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let disposed = false
    let source: EventSource | null = null
    let retryTimer: ReturnType<typeof setTimeout> | null = null
    let retries = 0

    async function loadSnapshot() {
      try {
        const response = await fetch("/api/admin/monitoring", { cache: "no-store" })
        if (!response.ok) return
        const payload = (await response.json()) as { data?: AdminMonitoringSnapshot }
        if (disposed || !payload.data) return
        setSnapshot((current) => (isNewer(payload.data!, current) ? payload.data! : current))
      } catch {
        return
      }
    }

    function scheduleReconnect() {
      if (disposed) return
      const delay = Math.min(30_000, 1_000 * 2 ** Math.min(retries, 5))
      retries += 1
      retryTimer = setTimeout(connect, delay)
    }

    function connect() {
      if (disposed) return
      source?.close()
      source = new EventSource("/api/admin/monitoring/stream", { withCredentials: true })

      source.onopen = () => {
        if (disposed) return
        retries = 0
        setConnected(true)
      }

      source.onerror = () => {
        if (disposed) return
        setConnected(false)
        source?.close()
        source = null
        scheduleReconnect()
      }

      source.addEventListener("monitoring", (event) => {
        try {
          const next = JSON.parse((event as MessageEvent).data) as AdminMonitoringSnapshot
          if (!next.updatedAt || disposed) return
          retries = 0
          setSnapshot((current) => (isNewer(next, current) ? next : current))
          setConnected(true)
        } catch {
          return
        }
      })
    }

    void loadSnapshot()
    connect()

    return () => {
      disposed = true
      if (retryTimer) clearTimeout(retryTimer)
      source?.close()
    }
  }, [])

  return { snapshot, connected }
}
