import "server-only"

export class BackendError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = "BackendError"
    this.status = status
    this.code = code
  }
}

function getConfig() {
  const baseUrl = process.env.BACKEND_URL
  const internalKey = process.env.INTERNAL_API_KEY
  if (!baseUrl || !internalKey) {
    throw new Error("Backend is not configured")
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), internalKey }
}

export async function backendFetch(
  path: string,
  options: {
    method?: string
    token?: string
    body?: unknown
    signal?: AbortSignal
  } = {}
) {
  const { baseUrl, internalKey } = getConfig()
  const headers: Record<string, string> = {
    "X-Internal-Key": internalKey,
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
    signal: options.signal,
  })

  if (!response.ok) {
    let code = "request_failed"
    let message = "Request failed"
    try {
      const payload = (await response.json()) as { error?: { code?: string; message?: string } }
      code = payload.error?.code ?? code
      message = payload.error?.message ?? message
    } catch {
      throw new BackendError(response.status, code, message)
    }
    throw new BackendError(response.status, code, message)
  }

  return response
}

export async function backendJson<T>(
  path: string,
  options: {
    method?: string
    token?: string
    body?: unknown
    signal?: AbortSignal
  } = {}
) {
  const response = await backendFetch(path, options)
  return (await response.json()) as T
}
