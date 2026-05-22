# PROJECT STATE
Last updated: 2026-05-21

---

## What this project is

A landing page for **Наталья Сиголович**, a parenting consultant specialising in
emotional-intelligence approaches for parents of children aged 2-9.
The site is bilingual: Russian (default, LTR) and Hebrew (RTL).
Reference design: Breathpod.com — fullscreen atmospheric photo, editorial typography,
immersive and emotionally resonant, not corporate.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + inline styles for custom values |
| Animation | GSAP 3.15.0 + @gsap/react 2.1.2 |
| Fonts | Cormorant Garamond (Google Fonts via next/font/google) |
| Runtime | React 19.2.4 |
| Dev server | Turbopack (via `./node_modules/.bin/next dev`) |

---

## Every file and what it does

### Source files (the ones that matter)

**`components/HeroSection.tsx`**
The only component built so far. The entire hero section:
- Fullscreen background image (`/public/images/hero.png`) via `next/image` with `priority` and `fill`
- Two-zone layout: nav bar (top) and text block (bottom)
- Language switcher state (`useState<'ru' | 'he'>`) lives here — no external lib
- GSAP entrance animations on mount (nav slide-down, headline/sub/CTA fade-up)
- Respects `prefers-reduced-motion`
- Fully bilingual: all copy, `dir` attribute, `lang` attribute, nav label, skip link
- Skip-to-content link (visually hidden, visible on focus)

**`app/page.tsx`**
Minimal — just imports and renders `<HeroSection />` inside `<main>`.

**`app/layout.tsx`**
Sets `<html lang="ru">`, imports `globals.css`, sets page `<title>` and `<meta description>`.
No Geist font (removed from scaffold). No dark mode.

**`app/globals.css`**
Three things only:
1. `@import "tailwindcss"` (Tailwind v4 syntax)
2. `box-sizing: border-box` reset
3. `.focus-ring` class — custom focus ring used across all interactive elements

**`next.config.ts`** — default scaffold, no custom config yet

**`tsconfig.json`** — default, `@/*` import alias configured

**`postcss.config.mjs`** — Tailwind v4 PostCSS plugin

**`.claude/launch.json`**
Tells the Claude Code preview tool how to start the dev server:
`node ./node_modules/.bin/next dev --port 3001`
(Port 3001 because 3000 was already in use on this machine.)

### Assets

**`public/images/hero.png`**
The hero background photo. 2752 × 1536px, PNG, 7.6 MB.
AI-generated image of mother and daughter holding hands at golden sunset.
Served at `objectPosition: 'center 30%'` so the hands stay centred on mobile.

---

## Current design decisions

### Colors

| Token | Value | Used for |
|---|---|---|
| Warm white | `#F5F0E8` | All text on dark, CTA button fill, logo |
| Dark text | `#1a1710` | Text on light CTA button |
| Subheadline | `#F5F0E8` at 68% opacity | Supporting copy |
| CTA button bg | `#F5F0E8` (filled) | Primary hero CTA |
| CTA hover bg | `#ede8dc` | Hover state of primary CTA |
| Focus ring | `#C4856A` (terracotta) | All interactive elements |
| Nav link inactive | `#F5F0E8` at 45% opacity | Lang switcher inactive state |
| Lang pill active bg | `rgba(245,240,232,0.18)` | Active tab in language pill |
| Lang pill border | `rgba(245,240,232,0.35)` | Pill container outline |
| Ghost CTA border | `rgba(245,240,232,0.7)` at 1.5px | Nav ghost pill CTA |
| Top gradient | `rgba(12,10,6,0.5)` → transparent | Nav protection overlay |
| Bottom gradient | 5-stop, transparent → `rgba(12,10,6,1)` | Text zone backing |

### Typography

