import { NextResponse, type NextRequest } from "next/server"
import { BackendError, backendFetch } from "@/lib/backend"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

type RouteContext = { params: Promise<{ path: string[] }> }

async function handle(request: NextRequest, context: RouteContext) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims || data.claims.aal !== "aal2") {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Authentication required" } },
      { status: 401 }
    )
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Authentication required" } },
      { status: 401 }
    )
  }

  const { path } = await context.params
  if (!path?.length) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Route not found" } },
      { status: 404 }
    )
  }

  const targetPath = `/api/admin/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`
  const method = request.method
  let body: unknown

  if (method !== "GET" && method !== "HEAD") {
    const text = await request.text()
    if (text) {
      try {
        body = JSON.parse(text)
      } catch {
        return NextResponse.json(
          { error: { code: "invalid_request", message: "Invalid JSON body" } },
          { status: 400 }
        )
      }
    }
  }

  try {
    const upstream = await backendFetch(targetPath, {
      method,
      token: session.access_token,
      body,
      signal: request.signal,
    })

    const contentType = upstream.headers.get("content-type") ?? "application/json"
    const headers: HeadersInit = {
      "Content-Type": contentType,
      "Cache-Control": contentType.includes("text/event-stream")
        ? "no-cache, no-transform"
        : "no-store",
    }
    if (contentType.includes("text/event-stream")) {
      ;(headers as Record<string, string>)["X-Accel-Buffering"] = "no"
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    })
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: { code: "internal_error", message: "Internal server error" } },
      { status: 500 }
    )
  }
}

export const GET = handle
export const POST = handle
export const PATCH = handle
export const DELETE = handle
