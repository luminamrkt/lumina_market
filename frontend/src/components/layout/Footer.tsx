"use client"

import { Instagram, Music2, MessageCircle, Mail } from "lucide-react"

const footerLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Katalog", href: "#categories" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#contact" },
]

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/lumina_mrkt", label: "Instagram" },
  { icon: MessageCircle, href: "https://wa.me/6282326860797", label: "WhatsApp" },
]

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#hero" className="text-xl font-bold gradient-text tracking-tight">
              Lumina Market
            </a>
            <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-xs">
              Platform terpercaya untuk jual beli akun Mobile Legends dengan proses aman, cepat, dan harga terbaik.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Navigasi</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-400 shrink-0" />
                <span>+62 823-2686-0797</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-blue-400 shrink-0" />
                <span>@lumina_mrkt</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <a href="mailto:support@mlaccountstore.com" className="hover:text-white transition-colors">
                  support@mlaccountstore.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Ikuti Kami</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl glass hover:bg-white/20 transition-colors text-white/60 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; 2026 Lumina Market. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
