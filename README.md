# Hitomi — Bridal Makeup Artist Website

Professional website for **Hitomi**, a bridal makeup artist and hairstylist based in **Sapporo, Hokkaido, Japan**. The site serves international couples planning destination weddings in Japan, with a focus on English-speaking clients.

Instagram: [@hitomils](https://www.instagram.com/hitomils)

---

## What This Site Does

- Showcases Hitomi's bridal makeup and hair services with transparent pricing
- Features a portfolio gallery of real bridal work
- Hosts a blog with SEO-optimised content targeting international brides searching for makeup artists in Japan
- Provides a contact/booking page for enquiries
- Serves as the primary online presence for the business

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, intro, services preview, gallery, testimonials, Instagram CTA |
| `/services` | Full services list with pricing |
| `/portfolio` | Photo gallery with lightbox |
| `/about` | Artist bio and background |
| `/blog` | Blog index listing all articles |
| `/blog/[slug]` | Individual blog posts (MDX) |
| `/contact` | Booking enquiry form / contact info |

## Blog Articles

All articles are written in MDX and stored in `src/content/blog/`. They contain Hitomi's personal voice and quotes alongside formatted content.

- `wedding-makeup-japan-foreigner-guide.mdx` — How to plan wedding makeup in Japan as a foreigner
- `bridal-makeup-trial-japan.mdx` — What to expect from a bridal makeup trial in Japan
- `bridal-makeup-asian-features.mdx` — Bridal makeup guide for Asian features
- `destination-wedding-hokkaido-beauty-guide.mdx` — Beauty guide for destination weddings in Hokkaido
- `getting-married-japan-foreigner-beauty-guide.mdx` — Complete beauty planning guide for foreigners marrying in Japan
- `english-speaking-makeup-artist-japan.mdx` — Guide to finding an English-speaking makeup artist in Japan
- `sapporo-wedding-venues-guide.mdx` — Overview of wedding venues in Sapporo and Hokkaido

---

## Technology Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | React 19 |
| Animations | Framer Motion 12 |
| Icons | Lucide React (+ custom Instagram SVG component) |
| Blog Content | MDX via `next-mdx-remote` |
| Frontmatter Parsing | `gray-matter` |
| Reading Time | `reading-time` |
| Gallery Lightbox | `yet-another-react-lightbox` |
| Class Utilities | `clsx` + `tailwind-merge` |
| Linting | ESLint 9 with `eslint-config-next` |

## SEO

- Dynamic `sitemap.xml` generated at build time (includes all blog slugs)
- `robots.txt` allowing all crawlers
- Per-page canonical URLs via `buildMetadata()` in `src/lib/metadata.ts`
- OpenGraph and Twitter Card metadata on every page
- Schema.org structured data: `Person`, `LocalBusiness`, `BlogPosting`, `ItemList`
- Google E-E-A-T signals: real testimonials, transparent pricing, personal author voice throughout blog

---

## Project Structure

```
src/
  app/                  # Next.js App Router pages + API routes
    page.tsx            # Homepage
    services/
    portfolio/
    about/
    blog/
      [slug]/           # Dynamic blog post pages
    contact/
    sitemap.ts          # Auto-generated sitemap
    robots.ts           # robots.txt
  components/           # Reusable UI components
    home/               # Homepage-specific sections
    blog/               # Blog-specific components
    layout/             # Header, Footer, Nav
  content/
    blog/               # MDX blog articles
  data/
    testimonials.ts     # Client testimonials data
  lib/
    metadata.ts         # Global SEO metadata builder
    mdx.ts              # MDX parsing utilities
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Deployment

Deployed on **Vercel** (Hobby tier). The site is statically generated at build time.

After deployment:
1. Connect custom domain in Vercel dashboard
2. Submit `https://hitomils.com/sitemap.xml` to [Google Search Console](https://search.google.com/search-console)
3. Create a Google Business Profile as a Service Area Business (Sapporo, Hokkaido)
