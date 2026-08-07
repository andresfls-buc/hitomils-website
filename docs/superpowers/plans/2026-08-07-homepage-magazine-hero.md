# Homepage Magazine Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's split-screen hero with an editorial magazine composition — an oversized vertical `HITOMI` in Cormorant down a cream margin, a warm-washed photo pane, and five portfolio photographs crossfading on a 4s hold.

**Architecture:** A server component (`HeroSection`) renders the static composition; a single small client component (`HeroPhotoRotator`) owns the crossfade timer. All geometry lives in one CSS block in `globals.css` driven by a computed "word band" custom property, so nothing is positioned against the vertical word by eye. No GSAP, no framer-motion, no new dependencies.

**Tech Stack:** Next.js 16.2.1 (App Router), React 19.2.4, Tailwind CSS v4, `next/font` (Cormorant Garamond + Jost), `next/image`.

## Global Constraints

- **Read the Next docs first.** `AGENTS.md`: this Next.js version has breaking changes vs. training data. Before writing any `next/image` code, read the images guide under `node_modules/next/dist/docs/01-app/` (locate with `grep -rl "next/image" node_modules/next/dist/docs/ | head`).
- **There is no test runner in this project.** No jest, vitest, or playwright; `package.json` has no `test` script. Do **not** add one — it is out of scope. The verification cycle for every task is: `npx tsc --noEmit` → `npm run lint` → `npm run build` → headless-Chrome DOM assertions and screenshots. Commands are given verbatim in each task.
- **Palette (exact hex, matching `globals.css` `@theme`):** cream `#FAF7F4`, ink `#2C2C2C`, muted `#7A7570`, terracotta `#A8796A`, gold `#B8A080`, gold-light `#D6C4A8`.
- **Fonts:** use `var(--font-serif)` and `var(--font-sans)`. Never hardcode a family name.
- **Breakpoint is 900px, not Tailwind's default 768px.** Written as a raw `@media (max-width: 900px)` in `globals.css`.
- **Do not reintroduce type/photo occlusion.** The owner explicitly rejected the vertical word overlapping the headline. Word and headline occupy separate columns.
- **Copy below is owner-supplied placeholder** and matches the approved prototype. Do not paraphrase, "improve", or re-word any string.
- **Chrome binary for verification:** `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- Reference prototype: `docs/superpowers/specs/2026-08-07-homepage-magazine-hero-prototype.html`. **Where this plan and the prototype disagree on geometry, the prototype is right.**

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/app/globals.css` | Modify (append + one guard) | All hero geometry, wash, and the reduced-motion guard for the existing entrance animations |
| `src/components/home/HeroSection.tsx` | Rewrite | Server component: the static composition and all copy |
| `src/components/home/HeroPhotoRotator.tsx` | Create | Client component: the five frames and the 4s crossfade timer |
| `src/components/home/HeroImageSequence.tsx` | Delete (Task 3) | Superseded by `HeroPhotoRotator` |

`src/app/page.tsx` is **not** modified — it already renders `<HeroSection />` and its `BeautyBusiness` JSON-LD stays as is.

---

### Task 1: Static composition

**Files:**
- Modify: `src/app/globals.css` (append at end of file)
- Rewrite: `src/components/home/HeroSection.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/Button` — signature `{ children, href?, variant?: 'filled' | 'ghost' | 'ghost-light', size?: 'sm' | 'md' | 'lg' }`.
- Produces: CSS class names `mhero`, `mhero-photo`, `mhero-frame`, `mhero-seamfade`, `mhero-rail`, `mhero-word`, `mhero-content`, `mhero-title`, `mhero-byline`, `mhero-note` — Task 2 attaches to `mhero-photo` and `mhero-frame`.

> **Deliberate deviation from the prototype:** the prototype drew its own buttons (ink fill). The real site's `Button` component renders `filled` as terracotta `#A8796A` with white text. Use the real `Button` — site-wide consistency beats prototype fidelity here. This is the only place the prototype is knowingly not followed.

- [ ] **Step 1: Append the hero CSS block to `src/app/globals.css`**

