"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [error, setError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/20",
          className
        )}
        {...props}
      >
        {src && !error ? (
          <Image
            src={src}
            alt={alt || ""}
            fill
            sizes="48px"
            className="object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center gradient-bg text-white text-sm font-semibold">
            {fallback ? fallback.charAt(0).toUpperCase() : "?"}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
