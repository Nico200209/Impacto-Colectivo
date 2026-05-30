# Impacto Colectivo — Website Reference

## Stack
- Next.js 16 (App Router) · TypeScript · TailwindCSS v4 · npm · Vercel
- `react-icons` installed (use `react-icons/md` for Material Design icons)
- `@supabase/supabase-js` installed — Supabase for DB + Storage
- No other UI libraries — all components hand-built

## Project Structure
```
app/
  globals.css          — brand tokens, all CSS animation keyframes
  layout.tsx           — lang="es", Geist Sans font, metadata
  page.tsx             — assembles Navbar + all sections
  api/
    survey/
      route.ts         — GET (count by surveyId), POST (submit response)
      list/route.ts    — GET active surveys from DB (public)
    informes/route.ts  — GET all informes (public)
    admin/
      auth/route.ts    — POST login, DELETE logout (sets httpOnly cookie)
      surveys/route.ts — GET/POST/PATCH/DELETE surveys (admin)
      responses/route.ts — GET all responses grouped (admin)
      informes/route.ts  — POST upload PDF, DELETE informe (admin)
  admindashboard/
    page.tsx           — main admin dashboard (protected)
    login/page.tsx     — password login page
    surveys/[id]/page.tsx — survey detail + charts + hide/delete

components/
  Navbar.tsx
  sections/
    Inicio.tsx      ✅
    Nosotros.tsx    ✅
    Temas.tsx       ✅
    Encuestas.tsx   ✅ (dynamic, fetches from DB)
    Informes.tsx    ✅ (dynamic, fetches from DB)
    Videos.tsx      🔲
    Contacto.tsx    🔲

lib/
  hooks.ts        — shared useInView hook
  supabase.ts     — exports `supabase` (anon) and `getAdminSupabase()` (service role)

middleware.ts     — protects /admindashboard/* (checks admin_session cookie)

public/
  logos/
    IC_Logo.png     — main logo (used in Navbar, height 48px)
    IC_Logo.svg     — SVG version
    IC_Logo Hor.png — horizontal variant
```

## Env Vars (`.env.local` + Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xojdrgzbvwsxrpcictcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   (legacy anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ...       (service role secret, server-side only)
ADMIN_PASSWORD=...                      (password for /admindashboard)
```

## Supabase DB Tables
- **surveys** — id (uuid), question, options (text[]), active (bool), created_at
  - RLS: public SELECT where active=true
  - Admin uses service role for all operations
- **survey_responses** — id, survey_id (uuid FK), selected_option, created_at
  - RLS: public INSERT + SELECT
- **informes** — id, title, category, published_date, pages (int), file_size, file_url, file_path, created_at
  - RLS: public SELECT
- **Storage bucket:** `informes` (public) — stores PDF files

## Admin Dashboard (`/admindashboard`)
- Protected by middleware checking `admin_session` cookie === `ADMIN_PASSWORD`
- Login page at `/admindashboard/login`
- Sections: survey overview cards → response charts → survey management table → add survey form → informes list → upload informe form
- Survey rows are clickable → `/admindashboard/surveys/[id]` (detail + charts)
- Survey toggle (eye icon) sets `active` true/false without deleting responses
- Informe upload: FormData with PDF → Supabase Storage → DB insert

## Brand Tokens
- **Teal:** `#2EBFC0` — primary color, CTAs, accents, icons
- **Dark navy:** `#1E2D3D` — headings, dark text
- **Gray:** `#6B7280` — body text, labels
- **White:** `#ffffff` — card backgrounds, default bg
- **Light gray bg:** `bg-gray-50` — alternating sections (Temas, Informes)

## Navbar (`components/Navbar.tsx`)
- Fixed top, `z-50`, white bg with bottom border
- Logo left · Nav links center · "Participar" outlined button right · hamburger far right
- Nav links order: Inicio · Nosotros · Temas · Encuestas · Informes · Videos
- All links: anchor links with smooth scroll via `scrollIntoView({ behavior: "smooth" })`
- "Participar" button → scrolls to `#encuestas`
- Mobile: hamburger toggles animated dropdown
- On scroll: `.navbar-scrolled` → frosted glass effect

## Animation System

### Core Rule
All animations triggered by IntersectionObserver — elements start invisible, animate on scroll into view, replay on Cmd+R.

### Shared Hook (`lib/hooks.ts`)
```ts
useInView<T extends Element>(threshold = 0.2)
// Returns [ref, inView] — fires once, then disconnects
```

### CSS Animation Classes (text reveals only)
`className={inView ? "animate-reveal" : "opacity-0"}`
- `animate-reveal` / `animate-reveal-d1` through `animate-reveal-d4` — staggered fadeSlideUp
- `animate-stat-1/2/3` — stat number reveal

### Inline Style Transitions (SVG, bars, cards)
```tsx
// Staggered card entrance (Encuestas, Informes, Temas)
style={{
  opacity: inView ? 1 : 0,
  transform: inView ? "translateY(0)" : "translateY(20px)",
  transition: `opacity 0.5s ease-out ${i * 0.09}s, transform 0.5s ease-out ${i * 0.09}s`,
}}
// Progress bars
style={{ width: inView ? `${pct}%` : "0%", transition: `width 0.9s cubic-bezier(...) ${delay}s` }}
// SVG line draw
style={{ strokeDasharray: 600, strokeDashoffset: inView ? 0 : 600, transition: "stroke-dashoffset 1.4s ..." }}
```

## Section Patterns

### Standard two-column (Inicio, Nosotros)
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`
- Two `useInView` refs: text + visual

### Card grid with dividers (Temas, Informes)
- Container: `rounded-2xl border border-gray-200 bg-white overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Dividers via inline style: `borderRight: col < maxCol ? "1px solid #e5e7eb" : "none"`, same for `borderBottom`

### Dynamic section with loading skeleton (Encuestas, Informes)
- Fetch on mount from public API route
- Show skeleton placeholders while loading
- Empty state message if no data

## Sections Status & Details

| # | ID | Label | File | Status |
|---|---|---|---|---|
| 1 | `#inicio` | Inicio | `sections/Inicio.tsx` | ✅ |
| 2 | `#nosotros` | Nosotros | `sections/Nosotros.tsx` | ✅ |
| 3 | `#temas` | Temas | `sections/Temas.tsx` | ✅ |
| 4 | `#encuestas` | Encuestas | `sections/Encuestas.tsx` | ✅ |
| 5 | `#informes` | Informes | `sections/Informes.tsx` | ✅ |
| 6 | `#videos` | Videos | `sections/Videos.tsx` | 🔲 |
| 7 | `#contacto` | Contacto | `sections/Contacto.tsx` | 🔲 |

### Encuestas ✅
- `bg-white`, 2-column card grid, surveys fetched from `GET /api/survey/list`
- Each `SurveyCard`: radio options, submit → `POST /api/survey`, thank-you state
- Loading skeleton shown while fetching

### Informes ✅
- `bg-gray-50`, 2-column card grid with dividers (same pattern as Temas)
- Data fetched from `GET /api/informes`
- Each card: `MdArticle` icon, category, title, metadata, "Descargar" link → PDF URL
- Loading skeleton shown while fetching

## Dev Commands
```bash
npm run dev      # start dev server → localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Pending
- Videos section (#6) — user will provide design mockup
- Contacto section (#7) — user will provide design mockup
- `package-lock.json` should be committed (Vercel needs it)