```css
/* ── Homepage magazine hero ────────────────────────────────────────────
   Geometry contract: a `writing-mode: vertical-rl` element's HORIZONTAL
   footprint is its line box — font-size x line-height — not the visual
   width of its glyphs. Nothing may be positioned against the word by eye.
   --word-band computes it, and every other element starts after it.

   The units are container-query units and .mhero sets `container-type:
   size`, because `vh` desyncs from the hero box the moment `max-height`
   clamps it (at 820x1180 the hero caps at 860px while 25vh is still
   295px, and the word overflows its frame reading "ITOM").

   The custom properties are declared ON .mhero but are only ever consumed
   by its DESCENDANTS. That matters: cq units resolve against the nearest
   ANCESTOR container, so a cq value used by .mhero on itself would skip
   .mhero and fall through to the viewport. Never consume these vars on
   .mhero itself. */
.mhero {
  --word-left: 4.5cqw;
  --word-size: 25cqh;
  --word-lh: 0.78;
  --word-band: calc(var(--word-size) * var(--word-lh));
  --gutter: 4cqw;
  --content-left: calc(var(--word-left) + var(--word-band) + var(--gutter));
  --photo-left: 46%;

  position: relative;
  width: 100%;
  height: 88vh;
  min-height: 580px;
  max-height: 860px;
  overflow: hidden;
  background-color: #faf7f4;
  container-type: size;
}

/* Photo pane. Wash layers sit above the frames (z-index 0) at 1 and 2. */
.mhero-photo {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: var(--photo-left);
  overflow: hidden;
}
.mhero-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: #a8796a;
  mix-blend-mode: multiply;
  opacity: 0.26;
  pointer-events: none;
}
.mhero-photo::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  background-color: #d6c4a8;
  mix-blend-mode: screen;
  opacity: 0.16;
  pointer-events: none;
}

/* Crossfade stack. Only opacity animates, so this stays on the compositor. */
.mhero-frame {
  z-index: 0;
  opacity: 0;
  transition: opacity 1200ms ease-in-out;
}
.mhero-frame[data-on='true'] {
  opacity: 1;
}

/* Cropped by the frame on purpose. Anchored to the TOP: rotated vertical-rl
   reads bottom-to-top, so the element's BOTTOM edge is the H — anchoring
   there eats the first letter and the word reads "ITOMI". */
.mhero-word {
  position: absolute;
  left: var(--word-left);
  top: -5cqh;
  z-index: 5;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--word-size);
  line-height: var(--word-lh);
  letter-spacing: 0.01em;
  color: #2c2c2c;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

.mhero-rail {
  position: absolute;
  left: 0;
  top: 50%;
  z-index: 6;
  transform: translateY(-50%) rotate(180deg);
  writing-mode: vertical-rl;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 10px;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #7a7570;
}

/* One flow container, so eyebrow / headline / CTAs cannot collide either. */
.mhero-content {
  position: absolute;
  left: var(--content-left);
  top: 16%;
  right: 5vw;
  z-index: 4;
}
.mhero-title {
  font-family: var(--font-serif);
  font-weight: 300;
  line-height: 0.95;
  font-size: clamp(2.4rem, 6.2vw, 5.6rem);
  color: #2c2c2c;
  white-space: nowrap;
}
.mhero-byline {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.3em; /* em, so it tracks the h1 clamp */
  font-style: italic;
  letter-spacing: 0.02em;
  color: #a8796a;
  white-space: nowrap;
}
.mhero-note {
  position: absolute;
  left: var(--content-left);
  bottom: 12%;
  z-index: 6;
  width: 126px;
  font-family: var(--font-sans);
  font-weight: 300;
  font-size: 10.5px;
  line-height: 1.62;
  text-align: justify;
  color: #2c2c2c;
}

.mhero-seamfade {
  display: none;
}

/* ── Small screens ───────────────────────────────────────────────────
   The desktop split cannot survive here — the word band alone would eat
   most of a 390px viewport. The seam turns horizontal (photo top, cream
   panel below) and the word runs down the left edge across BOTH.
   900px, not 768px: between them the word band + headline + two buttons
   do not fit beside a 46% pane and the CTAs wrap onto the photograph. */
@media (max-width: 900px) {
  .mhero {
    --word-left: 3.5cqw;
    --word-size: 19cqh;
    --gutter: 5cqw;
    height: 92vh;
    max-height: none;
  }
  .mhero-photo {
    left: 0;
    right: 0;
    top: 0;
    bottom: 38%;
  }
  /* At this size the word is shorter than the hero — show it whole. */
  .mhero-word {
    top: auto;
    bottom: 4%;
  }
  /* Some frames are tight face crops, so the word would cross bare skin
     and go muddy — and which frame is showing changes every 4s, so
     per-photo tuning cannot fix it. Fade the foot of the photo to cream
     and the word always crosses that instead. */
  .mhero-seamfade {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 38%;
    height: 24%;
    z-index: 3;
    pointer-events: none;
    background: linear-gradient(to bottom, rgba(250, 247, 244, 0), #faf7f4);
  }
  .mhero-content {
    top: auto;
    bottom: 6%;
  }
  .mhero-title {
    white-space: normal;
    font-size: clamp(2rem, 9vw, 3rem);
  }
  .mhero-rail,
  .mhero-note {
    display: none;
  }
}
```

