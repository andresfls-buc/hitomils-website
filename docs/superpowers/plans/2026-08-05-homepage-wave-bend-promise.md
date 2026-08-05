# Homepage Wave Bend Promise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new homepage section between About and Services in which a reassuring sentence, set in giant Cormorant type and interleaved with two portfolio photographs, travels along an SVG path as the visitor scrolls — and the path bends into a wave the faster they scroll.

**Architecture:** One oversized SVG holds a visible straight `#line`, a hidden `#wave` used only as a MorphSVG target, and a `#track` group of segments. Segments are positioned by **path length** (text via `<textPath startOffset>`, images via `getPointAtLength()` plus a tangent rotation), so text and images bend together. Scroll position drives the train's travel; scroll **velocity** drives `morph.progress(bend)` on a paused MorphSVG tween.

**Tech Stack:** Next.js 16.2.1 (App Router), React 19.2.4, TypeScript, Tailwind CSS v4, GSAP 3.15 with ScrollTrigger and MorphSVGPlugin. All already installed — **do not add any dependency.** MorphSVGPlugin ships inside `gsap` 3.15 (free since 3.13); it is at `node_modules/gsap/MorphSVGPlugin.js` and exports both a named and a default `MorphSVGPlugin`.

## Global Constraints

- **Read `AGENTS.md` first.** This is not the Next.js you may know; consult `node_modules/next/dist/docs/` before writing framework code.
- **Do not add, remove, or upgrade any npm package.**
- **Do not touch** `src/components/home/FeaturedGallery.tsx`, `src/components/home/useTiltWheel.ts`, or anything under `src/app/portfolio/`.
- **Copy is final. Do not reword it, do not "fix" the apostrophes, do not change `I’ll` to `we’ll`.** The three segments are exactly:
  1. `It’s your day`
  2. `I’ll take care of everything`
  3. `you just enjoy it`

  Note the typographic apostrophes (`’`, U+2019), not straight ones. This is deliberate and is why `react/no-unescaped-entities` stays quiet.
- **The two photographs are fixed:**
  - `/images/portfolio/bridal-makeup-natural-ethereal-close-up-sapporo.jpg` — alt `Ethereal natural bridal makeup close-up, Sapporo`
  - `/images/portfolio/bridal-hair-half-up-hotel-smiling-hokkaido.jpg` — alt `Bridal half-up hairstyle with pink peony bouquet, hotel room, Hokkaido`
- **The two SVG path `d` strings are verbatim from the reference. Do not round, reformat, or regenerate them.**
- **Keep the `pin-height` class** on the runway. `src/app/globals.css` disables native smooth scrolling via `html:not(:has(.pin-height))` because it fights ScrollTrigger's scrub.
- Ground stays cream. The section adds no background colour of its own.
- The design spec is `docs/superpowers/specs/2026-08-05-homepage-wave-bend-promise-design.md`, and `docs/superpowers/specs/2026-08-05-homepage-wave-bend-promise-prototype.html` is a runnable, screenshot-verified reference. **Where this plan and the prototype disagree, the prototype is right.**

## Note on testing

This repository has **no test runner** (check `package.json` — there is no jest, vitest, or test script). Do **not** add one. The test cycle for every task is:

```bash
npx tsc --noEmit     # types
npm run lint         # eslint
npm run build        # production build
```

Visual verification is done by the reviewer, not by you.

## File Structure

| file | responsibility |
|---|---|
| `src/components/home/useWaveBend.ts` | **Create.** All animation: measuring segments, travel along the path, velocity-driven morph, ScrollTrigger pin, lifecycle. Knows nothing about copy or photographs. |
| `src/components/home/WaveBendPromise.tsx` | **Create.** The section: SVG markup, the copy, the photographs, the reduced-motion fallback, the screen-reader text. Owns no animation logic. |
| `src/app/page.tsx` | **Modify.** One import and one element, between `<IntroSection />` and `<ServicesPreview />`. |

---

### Task 1: The `useWaveBend` hook

**Files:**
- Create: `src/components/home/useWaveBend.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `useWaveBend(runwayRef, stageRef, lineRef, trackRef): void` where the four arguments are `RefObject<HTMLDivElement | null>`, `RefObject<HTMLDivElement | null>`, `RefObject<SVGPathElement | null>`, `RefObject<SVGGElement | null>` — in that order. Task 2 calls it with exactly those refs. The hook reads `#wave` by selector, so Task 2 must emit a path with `id="wave"`.

