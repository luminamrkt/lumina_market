import { redirect } from "next/navigation"
import { ShieldAlert } from "lucide-react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { ToastContainer } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { getAdminSession } from "@/lib/auth"
import { logoutAction } from "@/app/login/actions"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()

  if (session.status === "unauthenticated") {
    redirect("/login")
  }

  if (session.status === "mfa_required") {
    redirect("/login/mfa")
  }

  if (session.status === "forbidden") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="glass-strong rounded-3xl p-8 max-w-md w-full text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>
          <h1 className="text-lg font-semibold text-white">Akses ditolak</h1>
          <p className="mt-2 text-sm text-white/50">
            Akun ini tidak memiliki akses admin atau aksesnya sudah dinonaktifkan.
          </p>
          <form action={logoutAction} className="mt-6">
            <Button type="submit" className="w-full">
              Keluar
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <AdminSidebar admin={session.admin} />
      <div className="flex-1 min-w-0">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
      <ToastContainer />
    </div>
  )
}
