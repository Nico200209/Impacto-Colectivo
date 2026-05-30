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
    videos/route.ts    — GET all videos (public, uses getAdminSupabase to bypass RLS)
    admin/
      auth/route.ts    — POST login, DELETE logout (sets httpOnly cookie)
      surveys/route.ts — GET/POST/PATCH/DELETE surveys (admin)
      responses/route.ts — GET all responses grouped (admin)
      informes/route.ts  — POST upload PDF, DELETE informe (admin)
      videos/route.ts    — GET/POST (YouTube URL or file upload)/DELETE videos (admin)
  admindashboard/
    page.tsx           — main admin dashboard (protected)
    login/page.tsx     — password login page
    surveys/[id]/page.tsx — survey detail + charts + hide/delete

components/
  Navbar.tsx
  sections/
    Inicio.tsx         ✅
    Impacto.tsx        ✅  (id="impacto", nav label "Impacto" — about the org, SVG network visual)
    Temas.tsx          ✅
    Encuestas.tsx      ✅ (dynamic, fetches from DB)
    Informes.tsx       ✅ (dynamic, fetches from DB)
    Videos.tsx         ✅ (dynamic, fetches from DB, YouTube + file upload)
    QuienesSomos.tsx   ✅ (id="nosotros", nav label "Nosotros" — pills + stats)
    Contacto.tsx       🔲

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

## page.tsx section order
```tsx
<Navbar />
<Inicio />       {/* #inicio */}
<Impacto />      {/* #impacto — imported from sections/Impacto.tsx */}
<Temas />        {/* #temas */}
<Encuestas />    {/* #encuestas */}
<Informes />     {/* #informes */}
<Videos />       {/* #videos */}
<QuienesSomos /> {/* #nosotros — imported from sections/QuienesSomos.tsx */}
{/* Contacto next */}
```

## Navbar links (components/Navbar.tsx)
Order: Inicio · Impacto · Temas · Encuestas · Informes · Videos · Nosotros
- "Participar" button → scrolls to `#encuestas`
- Fixed top, `z-50`, white bg with bottom border
- Mobile: hamburger toggles animated dropdown
- On scroll: `.navbar-scrolled` → frosted glass effect
- All links smooth scroll via `scrollIntoView({ behavior: "smooth" })`

## Env Vars (`.env.local` + Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xojdrgzbvwsxrpcictcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   (legacy JWT anon key — NOT the new sb_publishable_ format)
SUPABASE_SERVICE_ROLE_KEY=eyJ...       (service role secret, server-side only)
ADMIN_PASSWORD=...                      (password for /admindashboard)
```

## Supabase DB Tables
- **surveys** — id (uuid), question, options (text[]), active (bool), created_at
  - RLS: public SELECT where active=true; admin uses service role
- **survey_responses** — id, survey_id (uuid FK), selected_option, created_at
  - RLS: public INSERT + SELECT
- **informes** — id, title, category, published_date, pages (int), file_size, file_url, file_path, created_at
  - RLS: public SELECT
- **videos** — id, title, category, published_date, duration, video_url, file_path (nullable), created_at
  - RLS: enabled, policy allows anon SELECT. Public API uses service role to bypass.
  - `video_url`: either a YouTube URL or a Supabase Storage public URL
  - `file_path`: null for YouTube videos, set for uploaded files
- **Storage bucket `informes`** (public) — stores PDF files
- **Storage bucket `videos`** (public) — stores uploaded video files

## Admin Dashboard (`/admindashboard`)
- Protected by middleware checking `admin_session` cookie === `ADMIN_PASSWORD`
- Login page at `/admindashboard/login`
- Section order: Encuestas overview → response charts → survey management table → add survey form → Informes publicados → Publicar informe → Videos publicados → Agregar video
- Survey rows clickable → `/admindashboard/surveys/[id]` (detail + charts + toggle + delete)
- Survey toggle (eye icon): sets `active` true/false, preserves responses
- Informe upload: FormData with PDF → Supabase Storage `informes` bucket → DB insert
- Video add: toggle between "URL de YouTube" and "Subir archivo" modes
  - YouTube: POST JSON `{ title, category, published_date, duration, video_url }`
  - File: POST FormData → Supabase Storage `videos` bucket → DB insert
- Video delete: also removes from storage if `file_path` is set

## Brand Tokens
- **Teal:** `#2EBFC0` — primary color, CTAs, accents, icons
- **Dark navy:** `#1E2D3D` — headings, dark text
- **Gray:** `#6B7280` — body text, labels
- **White:** `#ffffff` — card backgrounds, default bg
- **Light gray bg:** `bg-gray-50` — alternating sections

