# Impacto Colectivo — Website Reference

## Stack
- Next.js 15 (App Router) · TypeScript · TailwindCSS v4 · npm · Vercel

## Architecture
One-page site. Navbar links are anchor links (`#section-id`). All sections live in `components/sections/`. Page assembly is in `app/page.tsx`.

## Brand
- **Teal:** `#2EBFC0` (`text-[#2EBFC0]`, `bg-[#2EBFC0]`)
- **Dark navy:** `#1E2D3D`
- **Gray body text:** `#6B7280`
- **Logo:** `/public/logos/IC_Logo.png`

## Sections

| # | ID           | Label      | Component                              | Status   |
|---|--------------|------------|----------------------------------------|----------|
| 1 | `#inicio`    | Inicio     | `components/sections/Inicio.tsx`       | ✅ Done  |
| 2 | `#nosotros`  | Nosotros   | `components/sections/Nosotros.tsx`     | ✅ Done  |
| 3 | `#temas`     | Temas      | `components/sections/Temas.tsx`        | ✅ Done  |
| 4 | `#encuestas` | Encuestas  | `components/sections/Encuestas.tsx`    | 🔲 Pending |
| 5 | `#informes`  | Informes   | `components/sections/Informes.tsx`     | 🔲 Pending |
| 6 | `#videos`    | Videos     | `components/sections/Videos.tsx`       | 🔲 Pending |
| 7 | `#contacto`  | Contacto   | `components/sections/Contacto.tsx`     | 🔲 Pending |

## Navbar
- File: `components/Navbar.tsx`
- Desktop: full links + "Participar" outlined button
- Mobile: hamburger toggles dropdown
- Scrolled state: frosted glass via `.navbar-scrolled` class

## Animations (defined in `app/globals.css`)
- `.animate-reveal`, `.animate-reveal-d1` → `.animate-reveal-d4` — fade + slide up on load
- `.animate-draw-line` — SVG stroke-dashoffset chart line draw
- `.animate-chart-fill` — fade in chart area fill
- `.animate-bar`, `.animate-bar-1` → `.animate-bar-4` — progress bar grow (uses `--bar-width` CSS var)
- `.animate-stat-1` → `.animate-stat-3` — stat number fade in
- `.navbar-scrolled` — frosted glass navbar on scroll