| Element | Font | Size | Weight | Other |
|---|---|---|---|---|
| Headline | Cormorant Garamond | `clamp(2rem,7.5vw,2.6rem)` mob / `clamp(2rem,4.2vw,3.8rem)` desk | 300 | line-height 1.06, letter-spacing -0.02em |
| Subheadline | system-ui | `0.88rem` mob / `clamp(0.82rem,1.3vw,0.95rem)` desk | 400 | line-height 1.6, opacity 0.68 |
| Logo | system-ui | 1.05rem | 400 | letter-spacing 0.06em |
| Nav links | system-ui | 1rem | 300 | letter-spacing 0.05em, opacity 0.9 |
| Nav ghost CTA | system-ui | 0.82rem | 400 | letter-spacing 0.08em |
| Hero CTA | system-ui | 0.95rem | 500 | letter-spacing 0.06em |
| Lang switcher | system-ui | 0.75rem | 400 | letter-spacing 0.1em |

Cormorant Garamond is loaded via `next/font/google` at module level (weight 300,
subsets latin + cyrillic). No Hebrew subset — Hebrew text falls back to system fonts
which is correct since Cormorant does not cover the Hebrew script.

### Spacing

| Location | Desktop | Mobile |
|---|---|---|
| Nav padding | 28px 52px | 20px 24px |
| Bottom text block padding-bottom | 72px | 48px |
| Headline max-width | 700px | 100% |
| Subheadline max-width | 440px | 300px |
| CTA button padding | 18px 44px | 18px 32px |
| CTA max-width | unrestricted | 320px (w-[calc(100%-48px)]) |
| Gap between nav links | 44px | hidden |
| Lang pill inner padding | 6px 16px per option | same |

### Layout structure (z-index stack, bottom to top)

```
z-0   <Image>           — fullscreen background photo
z-1   depth gradient    — transparent → near-black (inset-0)
z-10  top vignette      — nav protection, height 130px
z-20  bottom text block — headline, subheadline, CTA
z-50  nav bar           — logo, links, pill CTA, lang toggle
z-200 skip link         — visually hidden until focused
```

### Animation timings (GSAP, mount-only, dependencies: [])

| Element | y from | Opacity | Duration | Delay |
|---|---|---|---|---|
| Nav | -12 → 0 | 0 → 1 | 0.7s, power2.out | 0.1s |
| Headline | 24 → 0 | 0 → 1 | 1.0s, power3.out | 0.35s |
| Subheadline | 16 → 0 | 0 → 1 | 0.7s, power3.out | 0.55s |
| CTA button | 20 → 0 | 0 → 1 | 0.65s, power3.out | 0.65s |

All animations are skipped if `prefers-reduced-motion: reduce` is set.

---

## What is working correctly (verified in browser preview)

- Fullscreen hero photo renders, `objectPosition: center 30%` keeps hands centred
- Both languages display correctly:
  - RU: Cyrillic copy, LTR, logo left / pill center / hamburger right on mobile
  - HE: Hebrew copy, `dir="rtl"` auto-flips all flex layouts (logo right, hamburger left)
- Language pill toggle: single pill (not doubled), active state highlighted, correct per-breakpoint visibility
- Hamburger icon (3 lines, 22px wide, 1.5px height, 5px gap) visible on mobile only
- Desktop nav links hidden on mobile, ghost CTA hidden on mobile
- Filled CTA button (`#F5F0E8` background, `#1a1710` dark text, box-shadow) visible against dark gradient
- Focus ring (`#C4856A`, 2px, offset 3px) on all interactive elements via `.focus-ring` CSS class
- Skip-to-content link visible on keyboard focus
- GSAP entrance animations play on load (staggered)
- TypeScript: zero type errors (confirmed with `tsc --noEmit`)
- Dev server running at `http://localhost:3001`

---

## What we were in the middle of doing

The hero section went through multiple design iterations in one session:

1. Initial build — centered layout, terracotta accent line, ghost CTA
2. Redesign — two-zone layout (nav bar + bottom text block), removed centered content
3. Typography pass — nav size increase, pill CTA in nav, deeper gradient
4. Current state — filled CTA button, pill language toggle, hamburger, correct copy

The last set of changes (current state) was fully applied and visually confirmed
in the preview browser. No work was left mid-flight.

---

## What still needs to be done

### Remaining sections (none exist yet — only hero is built)

