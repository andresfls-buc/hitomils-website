# Homepage Portfolio — 3D Tilt Wheel — Design

Date: 2026-08-05
Status: Approved, ready for implementation

## Goal

Replace the homepage portfolio effect in `src/components/home/FeaturedGallery.tsx`
— currently a pinned "photo stream" adapted from madewithgsap Effect 072 — with a
3D tilt wheel adapted from madewithgsap **Effect 106 ("3D Tilt Wheel")**, using
the existing portfolio photographs.

## How the reference was derived

The source page is member-gated. `https://madewithgsap.com/effects/effect106` and
`.../effects/tutorial106` serve only the HTML skeleton plus a paywall lock — no
CSS, no JS. The only public prose is the effect's own description:

> "images travel around a circle that drifts on its own. The whole ring tilts
> with the pointer, and scrolling pushes the tiles farther apart while easing the
> perspective to sell the stretch"

and the HTML structure:

```html
<section class="mwg_effect106">
    <div class="container">
        <div class="medias">
            <img class="media" src="./assets/medias/01.png" alt="">
            …
        </div>
    </div>
</section>
```

Everything else below was reverse-engineered from the published preview video
(`https://pub-8ca9b5847fbb4d4fb97b3497fb9521d5.r2.dev/video_OPTIM/106.mp4`,
5.03s, 1280×720, 30fps), by extracting frames with AVFoundation and inspecting
them at full resolution, then rebuilt from scratch and screenshot-verified
against those frames.

### The three decisive observations

1. **Every tile is a perfectly axis-aligned rectangle.** Zero keystoning, zero
   rotation — even in frames where the whole formation sits at roughly a 30°
   diagonal. Therefore the tiles are *billboarded*: they counter-rotate against
   their parent rather than lying on the ring's surface.
2. **Tiles form a flattened ellipse** — a lower arc of large tiles and an upper
   arc of small ones. That is the near half and far half of a single ring viewed
   nearly edge-on. Near-to-far size ratio is roughly 2.5 : 1, which is real CSS
   `perspective`, not a `scale` tween.
3. **The ellipse's tilt swings across frames**, so the tilt is pointer-driven,
   not a fixed baked-in angle.

A rotation about Y alone leaves a circle lying in the XZ plane unchanged, so the
observed diagonal requires the circle to lie in the **XY plane** (screen-parallel)
with both `rotateX` and `rotateY` applied to the wrapper.

## The mechanism

One wrapper (`.medias`) with `transform-style: preserve-3d` sits inside a
container that carries `perspective`. Tiles are absolutely positioned at the
wrapper's origin and pushed onto a circle in the XY plane.

For tile *i* of *N*:

```
θ    = spin + (i / N) · 2π
R    = radius_vw · innerWidth / 100          // px
x, y = cos θ · R,  sin θ · R

wrapper.transform = rotateX(tiltX) rotateY(tiltY)
tile.transform    = translate3d(x, y, 0) rotateY(-tiltY) rotateX(-tiltX) translate(-50%, -50%)
```

The trailing inverse rotation is the entire trick. CSS composes transforms
outer-to-inner, so the tile's net orientation is
`Rx(tiltX)·Ry(tiltY)·Ry(−tiltY)·Rx(−tiltX) = I` — flat and facing the camera —
while its **position** is still rotated by `Rx(tiltX)·Ry(tiltY)`. Perspective then
scales each tile by its resulting depth, producing the near-large / far-small
ramp for free.

The final `translate(-50%, -50%)` must come **last** (innermost) so it is applied
in the tile's own already-unrotated plane and therefore centres it on screen.

### Depth sorting is free

`preserve-3d` makes the compositor sort tiles by real depth. **Do not set
`z-index` on tiles**, and do not compute one per frame — the outgoing photo-stream
effect did that because it was a 2D scale illusion; this one is genuine 3D and
manual z-index would fight the compositor.

### Working reference prototype

`docs/superpowers/specs/2026-08-05-portfolio-3d-tilt-wheel-prototype.html` is a
runnable, dependency-free implementation of the mechanism above, on cream, using
this repository's own portfolio photographs. Open it in a browser to see the live
effect, or append query params to force a deterministic frame:
`?p=<scroll 0..1>&mx=<pointer x −1..1>&my=<pointer y −1..1>&spin=<rad>&tx=<deg>`.

It is the source of truth for the geometry. Where this document and the prototype
disagree, the prototype is right.

## The four motions

| driver | moves | values |
|---|---|---|
| autonomous drift | `spin` | `+2π` over 45s, `repeat: -1`, `ease: 'none'` |
| pointer (fine pointers only) | `tiltX`, `tiltY` | `72° ± 14°`, `0° ± 22°`, lerped 0.08/frame |
| scroll (scrubbed, pinned) | `radius`, `perspective` | `22 → 36` vw, `1200 → 2200` px |
| scroll (coarse pointers only) | `tiltX`, `tiltY` | `72° → 62°`, `(p − 0.5) · 30°` |

