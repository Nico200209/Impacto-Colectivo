# Impacto Colectivo — Website Reference

## Stack
- Next.js 15 (App Router) · TypeScript · TailwindCSS v4 · npm · Vercel
- `react-icons` installed (use `react-icons/md` for Material Design icons)
- No other UI libraries — all components hand-built

## Project Structure
```
app/
  globals.css       — brand tokens, all CSS animation keyframes
  layout.tsx        — lang="es", Geist Sans font, metadata
  page.tsx          — assembles Navbar + all sections

components/
  Navbar.tsx
  sections/
    Inicio.tsx      ✅
    Nosotros.tsx    ✅
    Temas.tsx       ✅
    Encuestas.tsx   🔲
    Informes.tsx    🔲
    Videos.tsx      🔲
    Contacto.tsx    🔲

lib/
  hooks.ts          — shared useInView hook (export only)

public/
  logos/
    IC_Logo.png     — main logo (used in Navbar, height 48px)
    IC_Logo.svg     — SVG version
    IC_Logo Hor.png — horizontal variant
```

## Brand Tokens
- **Teal:** `#2EBFC0` — primary color, CTAs, accents, icons
- **Dark navy:** `#1E2D3D` — headings, dark text
- **Gray:** `#6B7280` — body text, labels
- **White:** `#ffffff` — card backgrounds, default bg
- **Light gray bg:** `bg-gray-50` — used for alternating sections (Temas)

## Navbar (`components/Navbar.tsx`)
- Fixed top, `z-50`, white bg with bottom border
- Logo left · Nav links center · "Participar" outlined button right · hamburger far right
- Nav links: Inicio · Temas · Encuestas · Informes · Videos · Nosotros · Contacto
- All links are anchor links: `href="#inicio"`, `href="#temas"`, etc.
- Mobile: hamburger (≡) toggles animated dropdown with all links
- On scroll: `.navbar-scrolled` class added via JS → frosted glass effect (`rgba(255,255,255,0.85)` + `backdrop-filter: blur(12px)`)

## Animation System

### Core Rule
**All animations are triggered by IntersectionObserver** — elements start invisible and only animate when scrolled into view. This ensures animations replay correctly on Cmd+R and work for off-screen sections.

### Shared Hook (`lib/hooks.ts`)
```ts
useInView<T extends Element>(threshold = 0.2)
// Returns [ref, inView] — fires once when element enters viewport, then disconnects
```
Import in every section: `import { useInView } from "@/lib/hooks"`

### CSS Animation Classes (`app/globals.css`)
Used for text/element reveals — apply conditionally: `className={inView ? "animate-reveal" : "opacity-0"}`

| Class | Effect |
|---|---|
| `animate-reveal` | fadeSlideUp immediately |
| `animate-reveal-d1` | fadeSlideUp, 0.1s delay |
| `animate-reveal-d2` | fadeSlideUp, 0.22s delay |
| `animate-reveal-d3` | fadeSlideUp, 0.36s delay |
| `animate-reveal-d4` | fadeSlideUp, 0.5s delay |
| `animate-stat-1/2/3` | statReveal, staggered (0.3/0.45/0.6s) |
| `.navbar-scrolled` | frosted glass navbar |

### Inline Style Transitions (preferred for SVG/bars)
CSS keyframes don't reliably restart when class is toggled. Use inline `style` transitions instead:

**SVG line draw:**
```tsx
style={{
  strokeDasharray: 600,
  strokeDashoffset: inView ? 0 : 600,
  transition: "stroke-dashoffset 1.4s cubic-bezier(0.25,0.46,0.45,0.94) 0.4s",
}}
```

**Progress bars:**
```tsx
style={{
  width: inView ? `${pct}%` : "0%",
  transition: `width 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${0.7 + i * 0.15}s`,
}}
```

**Opacity fade (cards, SVG fills):**
```tsx
style={{
  opacity: inView ? 1 : 0,
  transition: `opacity 0.5s ease-out ${i * 0.09}s`,
}}
```

**Staggered card entrance (used in Temas):**
```tsx
style={{
  opacity: inView ? 1 : 0,
  transform: inView ? "translateY(0)" : "translateY(20px)",
  transition: `opacity 0.5s ease-out ${i * 0.09}s, transform 0.5s ease-out ${i * 0.09}s`,
}}
```

## Section Patterns

### Standard two-column section (Inicio, Nosotros)
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`
- Left: text content with staggered `animate-reveal-dX`
- Right: decorative visual (SVG / card panel)
- Two separate `useInView` refs: one for text, one for visual

### Full-width section with card grid (Temas)
- `bg-gray-50` background
- Header left-aligned above grid
- Grid container: `rounded-2xl border border-gray-200 bg-white overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Internal dividers via inline `borderRight` / `borderBottom` on each card based on `col = i % 3` and `row = Math.floor(i / 3)`

## Sections Status & Details

| # | ID | Label | File | Status |
|---|---|---|---|---|
| 1 | `#inicio` | Inicio | `sections/Inicio.tsx` | ✅ |
| 2 | `#nosotros` | Nosotros | `sections/Nosotros.tsx` | ✅ |
| 3 | `#temas` | Temas | `sections/Temas.tsx` | ✅ |
| 4 | `#encuestas` | Encuestas | `sections/Encuestas.tsx` | 🔲 |
| 5 | `#informes` | Informes | `sections/Informes.tsx` | 🔲 |
| 6 | `#videos` | Videos | `sections/Videos.tsx` | 🔲 |
| 7 | `#contacto` | Contacto | `sections/Contacto.tsx` | 🔲 |

### Inicio (Hero)
- Two-column: left text + right data panel card
- Right panel: "Panel de Análisis" with 3 stat chips (50 Temas, 10.2k Respuestas, 92% Activos), SVG line chart (ENE–JUL), 4 progress bars (Economía 86%, Salud 72%, Educación 65%, Energía 58%)
- Bottom stats strip: +50 Temas analizados · +10k Respuestas ciudadanas · Mensual (typewriter)
- `useCountUp` and `useTypewriter` hooks defined locally in Inicio.tsx (not shared)

### Nosotros
- Two-column: left text + right network SVG visualization
- Right: dot-grid CSS background + SVG with 6 nodes + connecting lines + 2 floating cards ("COBERTURA / 6 áreas" and "PERIODICIDAD / Mensual")
- Lines animate via `strokeDashoffset` transition; nodes and cards fade in after

### Temas
- `bg-gray-50`, 3×2 card grid
- Icons from `react-icons/md`: MdLocalGasStation, MdShoppingBasket, MdSchool, MdHome, MdMonitorHeart, MdVisibility
- Cards: icon in teal bg square + title + description
- Dividers: inline `borderRight`/`borderBottom` per cell index

## Dev Commands
```bash
npm run dev      # start dev server → localhost:3000
npm run build    # production build
npm run lint     # ESLint
```