- [ ] **Step 1: Create the hook file**

Create `src/components/home/useWaveBend.ts` with exactly this content:

```ts
'use client'

import { useLayoutEffect, useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

// useLayoutEffect warns during SSR (no DOM to lay out); fall back to useEffect there.
// The effect body never actually runs on the server either way — this only silences the warning.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// ─── tuning ─────────────────────────────────────────────────────────────────
// All distances are SVG user units against the fixed viewBox "0 0 2577 391".
const GAP = 120 // space between consecutive segments
const IMG_SIZE = 280 // images are square
const MAX_BEND = 0.35 // progress(1) is violently over-bent; 0.35 matches the reference
const VELOCITY_FULL = 2600 // scroll velocity that reaches MAX_BEND
const BEND_EASE = 0.08 // how fast the bend chases its target, per frame

interface Segment {
  el: SVGGraphicsElement
  textPath: SVGTextPathElement | null
  width: number
  at: number // cumulative offset from the head of the train
}

export function useWaveBend(
  runwayRef: RefObject<HTMLDivElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
  lineRef: RefObject<SVGPathElement | null>,
  trackRef: RefObject<SVGGElement | null>
) {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin)

    const ctx = gsap.context(
      () => {
        // Deliberately NOT gsap.matchMedia(). A matchMedia context is only
        // activated when at least one of its queries matches (gsap-core.js:
        // `anyMatch && matches.push(c)`), so a lone always-false
        // prefers-reduced-motion query means the callback never runs at all.
        // The static fallback is CSS-driven anyway, so a plain guard is correct.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const line = lineRef.current
        const track = trackRef.current
        const stage = stageRef.current
        const runway = runwayRef.current
        if (!line || !track || !stage || !runway) return

        const segments: Segment[] = Array.from(track.children).map((node) => {
          const el = node as SVGGraphicsElement
          const isText = el.tagName === 'text'
          return {
            el,
            textPath: isText ? (el.firstElementChild as SVGTextPathElement) : null,
            width: IMG_SIZE,
            at: 0,
          }
        })

        // Lay the segments end to end into a "train" and return its total length.
        //
        // This re-runs every frame rather than once at setup, and that is
        // deliberate. getComputedTextLength() reports fallback-font widths until
        // the webfont is actually applied to the SVG text, and document.fonts.ready
        // is NOT a reliable barrier for that — it resolves for the fonts loaded so
        // far, which on a slow phone can be before Cormorant reaches these <text>
        // nodes. Measuring once loses that race silently: the train is laid out
        // with the wrong widths and never corrects itself, so segments overlap.
        // Three getComputedTextLength() calls per frame is a rounding error next to
        // the getPointAtLength() calls below.
        const measure = () => {
          let cursor = 0
          for (const seg of segments) {
            seg.width = seg.textPath
              ? (seg.el as SVGTextContentElement).getComputedTextLength()
              : IMG_SIZE
            seg.at = cursor
            cursor += seg.width + GAP
          }
          return cursor - GAP
        }

        const baseLength = line.getTotalLength()

        // ── the bend is a paused morph we scrub by hand ──────────────────────
        const morph = gsap.to(line, {
          morphSVG: { shape: '#wave' },
          duration: 1,
          paused: true,
          ease: 'none',
        })

        let bend = 0
        let targetBend = 0

        const trigger = ScrollTrigger.create({
          trigger: runway,
          start: 'top top',
          end: 'bottom bottom',
          pin: stage,
          scrub: 0.5,
          onUpdate: (self) => {
            targetBend = Math.min(Math.abs(self.getVelocity()) / VELOCITY_FULL, 1) * MAX_BEND
          },
        })

        const render = () => {
          bend += (targetBend - bend) * BEND_EASE
          morph.progress(bend)

          const trainLength = measure()
          const travel = baseLength + trainLength

          // Re-read every frame: morphing changes the path's length.
          const length = line.getTotalLength()
          // Read progress from the trigger every frame rather than caching it
          // from onUpdate: onUpdate only fires when the scroll CHANGES, so a
          // trigger created while already in range would stay parked at 0.
          const head = baseLength - trigger.progress * travel

          for (const seg of segments) {
            const at = head + seg.at

            if (seg.textPath) {
              // Glyphs falling outside the path simply are not rendered, which
              // is what makes segments enter and leave the band.
              seg.textPath.setAttribute('startOffset', String(at))
              continue
            }

            // getPointAtLength() clamps to the path's ends, so an image whose
            // centre has travelled past either end would park there instead of
            // continuing off-screen — the text keeps flowing (glyphs outside
            // the path just don't render) while the photos pile up at x=0.
            // Extrapolate along the end tangent for the overshoot instead.
            const mid = at + seg.width / 2
            const onPath = Math.max(0, Math.min(length, mid))
            const before = line.getPointAtLength(Math.max(0, onPath - 1))
            const after = line.getPointAtLength(Math.min(length, onPath + 1))
            const anchor = line.getPointAtLength(onPath)
            const rad = Math.atan2(after.y - before.y, after.x - before.x)
            const overshoot = mid - onPath

            const x = anchor.x + Math.cos(rad) * overshoot
            const y = anchor.y + Math.sin(rad) * overshoot
            const deg = (rad * 180) / Math.PI

            seg.el.setAttribute(
              'transform',
              `translate(${x} ${y}) rotate(${deg}) translate(${-seg.width / 2} ${-IMG_SIZE / 2})`
            )
          }
        }

        gsap.ticker.add(render)
        render() // paint the first frame before the browser does

        // gsap.context reverts tweens and ScrollTriggers, but not the ticker
        // callback — that must be removed by hand.
        return () => {
          gsap.ticker.remove(render)
        }
      },
      runwayRef
    )

    return () => ctx.revert()
  }, [runwayRef, stageRef, lineRef, trackRef])
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: exits 0 with no output.

- [ ] **Step 3: Verify it lints**

Run: `npm run lint`
Expected: no errors and no warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/useWaveBend.ts
git commit -m "feat: add useWaveBend hook for path-travelling promise section"
```