## Animation System

### Core Rule
All animations triggered by IntersectionObserver — elements start invisible, animate on scroll into view.

### Shared Hook (`lib/hooks.ts`)
```ts
useInView<T extends Element>(threshold = 0.2)
// Returns [ref, inView] — fires once, then disconnects
```

### CSS Animation Classes (text reveals only)
`className={inView ? "animate-reveal" : "opacity-0"}`
- `animate-reveal` / `animate-reveal-d1` through `animate-reveal-d4` — staggered fadeSlideUp

### Inline Style Transitions (cards, pills, stats)
```tsx
style={{
  opacity: inView ? 1 : 0,
  transform: inView ? "translateY(0)" : "translateY(20px)",
  transition: `opacity 0.5s ease-out ${i * 0.09}s, transform 0.5s ease-out ${i * 0.09}s`,
}}
```

## Section Patterns

### Standard two-column (Inicio, Impacto, QuienesSomos)
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`
- Two `useInView` refs: text + visual

### Card grid with dividers (Temas, Informes)
- Container: `rounded-2xl border border-gray-200 bg-white overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Dividers via inline style: `borderRight`/`borderBottom` based on col/row position

### Dynamic section with loading skeleton (Encuestas, Informes, Videos)
- Fetch on mount from public API route
- Show skeleton placeholders while loading
- Empty state message if no data

## Sections Status

| # | ID | Nav Label | File | Status |
|---|---|---|---|---|
| 1 | `#inicio` | Inicio | `sections/Inicio.tsx` | ✅ |
| 2 | `#impacto` | Impacto | `sections/Impacto.tsx` | ✅ |
| 3 | `#temas` | Temas | `sections/Temas.tsx` | ✅ |
| 4 | `#encuestas` | Encuestas | `sections/Encuestas.tsx` | ✅ |
| 5 | `#informes` | Informes | `sections/Informes.tsx` | ✅ |
| 6 | `#videos` | Videos | `sections/Videos.tsx` | ✅ |
| 7 | `#nosotros` | Nosotros | `sections/QuienesSomos.tsx` | ✅ |
| 8 | `#contacto` | Contacto | `sections/Contacto.tsx` | 🔲 |

### Videos ✅
- `bg-white`, 2-column standalone card grid (not connected with dividers)
- Each card: dark thumbnail (YouTube img or dark grid pattern), teal play button, category badge, duration badge, title, date
- YouTube → clicking opens YouTube in new tab
- Self-hosted → clicking opens modal with `<video controls autoPlay>`
- Loading skeleton shown while fetching

### QuienesSomos ✅ (file: `sections/QuienesSomos.tsx`, id: `#nosotros`)
- `bg-gray-50`, standard 2-column layout
- Left: teal eyebrow, h2, blockquote with teal left border, paragraph
- Right: "Lo que nos define" label, pill tags (rounded-full border), 2×2 stats grid
- Pills: Independientes, Basados en datos, Participación ciudadana, Perspectiva joven, Sin agenda partidaria
- Stats: 2024/Año de fundación, RD/República Dominicana, 100%/Contenido independiente, Abierto/Acceso libre a informes

## Dev Commands
```bash
npm run dev      # start dev server → localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Pending
- Contacto section (#8) — user will provide design mockup
- Add all env vars to Vercel for production deployment