- **Обо мне / אודות** — About section: Natasha's story, photo, credentials
- **Услуги / שירותים** — Services section: consultation types, formats, pricing
- **Подход / גישה** — Approach section: emotional intelligence methodology explainer
- **Отзывы / המלצות** — Testimonials: parent quotes, ideally with photos
- **Вопросы / שאלות** — FAQ accordion
- **Контакты / צרו קשר** — Contact section (`id="contact"`) — this is what all CTAs link to

### Nav functionality

- Hamburger menu has no open/close behaviour yet — purely visual
- All nav links href="#" are placeholders — need real section IDs once sections are built
- Mobile drawer/overlay menu not started

### Missing infrastructure

- No `#contact` section exists — CTA buttons link to it but it's absent
- No form or booking integration
- No analytics
- No SEO beyond basic `<title>` and `<meta description>`
- No `sitemap.xml`, no `robots.txt`
- No favicon beyond the default Next.js one
- No Open Graph / social sharing tags
- No deployment configuration (Vercel, etc.)

### Nice-to-have improvements identified

- The `npm run dev` script fails because `next` is not in system PATH —
  must be run as `./node_modules/.bin/next dev` (see workaround below)
- Add `"dev": "node ./node_modules/.bin/next dev"` to package.json scripts
  to make `npm run dev` work reliably on this machine
- Page title should switch language when HE is active (currently hardcoded RU in layout.tsx)
- Consider moving lang state up to a context if it needs to persist across sections

---

## Problems and workarounds discovered

### 1. Directory name breaks `create-next-app`
**Problem:** The working directory is `/Users/admin/Natasha 21:05/` — the colon and space
violate npm package naming rules. `npx create-next-app@latest .` refused to run.
**Workaround:** Created the project in `/tmp/natasha-site`, then `cp -r` to the real directory.
Then ran `npm install` again because copying `node_modules` breaks symlinks in `.bin/`.

### 2. `npm run dev` fails — `next` not in PATH
**Problem:** `npm run dev` resolves scripts via `node_modules/.bin`, but on this machine
the shell does not add it to PATH when npm runs the script. The error was
`sh: next: command not found`.
**Workaround:** Run the server directly: `./node_modules/.bin/next dev`
The `.claude/launch.json` uses `node ./node_modules/.bin/next dev` which works correctly.

### 3. Tailwind `hidden` vs `inline-flex` conflict on language pill
**Problem:** `LangPill` was defined as a React component inside `HeroSection` and had
`inline-flex` hardcoded in its own `className`. When the caller passed `hidden md:inline-flex`,
the component's own `inline-flex` would win over `hidden` in the CSS cascade
(same specificity, source order determines winner — and Tailwind's order is not guaranteed).
The result: both mobile and desktop pills were visible simultaneously.
**Workaround:** Converted `LangPill` from a React component to a plain render function (`langPill()`).
Removed `inline-flex` from the function's own className entirely.
Callers now pass the full display+visibility string:
- Mobile: `langPill('inline-flex md:hidden')`
- Desktop: `langPill('hidden md:inline-flex')`
This gives callers full control over the display property with no conflicts.

### 4. `next/font/google` with Cyrillic subset
**Note:** Cormorant Garamond is loaded with `subsets: ['latin', 'cyrillic']`.
There is no Hebrew subset available for this font — Hebrew text automatically falls back
to the system serif/sans stack, which is correct behaviour since Cormorant does not
include Hebrew glyphs.

### 5. Dev server port conflict
**Note:** Port 3000 was occupied by another process (PID 22895) on this machine.
Next.js automatically moved to port 3001. All references use 3001.

### 6. `tsc` not in system PATH
**Problem:** `tsc` binary not globally installed.
**Workaround:** `./node_modules/.bin/tsc --noEmit` — confirmed zero errors.

---

## Commit history

```
72c475a  Add HeroSection with bilingual nav, fullscreen photo, and GSAP animations
8fb4de9  Initial commit from Create Next App
```

Note: several design iterations after `72c475a` are uncommitted working tree changes.
Run `git add -A && git commit` before any major restructuring.
