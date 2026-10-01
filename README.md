# Hitomi — Bridal Makeup & Hair Artist

Marketing site and SEO content platform for **Hitomi Landazabal**, a bridal makeup artist and wedding hairstylist based in **Sapporo, Hokkaido, Japan**. Over 12 years of bridal experience, trained at Belle e Poque, working in both English and Japanese.

The site's job is to win international couples planning a destination wedding in Japan — brides who are searching in English, cannot easily vet a Japanese-language artist, and need to book from abroad months ahead.

| | |
|---|---|
| **Live site** | **https://www.makeupbyhitomi.com** |
| **Instagram** | [@hitomi.l.s_sapporo](https://www.instagram.com/hitomi.l.s_sapporo/) |
| **Service area** | Sapporo & Hokkaido, travel across Japan on request |
| **Hosting** | Vercel |

---

## How the site works

There is **no booking engine and no contact form**. Every conversion path on the site ends in an Instagram DM — that is deliberate: it is where the client already talks to brides, it needs no backend, and it means the whole site is static.

The funnel is:

1. A bride searches something like *"english speaking makeup artist japan"* and lands on a **blog article**.
2. The article establishes expertise in Hitomi's own voice, then hands off to the **services** page (transparent pricing, no "contact for quote" wall) or the **portfolio**.
3. Every page ends in an Instagram CTA. Bookings are asked for **3+ months ahead**.

Because of this, the two things that actually matter in this repo are **SEO metadata correctness** and **the blog content**. Treat changes to `src/lib/metadata.ts` and `src/content/blog/` as the high-risk edits.

## Pages

| Route | What it does |
|---|---|
| `/` | Magazine-style hero with photo rotator, intro, wave-bend promise section, services preview, featured gallery, Google testimonials, Instagram CTA |
| `/services` | All four services with real prices and add-ons |
| `/portfolio` | 77-image gallery — GSAP ScrollTrigger marquee with lightbox |
| `/about` | Artist bio, training, languages |
| `/blog` | Article index |
| `/blog/[slug]` | Article page (MDX), statically generated per slug |
| `/contact` | Instagram DM as primary contact, location, hours, booking lead-time note |
| `/sitemap.xml`, `/robots.txt` | Generated at build time from the blog directory |

## Services & pricing

Pricing lives in `src/data/services.ts` and is rendered straight to the page — edit it there, never in the component.

| Service | Price |
|---|---|
| Bridal Hair & Makeup — At Salon | ¥12,000〜 |
| Bridal Hair & Makeup — At Hotel (artist travels to you) | ¥22,000〜 |
| Special Occasion Makeup | On request |
| Special Occasion Hairstyling | On request |

Add-ons: travel outside Sapporo (+¥15,000〜¥40,000), early-morning surcharge, bridesmaid makeup/hair. All prices are starting prices — the final quote follows a consultation.

## Content

**Blog — 11 articles** in `src/content/blog/*.mdx`. Frontmatter (`title`, `description`, `date`, `category`, `tags`, `featured`, `coverAlt`) is parsed by `gray-matter` in `src/lib/blog.ts`; reading time is computed, not authored. Adding a `.mdx` file is all that's needed — the index, sitemap and static params pick it up automatically.

| Article | Date |
|---|---|
| Bridal beauty trends 2026: nostalgia and modern expression | 2026-05 |
| The "Lived-In" Bridal Look: Glowing Skin & Boho-Vintage Elegance | 2026-05 |
| Modern Minimalist Bridal Makeup | 2026-04 |
| Bridal Makeup Trends: Frosted Shimmer, Smoky Wing & Glass Skin | 2026-04 |
| How to Plan Your Wedding Makeup in Japan as a Foreigner | 2025-06 |
| Destination Wedding in Hokkaido: A Beauty Guide for International Couples | 2025-05 |
| Finding an English-Speaking Makeup Artist for Your Wedding in Japan | 2025-05 |
| What to Expect from a Bridal Makeup Trial in Japan | 2025-04 |
| Getting Married in Japan as a Foreigner: Complete Beauty Planning Guide | 2025-03 |
| Bridal Makeup for Asian Features | 2025-03 |
| Best Wedding Venues in Sapporo: A Guide for International Couples | 2025-02 |

Articles are written in the client's first-person voice and are an E-E-A-T signal, not filler — keep that voice when editing.

**Portfolio — 77 images** in `src/data/portfolio.ts`, categorised `bridal-makeup` (48), `special-occasion` (18), `hairstyling` (11). Every entry carries explicit `width`/`height` (CLS) and a descriptive, location-bearing `alt` (image SEO). Both are required.

**Testimonials** in `src/data/testimonials.ts` are real Google reviews and each links back to the Google Maps listing so they can be verified. Do not invent entries here.

## SEO

- `buildMetadata()` in `src/lib/metadata.ts` supplies shared metadata defaults. `src/lib/site.ts` is the single source of the origin for metadata, canonicals, structured data, sitemap and robots. It reads `NEXT_PUBLIC_SITE_URL`, defaults to `https://www.makeupbyhitomi.com`, and normalizes either production hostname to HTTPS + `www` to match the live redirect.
- `sitemap.ts` and `robots.ts` generate `/sitemap.xml` and `/robots.txt` at build time, blog slugs included.
- Schema.org JSON-LD: `Person` and `LocalBusiness` in `src/app/layout.tsx` (with geo + 100 km service radius), `BlogPosting` per article, `ItemList` on listings.

> When the Instagram handle, domain, or business details change, they must be updated in **every** JSON-LD `sameAs`/`url` field as well as the visible links — `grep -rn "instagram.com\|makeupbyhitomi.com" src/` before calling it done.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · Framer Motion 12 · GSAP 3 + ScrollTrigger · `next-mdx-remote` + `gray-matter` + `reading-time` · `yet-another-react-lightbox` · `lucide-react` (plus a hand-rolled `InstagramIcon`) · `clsx` + `tailwind-merge` · ESLint 9.

Fully static — no database, no API routes, no server-side runtime.

## Project structure

```
src/
  app/                     # App Router — one directory per route
    layout.tsx             # Fonts, Person + LocalBusiness JSON-LD
    page.tsx  services/  portfolio/  about/  contact/
    blog/  blog/[slug]/    # MDX index + statically generated posts
    sitemap.ts  robots.ts
  components/
    home/                  # Hero, rotator, WaveBendPromise, gallery, testimonials, IG CTA
    portfolio/             # PortfolioMarquee (GSAP + lightbox)
    blog/  services/  layout/  ui/
  content/blog/            # 11 MDX articles — the SEO surface
  data/                    # services.ts, portfolio.ts, testimonials.ts (client-owned facts)
  lib/                     # metadata.ts, blog.ts, stableViewport.ts, utils.ts
  types/
docs/superpowers/          # Design specs, HTML prototypes and plans for past features
```

`src/lib/stableViewport.ts` exists because in-app browsers (Instagram's especially — where most traffic arrives) resize the viewport as their chrome collapses, which made the homepage jump. Don't read `window.innerHeight` directly in scroll-driven components; use that helper.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint
```

Optional `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://www.makeupbyhitomi.com
```

## Deployment

Pushes to `main` deploy to Vercel; `dev` is the working branch and PRs merge into it first.

After a domain or content change: re-submit `https://www.makeupbyhitomi.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and confirm the Google Business Profile (Service Area Business — Sapporo, Hokkaido) still matches the `LocalBusiness` schema.

## Working in this repo

`AGENTS.md` (symlinked as `CLAUDE.md`) carries one hard rule: **this Next.js version has breaking changes from what you may remember** — read `node_modules/next/dist/docs/` before writing routing or rendering code.