Pointer input is normalised to −1..1 across the viewport:
`px = (clientX / innerWidth − 0.5) · 2`, likewise for `py`.

`tiltX` is the base edge-on angle of the wheel. 72° was matched against the
reference frames: for a circle rotated by α about the horizontal axis, the
projected minor/major axis ratio is `cos α`; the measured ratio in the reference
is ≈ 0.27, giving α ≈ 74°, and 72° reads correctly once perspective asymmetry is
included.

## Verified parameter values

These were screenshot-matched against reference frames at 1280×720 and are the
values the implementation should ship with:

| parameter | desktop | mobile (`max-width: 767.98px`) |
|---|---|---|
| tile count | 16 | 10 |
| tile width | `10vw`, min `120px` | `26vw` |
| tile aspect | 3 / 4 | 3 / 4 |
| radius (scroll start → end) | 22vw → 36vw | 30vw → 44vw |
| perspective (start → end) | 1200px → 2200px | 900px → 1600px |
| base `tiltX` | 72° | 72° → 62° over scroll |
| pointer `tiltX` swing | ±14° | n/a |
| pointer `tiltY` swing | ±22° | `(p − 0.5) · 30°` |
| spin period | 45s | 45s |

## Section structure

The component keeps its filename, default export, and surrounding furniture, so
`src/app/page.tsx` is untouched.

```
<section>                                   ← py-24 md:py-32 px-6, cream
  <Reveal><SectionTitle subtitle="Portfolio" title="Selected Work" /></Reveal>
  <div ref={runwayRef} class="pin-height … motion-reduce:hidden">   ← 280vh / 200vh
    <div ref={stageRef} class="h-screen overflow-hidden">           ← pinned
      <div ref={containerRef}>                                      ← perspective
        <div ref={wheelRef}>                                        ← preserve-3d
          … tiles …
        </div>
      </div>
    </div>
  </div>
  <div class="hidden motion-reduce:block">…static grid…</div>
  <Reveal><Button href="/portfolio">Full Portfolio</Button></Reveal>
</section>
```

Constraints that must be preserved from the existing component:

- The **`.pin-height` class must stay.** `globals.css` disables native smooth
  scrolling via `html:not(:has(.pin-height))` because it fights ScrollTrigger's
  scrub. Removing the class reintroduces scroll jitter.
- The **`motion-reduce` static grid stays.** Under
  `prefers-reduced-motion: reduce`, GSAP is never initialised at all and the
  plain grid is shown instead.
- Image selection uses the existing `pickEven` helper over `portfolioImages`, so
  the chosen photos stay spread across the whole portfolio rather than clustering
  in one category.

## Visual treatment

Background stays cream (`#FAF7F4`) — the site's own background, not the
reference's black. Because overlapping photographs need separation on a light
ground, each tile carries the shadow already used by the outgoing effect:

```
box-shadow: 0 18px 50px rgba(44, 44, 44, 0.16);
```

Verified by screenshot: the wheel reads clearly on cream with this shadow.

## Rendering and lifecycle

- A **single** `gsap.ticker` callback writes every transform. No per-tile
  `requestAnimationFrame`, and no per-frame `gsap.set` — since we compose the
  whole transform string ourselves, write it straight to `el.style.transform`.
  That is both the fastest path and the least ambiguous one.
- All setup lives inside `gsap.context(…, runwayRef)` and `gsap.matchMedia()`, so
  breakpoint changes and unmount revert every tween, ScrollTrigger, and listener.
  The ticker callback and the `pointermove` listener must be removed explicitly in
  the matchMedia cleanup function, since GSAP does not track those.
- `useLayoutEffect` is aliased to `useEffect` on the server, matching the existing
  `useIsomorphicLayoutEffect` pattern in the file.
- Tiles use `next/image` with `fill` inside an explicitly sized wrapper `div`
  (the transform lives on the wrapper, not the `<img>`), with a `sizes` attribute
  and `loading="eager"` for the first three.
- `will-change: transform` on tile wrappers.

## Non-goals

- No physics, no Draggable, no inertia. The `matter-js` and `Draggable` scripts
  present on the madewithgsap page are loaded site-wide on every effect page
  (verified identical on effect105 and effect107) and are unrelated to this
  effect.
- No click/lightbox behaviour on tiles. The section links onward through the
  existing "Full Portfolio" button.
- The `/portfolio` page's triple-marquee is untouched.

## Verification

1. `npm run build` and `npm run lint` both clean.
2. Headless-Chrome screenshots of the running dev server at the section's scroll
   start, middle, and end show: an elliptical ring of upright photographs, larger
   at the near arc and smaller at the far arc, spreading outward as scroll
   progresses.
3. No hydration warnings in the dev console.
4. With `prefers-reduced-motion: reduce` forced, the static grid renders and no
   ScrollTrigger pin is created.
