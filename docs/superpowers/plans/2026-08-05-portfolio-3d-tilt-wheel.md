# Homepage Portfolio 3D Tilt Wheel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage portfolio "photo stream" effect with a 3D tilt wheel — a ring of upright photographs that drifts on its own, tilts with the pointer, and spreads outward as you scroll.

**Architecture:** A `preserve-3d` wrapper holds tiles positioned on a circle in the XY plane. The wrapper is rotated in 3D; each tile applies the **exact inverse rotation after its own translate**, so its position rotates but its orientation stays flat and facing the camera. CSS `perspective` then does the near-large / far-small scaling for free. All animation lives in one custom hook driven by a single `gsap.ticker` callback.

**Tech Stack:** Next.js 16.2.1 (App Router), React 19.2.4, TypeScript, Tailwind CSS v4, GSAP 3.15 with ScrollTrigger. All already installed — **do not add any dependency.**

## Global Constraints

- **Read `AGENTS.md` first.** This is not the Next.js you may know; consult `node_modules/next/dist/docs/` before writing framework code.
- **Do not add, remove, or upgrade any npm package.** Everything needed is installed.
- **Do not modify `src/app/page.tsx`.** `FeaturedGallery` keeps its path and default export.
- **Keep the `pin-height` class** on the runway div. `src/app/globals.css` disables native smooth scrolling via `html:not(:has(.pin-height))` because it fights ScrollTrigger's scrub. Removing the class reintroduces scroll jitter across the whole page.
- **Keep the `motion-reduce` static grid** and the `motion-reduce:hidden` runway exactly as they work today.
- **Never set `z-index` on tiles.** `transform-style: preserve-3d` makes the compositor sort by real depth. Manual z-index fights it. (The *old* effect computed a per-frame z-index; that code is being deleted, do not carry it over.)
- **Exact shadow, do not restyle:** `shadow-[0_18px_50px_rgba(44,44,44,0.16)]`.
- Background stays the site cream (`#FAF7F4`) — the section adds no background of its own.
- The design spec is `docs/superpowers/specs/2026-08-05-portfolio-3d-tilt-wheel-design.md`, and `docs/superpowers/specs/2026-08-05-portfolio-3d-tilt-wheel-prototype.html` is a runnable, screenshot-verified reference implementation of the geometry. **Where this plan and the prototype disagree, the prototype is right.**

## Note on testing

This repository has **no test runner** (check `package.json` — there is no jest, vitest, or test script). Do **not** add one; that is out of scope. The test cycle for every task below is instead:

```bash
npx tsc --noEmit     # types
npm run lint         # eslint
npm run build        # production build
```

Visual verification is done by the reviewer, not by you.

## File Structure

| file | responsibility |
|---|---|
| `src/components/home/useTiltWheel.ts` | **Create.** All animation: geometry, drift, pointer tilt, scroll scrub, pin, lifecycle. Knows nothing about photographs or copy. |
| `src/components/home/FeaturedGallery.tsx` | **Rewrite the middle.** Section furniture — heading, tile markup, reduced-motion grid, CTA. Owns no animation logic. |

---

### Task 1: The `useTiltWheel` hook

**Files:**
- Create: `src/components/home/useTiltWheel.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `useTiltWheel(runwayRef, stageRef, containerRef, wheelRef): void`, where every argument is a `RefObject<HTMLDivElement | null>`. Task 2 calls it with exactly those four refs, in that order. The hook finds tiles by querying `.wheel-tile-desktop` / `.wheel-tile-mobile` inside `wheelRef`; Task 2 must emit those class names.

- [ ] **Step 1: Create the hook file**

Create `src/components/home/useTiltWheel.ts` with exactly this content:

```ts
'use client'