---

### Task 2: The `WaveBendPromise` section

**Files:**
- Create: `src/components/home/WaveBendPromise.tsx`

**Interfaces:**
- Consumes: `useWaveBend(runwayRef, stageRef, lineRef, trackRef)` from Task 1.
- Produces: a default-exported `WaveBendPromise` component taking no props. Task 3 imports it as `@/components/home/WaveBendPromise`.

- [ ] **Step 1: Create the component**

Create `src/components/home/WaveBendPromise.tsx` with exactly this content:

```tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useWaveBend } from './useWaveBend'

// Verbatim from the reference effect — do not regenerate or reformat.
const LINE_D = 'M0 195H644H1288H1932H2576'
const WAVE_D =
  'M0.21875 190.5C0.21875 190.5 382.004 0.5 644.219 0.5C906.434 0.5 1051.3 78.1239 1288.22 190.5C1531.72 306 1668.87 390.5 1932.22 390.5C2195.57 390.5 2576.22 190.5 2576.22 190.5'

const PHOTOS = [
  {
    src: '/images/portfolio/bridal-makeup-natural-ethereal-close-up-sapporo.jpg',
    alt: 'Ethereal natural bridal makeup close-up, Sapporo',
  },
  {
    src: '/images/portfolio/bridal-hair-half-up-hotel-smiling-hokkaido.jpg',
    alt: 'Bridal half-up hairstyle with pink peony bouquet, hotel room, Hokkaido',
  },
]

const SENTENCE = 'It’s your day — I’ll take care of everything — you just enjoy it.'

// The <text> elements are measured by the hook, so their styling must be on the
// element itself rather than inherited through a class that might not apply
// inside the SVG.
const textStyle = { fontFamily: 'var(--font-cormorant)' } as const

export default function WaveBendPromise() {
  const runwayRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const trackRef = useRef<SVGGElement>(null)

  useWaveBend(runwayRef, stageRef, lineRef, trackRef)

  return (
    <section>
      {/* The animated SVG is decorative; this carries the promise for screen readers. */}
      <p className="sr-only">{SENTENCE}</p>

      {/* ── Pinned travelling line (motion-safe) ──────────────────────────── */}
      <div ref={runwayRef} className="pin-height relative h-[200vh] motion-reduce:hidden">
        <div
          ref={stageRef}
          className="relative flex h-screen items-center overflow-hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 2577 391"
            xmlns="http://www.w3.org/2000/svg"
            /* shrink-0 is load-bearing: as a flex item the svg would otherwise
               shrink to the stage width and silently ignore w-[110vw]. */
            className="block w-[170vw] shrink-0 overflow-visible md:w-[110vw]"
          >
            <defs>
              <clipPath id="round-clip" clipPathUnits="objectBoundingBox">
                <rect width="1" height="1" rx=".08" ry=".08" />
              </clipPath>
            </defs>

            <path ref={lineRef} id="line" d={LINE_D} fill="none" />
            <path id="wave" d={WAVE_D} fill="none" opacity="0" />

            <g ref={trackRef} id="track">
              <text fill="#2C2C2C" fontSize="300" fontWeight="300" style={textStyle}>
                <textPath href="#line" startOffset="0" textAnchor="start">
                  It’s your day
                </textPath>
              </text>
              <image
                href={PHOTOS[0].src}
                width={280}
                height={280}
                clipPath="url(#round-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <text fill="#2C2C2C" fontSize="300" fontWeight="300" style={textStyle}>
                <textPath href="#line" startOffset="0" textAnchor="start">
                  I’ll take care of everything
                </textPath>
              </text>
              <image
                href={PHOTOS[1].src}
                width={280}
                height={280}
                clipPath="url(#round-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <text fill="#2C2C2C" fontSize="300" fontWeight="300" style={textStyle}>
                <textPath href="#line" startOffset="0" textAnchor="start">
                  you just enjoy it
                </textPath>
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* ── Static fallback (motion-reduce) ───────────────────────────────── */}
      <div className="hidden motion-reduce:block px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-serif text-3xl font-light leading-snug text-[#2C2C2C] md:text-5xl">
            {SENTENCE}
          </p>
          <div className="mt-12 flex justify-center gap-4">
            {PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="relative h-40 w-40 overflow-hidden rounded-2xl md:h-56 md:w-56"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: exits 0 with no output.

If TypeScript rejects `href` on `<textPath>` or `<image>`, **stop and report the exact error** rather than switching to `xlinkHref` — that would change runtime behaviour.

- [ ] **Step 3: Verify lint**

Run: `npm run lint`
Expected: no errors and no warnings. Note the copy uses typographic apostrophes (`’`), which is why `react/no-unescaped-entities` does not fire.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/WaveBendPromise.tsx
git commit -m "feat: add wave bend promise section"
```

