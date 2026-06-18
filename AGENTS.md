# Lumina Market — Panduan untuk AI Agent

## Ringkasan Proyek

Lumina Market adalah landing page **Next.js 16** (App Router) untuk marketplace akun Mobile Legends (Indonesia). Dark-themed, glassmorphism style, semua konten hardcoded (static/mock data). Belum ada backend.

## Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 16.2.7 | Framework (App Router) |
| React | 19.2.4 | UI Library |
| TypeScript | ^5 | Bahasa |
| Tailwind CSS | ^4 | Styling (via `@import "tailwindcss"`) |
| Framer Motion | ^12 | Animasi |
| Lucide React | ^0.510 | Ikon |
| class-variance-authority | ^0.7 | UI variants (Button, Badge) |
| clsx + tailwind-merge | ^2, ^3 | Class utility (`cn()`) |

## Struktur Folder

```
project/
├── frontend/               ← Semua source frontend
│   ├── src/
│   │   ├── app/            ← App Router: layout.tsx, page.tsx, auth/*
│   │   ├── components/
│   │   │   ├── ui/         ← UI primitives (Button, Card, Badge, Input, Sheet, Avatar, Label)
│   │   │   ├── layout/     ← Navbar, Footer
│   │   │   ├── sections/   ← Hero, Statistics, Categories, WhyChooseUs, PremiumAccounts, Process, Testimonials, FAQ, CTA, DevelopmentBanner, WelcomeModal
│   │   │   ├── auth/       ← AuthLayout, PasswordInput, PasswordStrength, SocialButtons
│   │   │   └── shared/     ← ErrorBoundary, SectionWrapper
│   │   ├── hooks/          ← useScrollPosition
│   │   └── lib/            ← utils.ts (cn function)
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/                ← Kosong (placeholder untuk backend service)
├── README.md
└── AGENTS.md
```

## Aturan Impor

Gunakan **absolute path** dengan alias `@/` yang mengarah ke `./src/`:

```ts
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Navbar from "@/components/layout/Navbar"
import { useScrollPosition } from "@/hooks/useScrollPosition"
```

## Desain UI & Komponen

### Tema

- **Background**: `#0a0a0f` (dark)
- **Primary**: `#3b82f6` (biru) → `#8b5cf6` (ungu) — gradien signature
- **Glassmorphism**: `backdrop-filter: blur(12px)` + `border: 1px solid rgba(255,255,255,0.1)`
- **Border radius**: `xl` (12px) button/input, `2xl` (16px) card, `full` badge/avatar

### Utility Classes Kustom (dari `globals.css`)

| Class | Efek |
|-------|------|
| `glass` | Background transparan + blur + border |
| `glass-strong` | Lebih solid dengan box-shadow |
| `gradient-text` | Gradien biru-ungu untuk teks (`bg-clip: text`) |
| `gradient-bg` | Gradien biru-ungu untuk background |
| `gradient-bg-hover` | Versi lebih gelap untuk hover |
| `gradient-border` | Border gradien via pseudo-element `::before` |

### Keyframes Tersedia

- `float` / `float-delayed` → translateY ±20px
- `glow` → box-shadow blue↔purple
- `pulseSlow` → opacity 0.4↔0.8

### Pola Layout

- Container: `container mx-auto px-4 sm:px-6 lg:px-8`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4`
- Responsive: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Text: progresif `text-3xl sm:text-4xl lg:text-5xl`

### Pola Animasi

**Scroll-triggered entrance** (paling umum):

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: i * 0.1 }}
/>
```

**Staggered container + item** (Hero, Auth):

```tsx
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }
const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
```

**AnimatePresence** (carousel, modal, banner, menu):

```tsx
<AnimatePresence mode="popLayout">
  {condition && <motion.div key={key} initial={} animate={} exit={} />}
</AnimatePresence>
```

### State Management

- **Tidak ada** external state (no Redux/Zustand)
- Hanya `useState` lokal + 1 `useContext` (Sheet) + `localStorage` (WelcomeModal)
- 1 custom hook: `useScrollPosition` → `{ scrollY, isScrolled }`

## Halaman

| Route | File | Deskripsi |
|-------|------|-----------|
| `/` | `src/app/page.tsx` | Landing page: Navbar, Hero, Statistics, Categories, WhyChooseUs, PremiumAccounts, Process, Testimonials, FAQ, CTA, Footer |
| `/auth/login` | `src/app/auth/(auth)/login/page.tsx` | Form login (email + password) |
| `/auth/signup` | `src/app/auth/(auth)/signup/page.tsx` | Form registrasi (username, email, password, confirm) |

## Catatan Penting

- Bahasa: **Indonesia**
- Belum ada backend — semua data **hardcoded** (testimonial, akun, FAQ, dll)
- Belum ada API calls
- Auth hanyalah client-side form validation, tanpa integrasi nyata
- `@radix-ui/react-accordion` ter-install tapi **tidak dipakai** (FAQ pakai CSS grid manual)
- Tailwind v4 syntax: `@import "tailwindcss"` di globals.css, bukan `@tailwind base/components/utilities`