import { useLayoutEffect, useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// useLayoutEffect warns during SSR (no DOM to lay out); fall back to useEffect there.
// The effect body never actually runs on the server either way — this only silences the warning.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

type DivRef = RefObject<HTMLDivElement | null>

// ─── tuning ─────────────────────────────────────────────────────────────────
// Matched against the reference preview frame-by-frame; see the design spec.
// Angles in degrees, radii in vw, perspective in px.
interface Tuning {
  radiusFrom: number
  radiusTo: number
  perspectiveFrom: number
  perspectiveTo: number
  tiltXFrom: number
  tiltXTo: number
  tiltXSwing: number // pointer influence on tiltX
  tiltYSwing: number // pointer (or scroll, on touch) influence on tiltY
}

const DESKTOP: Tuning = {
  radiusFrom: 22,
  radiusTo: 36,
  perspectiveFrom: 1200,
  perspectiveTo: 2200,
  tiltXFrom: 72,
  tiltXTo: 72,
  tiltXSwing: 14,
  tiltYSwing: 22,
}

const MOBILE: Tuning = {
  radiusFrom: 30,
  radiusTo: 44,
  perspectiveFrom: 900,
  perspectiveTo: 1600,
  tiltXFrom: 72,
  tiltXTo: 62,
  tiltXSwing: 0,
  tiltYSwing: 30,
}

const SPIN_PERIOD = 45 // seconds for one full revolution
const POINTER_EASE = 0.08 // lerp factor per frame

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function useTiltWheel(
  runwayRef: DivRef,
  stageRef: DivRef,
  containerRef: DivRef,
  wheelRef: DivRef
) {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isMobile: '(max-width: 767.98px)',
          isDesktop: '(min-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
          finePointer: '(pointer: fine)',
        },
        (context) => {
          const conditions = context.conditions ?? {}

          // Reduced motion: the CSS-only static grid is already visible; skip GSAP entirely.
          if (conditions.reduceMotion) return

          const isMobile = Boolean(conditions.isMobile)
          const usePointer = Boolean(conditions.finePointer)
          const tune = isMobile ? MOBILE : DESKTOP

          const stage = stageRef.current
          const container = containerRef.current
          const wheel = wheelRef.current
          if (!stage || !container || !wheel) return

          const tiles = Array.from(
            wheel.querySelectorAll<HTMLDivElement>(
              isMobile ? '.wheel-tile-mobile' : '.wheel-tile-desktop'
            )
          )
          if (tiles.length === 0) return

          // Tiles render at opacity 0 so they never flash stacked at the centre
          // before the first frame is written.
          tiles.forEach((el) => {
            el.style.opacity = '1'
          })

          const state = { spin: 0, progress: 0 }
          const pointer = { x: 0, y: 0 } // -1..1, raw
          const eased = { x: 0, y: 0 } // -1..1, smoothed

          // The ring drifts on its own, independently of scroll.
          const spinTween = gsap.to(state, {
            spin: Math.PI * 2,
            duration: SPIN_PERIOD,
            repeat: -1,
            ease: 'none',
          })

          const trigger = ScrollTrigger.create({
            trigger: runwayRef.current,
            start: 'top top',
            end: 'bottom bottom',
            pin: stage,
            scrub: 0.6,
            onUpdate: (self) => {
              state.progress = self.progress
            },
          })

          const onPointerMove = (e: PointerEvent) => {
            pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
            pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
          }
          if (usePointer) window.addEventListener('pointermove', onPointerMove)

          const render = () => {
            const p = state.progress

            if (usePointer) {
              eased.x = lerp(eased.x, pointer.x, POINTER_EASE)
              eased.y = lerp(eased.y, pointer.y, POINTER_EASE)
            } else {
              // No pointer on touch: scroll drives the swing instead.
              eased.x = p - 0.5
              eased.y = 0
            }

            const tiltX = lerp(tune.tiltXFrom, tune.tiltXTo, p) + eased.y * tune.tiltXSwing
            const tiltY = eased.x * tune.tiltYSwing
            const radius = (lerp(tune.radiusFrom, tune.radiusTo, p) * window.innerWidth) / 100
            const perspective = lerp(tune.perspectiveFrom, tune.perspectiveTo, p)

            container.style.perspective = `${perspective}px`
            wheel.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`

            // Each tile undoes the wrapper's rotation *after* its own translate, so
            // its position is rotated into 3D but it stays flat and facing the camera.
            // The -50%/-50% must come last: by then the tile is unrotated, so it
            // centres on screen. Never reorder these.
            const inverse = `rotateY(${-tiltY}deg) rotateX(${-tiltX}deg)`
            const n = tiles.length
            for (let i = 0; i < n; i++) {
              const theta = state.spin + (i / n) * Math.PI * 2
              const x = Math.cos(theta) * radius
              const y = Math.sin(theta) * radius
              tiles[i].style.transform =
                `translate3d(${x}px, ${y}px, 0px) ${inverse} translate(-50%, -50%)`
            }
          }

          gsap.ticker.add(render)
          render() // paint the first frame before the browser does

          // gsap.context reverts tweens and ScrollTriggers, but not the ticker
          // callback or the window listener — those must be torn down by hand.
          return () => {
            gsap.ticker.remove(render)
            if (usePointer) window.removeEventListener('pointermove', onPointerMove)
            spinTween.kill()
            trigger.kill()
          }
        }
      )
    }, runwayRef)

    return () => ctx.revert()
  }, [runwayRef, stageRef, containerRef, wheelRef])
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: exits 0 with no output. (`FeaturedGallery.tsx` is untouched so far and still compiles on its own.)

- [ ] **Step 3: Verify it lints**

Run: `npm run lint`
Expected: no errors. In particular there should be **no** `react-hooks/exhaustive-deps` warning — the four refs are listed in the dependency array precisely to avoid it.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/useTiltWheel.ts
git commit -m "feat: add useTiltWheel hook for 3D portfolio wheel"
```

---

### Task 2: Rewire `FeaturedGallery` onto the wheel

**Files:**
- Modify: `src/components/home/FeaturedGallery.tsx` (replace the whole file)

**Interfaces:**
- Consumes: `useTiltWheel(runwayRef, stageRef, containerRef, wheelRef)` from Task 1.
- Produces: the default-exported `FeaturedGallery` component that `src/app/page.tsx` already imports. Its import path and export shape are unchanged.

**What is being deleted:** the entire old photo-stream implementation — `createRng`, `buildPhotos`, `PhotoConfig`, `PhotoStream`, the `X_IN` / `X_OUT` / `Y_SPREAD` / `DRIFT` / `TRAVEL` / `IN_FLIGHT` / `STAGGER` constants, and the per-frame z-index `onUpdate`. None of it is reused. The seeded PRNG existed only because the old effect randomised per-photo size and position; the wheel does not, so there is no hydration-mismatch risk to guard against and no reason to keep it.

**What is being kept:** the `pickEven` helper, the `SectionTitle`, the `motion-reduce` static grid, the `Full Portfolio` CTA, and the `pin-height` class.

- [ ] **Step 1: Replace the file**

Replace the entire contents of `src/components/home/FeaturedGallery.tsx` with:

```tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { portfolioImages } from '@/data/portfolio'
import type { GalleryImage } from '@/types'
import { useTiltWheel } from './useTiltWheel'

const DESKTOP_COUNT = 16
const MOBILE_COUNT = 10

function pickEven<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return arr.slice(0, n)
  const step = (arr.length - 1) / (n - 1)
  return Array.from({ length: n }, (_, i) => arr[Math.round(i * step)])
}

// Desktop and mobile each get their own curated spread across the whole
// portfolio, so neither ring clusters inside a single category.
const DESKTOP_TILES = pickEven(portfolioImages, DESKTOP_COUNT)
const MOBILE_TILES = pickEven(portfolioImages, MOBILE_COUNT)

// Reduced-motion fallback reuses the desktop selection as a plain grid.
const GRID_IMAGES = DESKTOP_TILES

function Tiles({ images, variant }: { images: GalleryImage[]; variant: 'desktop' | 'mobile' }) {
  // Both sets are rendered; the hook animates whichever one the breakpoint shows.
  // No `display: contents` wrapper — the tiles must be real children of the
  // preserve-3d wheel for the compositor to depth-sort them.
  const sizing =
    variant === 'mobile' ? 'w-[26vw] md:hidden' : 'w-[10vw] min-w-[120px] max-md:hidden'

  return (
    <>
      {images.map((image, i) => (
        <div
          key={`${variant}-${image.src}`}
          className={`wheel-tile-${variant} ${sizing} absolute top-0 left-0 aspect-[3/4] opacity-0 will-change-transform [transform-style:preserve-3d] shadow-[0_18px_50px_rgba(44,44,44,0.16)]`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 26vw, 10vw"
            className="object-cover"
            loading={i < 3 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </>
  )
}

export default function FeaturedGallery() {
  const runwayRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  useTiltWheel(runwayRef, stageRef, containerRef, wheelRef)

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-12">
            <SectionTitle subtitle="Portfolio" title="Selected Work" />
          </div>
        </Reveal>
      </div>

      {/* ── Pinned 3D tilt wheel (motion-safe) ────────────────────────────── */}
      <div
        ref={runwayRef}
        className="pin-height relative h-[280vh] max-md:h-[200vh] motion-reduce:hidden"
      >
        <div ref={stageRef} className="relative h-screen overflow-hidden">
          <div ref={containerRef} className="absolute inset-0 [perspective:1200px]">
            <div
              ref={wheelRef}
              className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d]"
            >
              <Tiles images={DESKTOP_TILES} variant="desktop" />
              <Tiles images={MOBILE_TILES} variant="mobile" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Static grid fallback (motion-reduce) ──────────────────────────── */}
      <div className="hidden motion-reduce:block max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GRID_IMAGES.map((img) => (
            <div key={img.src} className="relative aspect-[3/4] overflow-hidden bg-[#EDD9D1]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 23vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA, below the wheel ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mt-16 flex justify-center">
        <Reveal>
          <Button href="/portfolio" variant="ghost" size="sm">
            Full Portfolio
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Confirm nothing still references the deleted code**

Run: `grep -rn "PhotoStream\|buildPhotos\|createRng\|IN_FLIGHT\|X_OUT" src/`
Expected: **no output.** If anything matches, you left dead code behind or another file imported it — resolve before continuing.

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: exits 0 with no output.

- [ ] **Step 4: Verify lint**

Run: `npm run lint`
Expected: no errors and no warnings.

- [ ] **Step 5: Verify the production build**

Run: `npm run build`
Expected: build completes successfully; the `/` route is listed in the route summary. Any hydration or "use client" error here is a real failure — do not proceed past it.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/FeaturedGallery.tsx
git commit -m "feat: replace homepage photo stream with 3D tilt wheel"
```

---

### Task 3: Smoke-test the running page

**Files:** none modified. This task only runs and observes.

**Interfaces:**
- Consumes: the built component from Task 2.
- Produces: nothing. It is a gate.

- [ ] **Step 1: Start the dev server in the background**

```bash
npm run dev
```

Run it as a background command and wait for it to report a local URL.

- [ ] **Step 2: Confirm the page renders and the tiles are in the DOM**

```bash
curl -s http://localhost:3000 | grep -c "wheel-tile-desktop"
```

Expected: `16`. This proves the section server-renders the desktop tile set. If it prints `0`, the component is not rendering — investigate before continuing.

- [ ] **Step 3: Confirm there are no runtime errors**

Check the dev server's output for compile or runtime errors after the request in Step 2. Expected: a successful `GET /` compile line and no stack traces.

- [ ] **Step 4: Stop the dev server**

Kill the background process.

- [ ] **Step 5: Report for visual review**

Do not commit anything in this task. Report to the reviewer: the build passed, lint passed, types passed, the page serves 16 desktop tiles, and the dev server logged no errors. Visual verification of the wheel itself is the reviewer's job — the geometry is already proven by `docs/superpowers/specs/2026-08-05-portfolio-3d-tilt-wheel-prototype.html`.

---

## Known pitfalls

These are the ways this specific effect goes wrong. Read before starting.

1. **Transform order is load-bearing.** `translate3d(...) rotateY(-tiltY) rotateX(-tiltX) translate(-50%, -50%)` — CSS composes outer-to-inner. Move the `translate(-50%, -50%)` earlier and tiles drift off-centre as they rotate. Swap the two inverse rotations and the counter-rotation stops cancelling, so tiles keystone.
2. **The inverse rotations must use the *same* angles as the wrapper**, negated. If you recompute `tiltX` for the wrapper but reuse a stale value for the tiles, the tiles skew.
3. **No `z-index`.** See Global Constraints.
4. **`display: contents` between the wheel and its tiles.** Do not introduce a wrapper div for the desktop/mobile split — put the responsive `hidden` classes on the tiles themselves, as the code above does.
5. **`perspective` goes on the container, `transform-style: preserve-3d` on the wheel.** Putting both on one element does not work.
6. **The ticker callback and the `pointermove` listener are not owned by `gsap.context`.** They must be removed in the matchMedia cleanup, or you leak a callback on every breakpoint change.
