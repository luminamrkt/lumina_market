# Lumina Market

Platform jual-beli akun Mobile Legends terpercaya.

## Struktur Proyek

```
lumina_market/
├── frontend/          # Next.js 16 (App Router) — landing page & auth
│   ├── src/
│   │   ├── app/       # Halaman (utama, login, signup)
│   │   ├── components/# UI components, sections, layout, auth
│   │   ├── hooks/     # Custom hooks
│   │   └── lib/       # Utility functions
│   ├── public/
│   └── package.json
├── backend/           # Backend service (coming soon)
├── AGENTS.md          # Panduan untuk AI agent
└── README.md
```

## Memulai

```bash
cd frontend
npm install
npm run dev        # → http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend:** *(akan ditentukan)*

## Fitur

- Landing page dengan glassmorphism UI
- Autentikasi (login/signup) — client-side validation
- Testimonial carousel, FAQ accordion, animated counters
- Responsive design (mobile-first)