---

### Task 3: Place the section on the homepage

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: the default export of `@/components/home/WaveBendPromise` from Task 2.
- Produces: nothing consumed downstream.

- [ ] **Step 1: Add the import**

In `src/app/page.tsx`, the existing import block is:

```tsx
import HeroSection from '@/components/home/HeroSection'
import IntroSection from '@/components/home/IntroSection'
import ServicesPreview from '@/components/home/ServicesPreview'
import FeaturedGallery from '@/components/home/FeaturedGallery'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import InstagramCTA from '@/components/home/InstagramCTA'
```

Add one line after the `IntroSection` import so it reads:

```tsx
import HeroSection from '@/components/home/HeroSection'
import IntroSection from '@/components/home/IntroSection'
import WaveBendPromise from '@/components/home/WaveBendPromise'
import ServicesPreview from '@/components/home/ServicesPreview'
import FeaturedGallery from '@/components/home/FeaturedGallery'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import InstagramCTA from '@/components/home/InstagramCTA'
```

- [ ] **Step 2: Add the element**

The existing render block ends with:

```tsx
      <HeroSection />
      <IntroSection />
      <ServicesPreview />
      <FeaturedGallery />
      <TestimonialsSection />
      <InstagramCTA />
```

Change it to:

```tsx
      <HeroSection />
      <IntroSection />
      <WaveBendPromise />
      <ServicesPreview />
      <FeaturedGallery />
      <TestimonialsSection />
      <InstagramCTA />
```

Change nothing else in this file — the metadata export and the `localBusinessSchema` object stay exactly as they are.

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: exits 0 with no output.

- [ ] **Step 4: Verify lint**

Run: `npm run lint`
Expected: no errors and no warnings.

- [ ] **Step 5: Verify the production build**

