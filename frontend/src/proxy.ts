import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

function getEnv(name: "SUPABASE_URL" | "SUPABASE_PUBLISHABLE_KEY") {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not configured`)
  }
  return value
}

function buildCsp(nonce?: string) {
  const isProduction = process.env.NODE_ENV === "production"
  const scriptSrc = nonce
    ? `'self' 'nonce-${nonce}' 'strict-dynamic'${isProduction ? "" : " 'unsafe-eval'"}`
    : `'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`
  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ]
  if (isProduction) {
    directives.push("upgrade-insecure-requests")
  }
  return directives.join("; ")
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isSensitive = pathname.startsWith("/admin") || pathname.startsWith("/login")
  const nonce = isSensitive ? crypto.randomUUID().replace(/-/g, "") : undefined
  const requestHeaders = new Headers(request.headers)
  if (nonce) {
    requestHeaders.set("x-nonce", nonce)
    requestHeaders.set("Content-Security-Policy", buildCsp(nonce))
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  function secure<T extends NextResponse>(nextResponse: T) {
    nextResponse.headers.set("Content-Security-Policy", buildCsp(nonce))
    return nextResponse
  }

  if (!isSensitive) {
    return secure(response)
  }

  const supabase = createServerClient(
    getEnv("SUPABASE_URL"),
    getEnv("SUPABASE_PUBLISHABLE_KEY"),
    {
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value)
          })
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  function redirectTo(path: string) {
    const redirectResponse = secure(NextResponse.redirect(new URL(path, request.url)))
    response.headers.getSetCookie().forEach((cookie) => {
      redirectResponse.headers.append("set-cookie", cookie)
    })
    for (const name of ["cache-control", "expires", "pragma"]) {
      const value = response.headers.get(name)
      if (value) redirectResponse.headers.set(name, value)
    }
    return redirectResponse
  }

  if (pathname.startsWith("/admin")) {
    if (!claims) {
      return redirectTo("/")
    }
    if (claims.aal !== "aal2") {
      return redirectTo("/login/mfa")
    }
  }

  if (pathname === "/login/mfa") {
    if (!claims) {
      return redirectTo("/login")
    }
    if (claims.aal === "aal2") {
      return redirectTo("/admin")
    }
    return secure(response)
  }

  if (pathname === "/login" && claims) {
    return redirectTo(claims.aal === "aal2" ? "/admin" : "/login/mfa")
  }

  return secure(response)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
