import { Gamepad2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg animate-pulse">
        <Gamepad2 className="h-6 w-6 text-white" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-5 w-40 rounded-full bg-white/10 animate-pulse" />
        <div className="h-3 w-56 rounded-full bg-white/5 animate-pulse" />
      </div>
    </div>
  )
}