- [ ] **Step 2: Rewrite `src/components/home/HeroSection.tsx`**

```tsx
import HeroPhotoRotator from './HeroPhotoRotator'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="mhero">
      <HeroPhotoRotator />

      {/* Gives the vertical word a pale bed to cross on small screens. */}
      <div className="mhero-seamfade" aria-hidden="true" />

      <p className="mhero-rail">Sapporo · Hokkaido · Japan</p>

      {/* Decorative. The real heading is the h1 below — this must never
          become one, and screen readers must not read it. */}
      <div className="mhero-word" aria-hidden="true">
        HITOMI
      </div>

      <div className="mhero-content">
        <p className="hero-eyebrow font-sans text-[10px] uppercase tracking-[0.24em] text-[#7A7570]">
          Bridal Makeup &amp; Hair
        </p>

        <h1 className="hero-title mhero-title mt-[1.1rem]">
          Bridal
          <br />
          <em>Beauty</em>
          <span className="mhero-byline">by Hitomi</span>
        </h1>

        <div className="hero-cta mt-10 flex flex-wrap items-center gap-3">
          <Button href="/portfolio" variant="filled" size="lg">
            View My Work
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Book a Session
          </Button>
        </div>
      </div>

      <p className="hero-body mhero-note">
        Bridal makeup and wedding hairstyling in Sapporo, Hokkaido. Twelve years
        refining a single craft — looks built for the length of a whole day, and
        for the photographs that outlive it.
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Create a placeholder `HeroPhotoRotator` so Task 1 compiles and renders one frame**

Task 2 replaces this file entirely. It exists now only so Task 1 is independently testable.

```tsx
import Image from 'next/image'

export default function HeroPhotoRotator() {
  return (
    <div className="mhero-photo">
      <Image
        src="/images/portfolio/bridal-makeup-natural-updo-elegant-portrait-sapporo.jpg"
        alt="Bride with a natural updo and soft bridal makeup, Sapporo"
        fill
        priority
        sizes="(max-width: 900px) 100vw, 54vw"
        className="mhero-frame object-cover"
        data-on="true"
        style={{ objectPosition: '55% 20%' }}
      />
    </div>
  )
}
```

- [ ] **Step 4: Verify it compiles and builds**

Run:
```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all three exit 0, no errors.

- [ ] **Step 5: Screenshot at all five widths and check for overlap**

Start the dev server in one shell (`npm run dev`), then:
```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p /tmp/hero && for s in 1440x900 1280x800 1024x1366 820x1180 390x844; do
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --window-size=${s%x*},${s#*x} --virtual-time-budget=6000 \
    --screenshot=/tmp/hero/$s.png http://localhost:3000/ 2>/dev/null
done && ls -l /tmp/hero/
```

Open all five and confirm **every one** of these:
1. The word reads **HITOMI** in full. A clipped terminal `I` is intended; a clipped `H` is a bug (see the CSS comment on `.mhero-word`).
2. Nothing overlaps the word — not the eyebrow, headline, byline, CTAs, or note.
3. Both CTA buttons are fully legible and not sitting on a dark part of the photograph.
4. At 820 and 390 the layout is stacked (photo on top, cream panel below). **820 and 1024 are load-bearing** — the `vh`/`max-height` desync bug was invisible at both 1440 and 390.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/home/HeroSection.tsx src/components/home/HeroPhotoRotator.tsx
git commit -m "feat: magazine hero composition"
```

---

### Task 2: Five-frame crossfade rotation

**Files:**
- Rewrite: `src/components/home/HeroPhotoRotator.tsx`

**Interfaces:**
- Consumes: CSS classes `mhero-photo`, `mhero-frame` and the `data-on` attribute selector from Task 1.
- Produces: nothing consumed by later tasks. `HeroSection` already imports this component with a no-prop signature — do not add props.

- [ ] **Step 1: Rewrite `src/components/home/HeroPhotoRotator.tsx`**

Every `objectPosition` below is per-frame and verified. A single shared value crops `close-up-coral-tones` straight through the subject's forehead — do not collapse these into one.

```tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

/** 4s hold; the crossfade itself is 1200ms, set in globals.css. */
const HOLD_MS = 4000