Run: `npm run build`
Expected: build completes successfully and `/` is listed in the route summary. Any hydration or `"use client"` error here is a real failure — do not proceed past it.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: place wave bend promise between about and services"
```

---

### Task 4: Smoke-test the running page

**Files:** none modified. This task only runs and observes.

- [ ] **Step 1: Start the dev server in the background**

Run `npm run dev` as a background command and wait for it to report a local URL. If a dev server for this directory is already running, reuse it rather than starting a second one — Next refuses to run two for the same project.

- [ ] **Step 2: Confirm the section server-renders**

```bash
curl -s http://localhost:3000 | grep -o 'id="track"' | wc -l
```

Expected: `1`.

Note: use `grep -o … | wc -l` to count occurrences. Plain `grep -c` counts matching *lines*, and Next serves the page as a single unbroken line, so it will report `1` no matter how many matches there are.

- [ ] **Step 3: Confirm the section is in the right place**

```bash
curl -s http://localhost:3000 | grep -o 'About the Artist\|id="track"\|What I Offer' | head -5
```

Expected: `About the Artist` appears before `id="track"`, which appears before the services heading. If the services heading text differs, read `src/components/home/ServicesPreview.tsx` and match on whatever heading it actually renders.

- [ ] **Step 4: Confirm there are no runtime errors**

Check the dev server output for compile or runtime errors after those requests. Expected: a successful `GET /` compile line and no stack traces.

- [ ] **Step 5: Stop the dev server and report**

Kill the background process if you started it. Do not commit anything in this task. Report to the reviewer: the results of tsc, lint, and build; the counts from Steps 2 and 3; and any dev-server errors.

---

## Known pitfalls

Read before starting. Each of these produces silently wrong output rather than an error.

1. **`shrink-0` on the svg is load-bearing.** The stage centres its child with flexbox, and a flex item defaults to `flex-shrink: 1`. Without `shrink-0` the svg quietly collapses to the stage width and ignores `w-[110vw]` entirely — the type comes out roughly a third of its intended size. Do not "fix" that by raising `fontSize`.
2. **`overflow-visible` on the svg is load-bearing.** Segments spend most of their life outside the 2577-unit canvas. The pinned stage does the clipping via `overflow-hidden`.
3. **The stage must be `h-screen`.** A pinned element sticks to the top of the viewport; a shorter stage would leave the line hanging at the top of the screen with empty pin-spacer beneath it.
4. **Measure text only after `document.fonts.ready`.** `getComputedTextLength()` returns fallback-font widths until the webfont loads, and the train is laid out once — it never self-corrects.
5. **Re-read `getTotalLength()` every frame.** Morphing changes the path's length; caching it makes the images drift away from the text as the line bends.
6. **`MAX_BEND` is 0.35, not 1.** At full morph progress the wave is violently over-bent and leaves the band.
7. **Do not gate this on `gsap.matchMedia()` with only a reduced-motion query.**
   A matchMedia context is activated only when at least one of its queries
   matches (`gsap-core.js`: `anyMatch && matches.push(c)`), so a lone
   always-false `prefers-reduced-motion` query means the callback never runs and
   every segment stays at `startOffset` 0, stacked on top of each other. Use a
   plain `window.matchMedia(...).matches` guard.
8. **Read `trigger.progress` inside the render loop, not from `onUpdate`.**
   `onUpdate` fires only when the scroll *changes*. Because `setup()` runs off
   `document.fonts.ready`, the trigger can be created while the visitor is
   already inside the section — a slow font load, or a reload part-way down the
   page — and the train then sits parked off-screen until they scroll again.
9. **`setup` must stay a `const` arrow function, declared before it is used.**
   TypeScript preserves the non-null narrowing of `line`/`track`/`stage` inside a
   closure created after the guard, but NOT inside a hoisted `function setup()` —
   that form fails with `TS18047: 'line' is possibly 'null'` on six lines.
10. **Never clamp an image's position to the path with `getPointAtLength()`.**
   That method clamps to the path's ends, so an image whose centre has passed
   either end parks there instead of continuing off-screen — the text keeps
   flowing (glyphs outside the path just don't render) while the photos pile up
   at x=0. Extrapolate along the end tangent for the overshoot.
11. **Do not add `z-index`, `will-change`, or transforms to `#track` or its children** beyond the `transform` attribute the hook writes on images. The text is positioned entirely by `startOffset`.
