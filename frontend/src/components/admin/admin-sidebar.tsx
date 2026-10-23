"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Gamepad2,
  ShoppingCart,
  Users,
  ArrowLeft,
  ShieldCheck,
  UserCircle,
  CheckCircle2,
  StickyNote,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/login/actions"
import type { AdminIdentity } from "@/types/admin"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Gamepad2, label: "Katalog", href: "/admin/accounts" },
  { icon: ShoppingCart, label: "Pesanan", href: "/admin/orders" },
  { icon: CheckCircle2, label: "Soldout", href: "/admin/soldout" },
  { icon: StickyNote, label: "Notes", href: "/admin/notes" },
  { icon: Users, label: "Admin", href: "/admin/users" },
  { icon: UserCircle, label: "Profile", href: "/admin/profile" },
]

export default function AdminSidebar({ admin }: { admin: AdminIdentity }) {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] shrink-0 border-r border-white/10 bg-[#0a0a0f] min-h-screen flex flex-col">
      <div className="flex items-center gap-3 h-16 px-4 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold gradient-text">Admin Panel</span>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-blue-400")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <p className="truncate text-sm font-medium text-white/80">{admin.displayName}</p>
        <p className="truncate text-[11px] text-white/35">{admin.email}</p>
        <span className="mt-1.5 inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-purple-300">
          {admin.role}
        </span>
      </div>

      <div className="border-t border-white/10 p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          <span>Kembali ke Beranda</span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