const FRAMES = [
  {
    src: '/images/portfolio/bridal-makeup-natural-updo-elegant-portrait-sapporo.jpg',
    objectPosition: '55% 20%',
    alt: 'Bride with a natural updo and soft bridal makeup, Sapporo',
  },
  {
    src: '/images/portfolio/editorial-makeup-messy-bun-pearl-earrings-sapporo.jpg',
    objectPosition: '72% 50%',
    alt: '',
  },
  {
    src: '/images/portfolio/bridal-makeup-close-up-coral-tones-hokkaido.jpg',
    objectPosition: '50% 8%',
    alt: '',
  },
  {
    src: '/images/portfolio/bridal-makeup-portrait-half-up-hair-sapporo.jpg',
    objectPosition: '50% 25%',
    alt: '',
  },
  {
    src: '/images/portfolio/bridal-makeup-long-wavy-hair-floral-lace-gown-sapporo.jpg',
    objectPosition: '50% 20%',
    alt: '',
  },
] as const

export default function HeroPhotoRotator() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    // Static hero under reduced motion: frame 0 stays, no timer is created.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timer: number | undefined

    const start = () => {
      if (timer === undefined) {
        timer = window.setInterval(
          () => setActive((prev) => (prev + 1) % FRAMES.length),
          HOLD_MS
        )
      }
    }
    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer)
        timer = undefined
      }
    }
    // A backgrounded tab should not burn a crossfade every four seconds.
    const onVisibility = () => (document.hidden ? stop() : start())

    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="mhero-photo">
      {FRAMES.map((frame, i) => (
        <Image
          key={frame.src}
          src={frame.src}
          alt={frame.alt}
          fill
          /* Frame 0 is the LCP element. The rest must NOT be priority or
             they compete for bandwidth during first paint. */
          priority={i === 0}
          sizes="(max-width: 900px) 100vw, 54vw"
          className="mhero-frame object-cover"
          data-on={i === active}
          style={{ objectPosition: frame.objectPosition }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles and builds**

Run:
```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all three exit 0.

- [ ] **Step 3: Assert exactly one frame is marked active, and only one is priority**

With `npm run dev` running:
```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --virtual-time-budget=3000 \
  --dump-dom http://localhost:3000/ 2>/dev/null > /tmp/hero/dom.html
echo "frames:        $(grep -o 'mhero-frame' /tmp/hero/dom.html | wc -l)"
echo "data-on=true:  $(grep -o 'data-on="true"' /tmp/hero/dom.html | wc -l)"
echo "high priority: $(grep -oi 'fetchpriority="high"' /tmp/hero/dom.html | wc -l)"
```
Expected: `frames: 5`, `data-on=true: 1`, `high priority: 1`.

- [ ] **Step 4: Prove the rotation actually advances**

Screenshot the same page at two different page ages and confirm the bytes differ — frame 0 holds for 4s, so a 2s shot and a 7s shot must land on different frames:
```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for t in 2000 7000; do
  "$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1440,900 \
    --virtual-time-budget=$t --screenshot=/tmp/hero/t$t.png \
    http://localhost:3000/ 2>/dev/null
done
cmp -s /tmp/hero/t2000.png /tmp/hero/t7000.png \
  && echo "FAIL — rotation did not advance" \
  || echo "PASS — frames differ"
```
Expected: `PASS — frames differ`. Open both to confirm the difference is the photograph, not a layout shift.

- [ ] **Step 5: Check every frame's crop by watching one full cycle**

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for t in 1000 5000 9000 13000 17000; do
  "$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1440,900 \
    --virtual-time-budget=$t --screenshot=/tmp/hero/cycle-$t.png \
    http://localhost:3000/ 2>/dev/null
done
```
Open all five. Confirm no crop cuts through a subject's face, and that all five distinct photographs appear across the set. Repeat at `--window-size=390,844` and confirm the vertical word crosses the cream fade rather than bare skin.

- [ ] **Step 6: Verify reduced motion creates no timer**

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for t in 2000 12000; do
  "$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1440,900 \
    --force-prefers-reduced-motion --virtual-time-budget=$t \
    --screenshot=/tmp/hero/rm-$t.png http://localhost:3000/ 2>/dev/null
done
cmp -s /tmp/hero/rm-2000.png /tmp/hero/rm-12000.png \
  && echo "PASS — static under reduced motion" \
  || echo "FAIL — rotation ran anyway"
```
Expected: `PASS`. If the flag is unsupported by the installed Chrome, fall back to DevTools' *Rendering → Emulate prefers-reduced-motion* and confirm by eye over 12s.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/HeroPhotoRotator.tsx
git commit -m "feat: rotate hero photos on a 4s crossfade"
```

---

### Task 3: Remove dead code and close the reduced-motion gap

**Files:**
- Delete: `src/components/home/HeroImageSequence.tsx`
- Modify: `src/app/globals.css:172-209` (the existing `/* Hero entrance animations */` block)

**Interfaces:**
- Consumes: nothing. Produces: nothing. This task is cleanup and an accessibility fix.

- [ ] **Step 1: Confirm `HeroImageSequence` is genuinely unreferenced**

```bash
grep -rn "HeroImageSequence" src/ || echo "UNREFERENCED — safe to delete"
```
Expected: `UNREFERENCED — safe to delete`. **If anything is printed, stop** and remove the reference first — do not delete a file that is still imported.

- [ ] **Step 2: Delete it**

```bash
git rm src/components/home/HeroImageSequence.tsx
```

- [ ] **Step 3: Check whether `.hero-image` is still used**

```bash
grep -rn "hero-image" src/ || echo "UNUSED"
```
If it prints `UNUSED`, delete the `.hero-image` rule and the `@keyframes heroCinema` block from `globals.css` — they existed only for the deleted component. If it is still referenced, leave both alone.

- [ ] **Step 4: Add the missing reduced-motion guard**

The existing entrance animations (`.hero-eyebrow`, `.hero-title`, `.hero-body`, `.hero-cta`) run unconditionally — a pre-existing gap, and `HeroSection` still uses three of those classes. Append immediately after the entrance-animation block in `globals.css`:

```css
/* These entrance animations predate the magazine hero and had no guard.
   HeroSection still uses .hero-eyebrow, .hero-title and .hero-cta, so the
   guard belongs here rather than in the component. */
@media (prefers-reduced-motion: reduce) {
  .hero-eyebrow,
  .hero-title,
  .hero-body,
  .hero-cta,
  .hero-image {
    animation: none;
  }
}
```

If Step 3 removed `.hero-image`, drop it from this selector list too.

- [ ] **Step 5: Full verification sweep**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all exit 0.

Then, with `npm run dev` running, assert semantics:
```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --virtual-time-budget=3000 \
  --dump-dom http://localhost:3000/ 2>/dev/null > /tmp/hero/final.html
echo "h1 count:      $(grep -o '<h1' /tmp/hero/final.html | wc -l)"
echo "byline in h1:  $(grep -c 'mhero-byline' /tmp/hero/final.html)"
echo "word hidden:   $(grep -c 'mhero-word[^>]*aria-hidden\|aria-hidden[^>]*mhero-word' /tmp/hero/final.html)"
```
Expected: `h1 count: 1`, `byline in h1: 1`, `word hidden: 1`.

- [ ] **Step 6: Confirm the rest of the homepage is untouched**

Scroll the running page and confirm `IntroSection`, `WaveBendPromise`, `ServicesPreview`, `FeaturedGallery`, `TestimonialsSection` and `InstagramCTA` all still render and the two GSAP pinned sections still scrub. The hero changed the top of the document, and `globals.css` disables smooth scrolling via `html:not(:has(.pin-height))` — confirm that rule still matches (the homepage gets `.pin-height` from `WaveBendPromise` and `FeaturedGallery`, neither of which this plan touches).

- [ ] **Step 7: Commit**

```bash
git add -A src/
git commit -m "chore: drop superseded hero image sequence, guard entrance animations"
```

---

## Open questions carried from the spec

These are recorded, not resolved. None blocks implementation:

1. **Is 4s the right hold?** Owner's stated number; not yet watched for a full 20s cycle in situ. Tunable via `HOLD_MS`.
2. **Alt text for frames 1–4.** This plan uses `alt=""` (decorative) for all but the LCP frame, on the grounds that they are rotating decoration and the same photographs carry descriptive alts on `/portfolio`. Change all five together if the owner disagrees — do not mix policies.
3. **Copy.** Every string is placeholder pending Hitomi's sign-off.

## Self-review notes

- **Spec coverage:** layout contract → T1S1; structure/sizing → T1S1–2; rotation + per-frame `object-position` → T2S1; semantics/`aria-hidden`/h1 → T1S2 + T3S5; performance/`priority`/`sizes` → T2S1 + T2S3; reduced motion → T2S1, T2S6, T3S4; all six pitfalls → encoded as CSS comments in T1S1 and as gates in T1S5, T2S3–S6.
- **Deliberate deviation:** buttons use the site's `Button` component (terracotta `filled`) rather than the prototype's ink buttons. Flagged in Task 1.
- **Naming consistency:** `HeroPhotoRotator` is created in T1S3 and rewritten in T2S1 with the same no-prop signature and the same `mhero-photo` / `mhero-frame` / `data-on` contract from T1S1.
