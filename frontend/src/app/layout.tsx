import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ErrorBoundary from "@/components/shared/ErrorBoundary"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Lumina Market - Jual Beli Akun Mobile Legends Terpercaya",
  description:
    "Platform jual beli akun Mobile Legends terpercaya. Ribuan akun tersedia dari akun murah hingga akun sultan. Proses aman, cepat, dan harga terbaik.",
  keywords: [
    "Mobile Legends",
    "jual akun ML",
    "beli akun Mobile Legends",
    "akun sultan ML",
    "akun mythic",
    "Lumina Market",
  ],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Lumina Market - Jual Beli Akun Mobile Legends",
    description:
      "Temukan akun Mobile Legends impianmu. Aman, cepat, dan terpercaya.",
    siteName: "Lumina Market",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
