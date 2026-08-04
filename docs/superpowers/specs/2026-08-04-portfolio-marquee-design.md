# Portfolio Triple-Marquee Parallax — Design

Date: 2026-08-04
Status: Approved, ready for implementation

## Goal

Replace the `/portfolio` category-filter grid with a pinned triple-marquee
parallax, adapted from madewithgsap Effect 065 ("Triple Marquee Parallax"),
using the 77 existing portfolio photographs.

## The effect

Three horizontal image ribbons sit in a band pinned for the duration of a tall
spacer. As the user scrolls vertically, all three rows translate left. Each row
travels **exactly its own horizontal overflow** (`scrollWidth - innerWidth`),
so every row starts flush-left and ends flush-right. Because the rows have
different total widths, they cover different distances over identical scroll —
that difference *is* the parallax.

The source page is member-gated; only the HTML skeleton is public. The CSS and
JS below were derived by measuring the published preview video frame-by-frame
and rebuilt from scratch. Reference travel ratio in the original: ~2 : 1.45 : 1.

## Row distribution — the critical detail

Splitting 77 images evenly (26/26/25) yields near-identical row overflows, and
the effect collapses into a single flat marquee with no visible parallax.

Rows must be deliberately uneven. Deal each image to whichever row is currently
furthest below its width budget, with budget ratios **0.42 / 0.34 / 0.24** of
total width. Width contribution per image is its aspect ratio `w / h` (row
height is common, so aspect ratio alone orders the widths). Landscape (3:2)
images are dealt before portrait (3:4) ones so the wide images concentrate in
the widest row.

Measured result at a 1440px viewport, 813px inner height:

| row | images | width  | overflow | relative speed |
|-----|--------|--------|----------|----------------|
| 0   | 30     | 7361px | 5921px   | 2.31×          |
| 1   | 26     | 5570px | 4130px   | 1.61×          |
| 2   | 21     | 4001px | 2561px   | 1.00×          |

Verified travel per quarter-scroll: −1480 / −1032 / −640 px. Each row lands
exactly on its own overflow at scroll end.

## Measurement without waiting on images

The original tutorial waits for every image to load before measuring. That is
unacceptable here: `public/images/portfolio/` is 99 MB across 72 files.

`src/data/portfolio.ts` already carries `width` and `height` for all 77 entries,
so row widths are computable at render time:

```
imageWidth = (w / h) * rowHeight
rowWidth   = Σ imageWidth + gap * (count - 1)
```

No `onload` dependency, no layout shift, and lazy loading stays enabled.
Re-measure only on resize (and on `ScrollTrigger.refresh()`).

## Architecture

Replaces `src/components/portfolio/GalleryClient.tsx` with
`src/components/portfolio/PortfolioMarquee.tsx` (`'use client'`).

Follow the existing GSAP conventions in
`src/components/home/FeaturedGallery.tsx`: `gsap.registerPlugin(ScrollTrigger)`,
work inside `gsap.context()`, branch on `gsap.matchMedia()`, and let
context/matchMedia handle teardown.

```
<section>
  <div class="pin-height">          <- height: 100vh + maxOverflow
    <div class="container">         <- 100vh, pinned, overflow hidden
      <div class="medias"> …row 0… </div>
      <div class="medias"> …row 1… </div>
      <div class="medias"> …row 2… </div>
    </div>
  </div>
</section>
```

Desktop (`min-width: 768px`):

- `pinHeight.style.height = calc(100vh + ${maxOverflow}px)`
- one `ScrollTrigger` pins `.container` (`start: 'top top'`,
  `end: 'bottom bottom'`, `scrub: true`, `pinSpacing: false`)
- per row: `gsap.to(row, { x: -overflow[i], ease: 'none', scrollTrigger: <same config> })`

Mobile (`max-width: 767px`): the ScrollTrigger is never created. Rows become
native `overflow-x: auto` swipe strips with `scroll-snap-type: x mandatory`,
row height ~38vh, hidden scrollbars. The page scrolls vertically as normal —
no pin, no scroll hijack.

## Styling

Matches the existing palette in `globals.css`: background `--color-cream`
(`#FAF7F4`), placeholder `#EDE7E1`. Gap 12px, `border-radius: 2px`,
`object-fit: cover`, `will-change: transform` on rows only.
Row height: `calc((100vh - 4 * 12px) / 3)`.

## Next.js 16 specifics

Per `AGENTS.md`, verified against `node_modules/next/dist/docs/`:

- `priority` is **deprecated** in Next.js 16 in favour of `preload`; the docs
  further advise `loading="eager"` + `fetchPriority="high"` in most cases.
  Use those on the ~12 initially-visible images. Do **not** use `priority`.
- `onLoadingComplete` is deprecated — use `onLoad`.
- Images need explicit `width`/`height` (from `portfolio.ts`) with CSS
  `height: 100%; width: auto`. `fill` will not work, as widths must vary.

## Retained

- Fullscreen lightbox (`yet-another-react-lightbox`) on image click, indexing
  across all 77 images in visual order, with keyboard navigation.
- `ImageGallery` JSON-LD in `src/app/portfolio/page.tsx` — unchanged.
- `PageHero` and the intro paragraph.

## Dropped

- Category filter buttons (All / Bridal Makeup / Hairstyling / Special Occasions)
- The 4-column grid

Filtering is incompatible with a pinned marquee: changing the image set changes
row widths, which changes pin distance mid-page. Confirmed as an accepted
trade-off by the site owner.

## Accessibility

- Respect `prefers-reduced-motion`: skip the pin/scrub entirely and render the
  three rows as static, horizontally scrollable strips (the mobile treatment).
- Images keep their existing `alt` text from `portfolio.ts`.
- Clickable images must be reachable by keyboard (button semantics or
  `tabIndex` + key handler), since the lightbox is the only way to view a photo
  at full size.

## Verification

A working standalone prototype is committed alongside this spec at
`2026-08-04-portfolio-marquee-prototype.html`. It runs the real photos and was
driven through headless Chrome via CDP to confirm: correct per-row travel,
distinct speeds, correct end positions, and unpinned free-swipe behaviour at
390×844.

Implementation must reproduce those numbers within rounding.
