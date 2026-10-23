export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return "Baru saja"
  if (diffMin < 60) return `${diffMin} menit lalu`
  if (diffHr < 24) return `${diffHr} jam lalu`
  if (diffDay < 7) return `${diffDay} hari lalu`
  return formatDate(dateStr)
}

export function maskEmail(email?: string): string {
  if (!email) return "***"
  const [name, domain] = email.split("@")
  if (!domain) return email
  return `${name.slice(0, 3)}***@${domain}`
}

export function maskPassword(): string {
  return "********"
}

export function maskGameId(id?: string): string {
  if (!id) return "****"
  if (id.length <= 4) return id
  return `${"*".repeat(id.length - 4)}${id.slice(-4)}`
}
