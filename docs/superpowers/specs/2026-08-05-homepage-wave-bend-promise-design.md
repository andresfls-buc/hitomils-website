# Homepage Wave Bend Promise — Design

Date: 2026-08-05
Status: Approved, ready for implementation

## Goal

Add a new interstitial section to the homepage, between `IntroSection` ("About
the Artist") and `ServicesPreview` ("What I Offer"), adapted from madewithgsap
**Effect 104 ("Wave Bend Content")**.

The section carries a single reassuring promise to the bride, set in giant
display type that travels horizontally as she scrolls, with two portfolio
photographs riding the same line. The faster she scrolls, the more the straight
line bends into a wave.

## The copy

Three text segments with a photograph between each:

| # | segment |
|---|---|
| 1 | text — `It's your day` |
| 2 | image — `/images/portfolio/bridal-makeup-natural-ethereal-close-up-sapporo.jpg` |
| 3 | text — `I'll take care of everything` |
| 4 | image — `/images/portfolio/bridal-hair-half-up-hotel-smiling-hokkaido.jpg` |
| 5 | text — `you just enjoy it` |

Read as one sentence: *"It's your day — I'll take care of everything — you
just enjoy it."*

Voice is first person singular (`I'll`), matching the rest of the site
(`IntroSection` says "I specialize…", "I would be honored…"). Do not change it
to "we".

## How the reference was derived

Unlike Effect 106, `https://madewithgsap.com/effects/tutorial104` publishes the
**full HTML including both SVG paths** before the paywall cuts in. The CSS and JS
are still gated. The public description:

> "type and images travel along a single SVG path as we scroll down the page.
> The faster we scroll, the more that straight line bends into a sinusoid."

and the structure — a tall `.pin-height` wrapper, a viewport-sized `.container`,
one oversized SVG holding a visible straight `#line`, a hidden `#wave` used only
as a morph target, and a `#track` group listing every `.segment` in travel order.

The two paths are taken verbatim from that public markup:

```
#line  M0 195H644H1288H1932H2576
#wave  M0.21875 190.5C0.21875 190.5 382.004 0.5 644.219 0.5C906.434 0.5 1051.3
       78.1239 1288.22 190.5C1531.72 306 1668.87 390.5 1932.22 390.5C2195.57
       390.5 2576.22 190.5 2576.22 190.5
```

Both have five anchor points at matching x positions (0, 644, 1288, 1932, 2576),
which is why MorphSVG maps them 1:1 without a shapeIndex hint.

The animation logic below was reconstructed from the preview video
(`.../video_OPTIM/104.mp4`) and verified by a working prototype. See
[[reference-madewithgsap-reverse-engineering]] for the general method.

### Working reference prototype

`docs/superpowers/specs/2026-08-05-homepage-wave-bend-promise-prototype.html`
is a runnable, screenshot-verified implementation. Query params force a
deterministic frame: `?p=<progress 0..1>&bend=<0..1>&sw=<svg width vw>&sh=<stage
height vh>`. **Where this document and the prototype disagree, the prototype is
right.**

## The mechanism

### Segments are positioned by path length, not by x

Every segment has a width in SVG user units — text via `getComputedTextLength()`,
images via their fixed width. They are laid end to end into a "train" with a
constant gap, giving each segment a cumulative offset `at` from the train's head.

Per frame:

```
head        = baseLen − progress · travel
travel      = baseLen + trainLen          // baseLen = straight #line length
segmentPos  = head + segment.at
```

At `progress = 0` the head sits at the right end of the path and the first
segment is just entering; at `progress = 1` the whole train has cleared the left
end.

- **Text** is placed by writing `startOffset` on its `<textPath href="#line">`.
  The browser bends the glyphs along the path for free.
- **Images** are placed by sampling the live path:
  `getPointAtLength(mid)` for position, and the angle between
  `getPointAtLength(mid ± 1)` for rotation, so images tilt with the wave exactly
  as the letters do. Past either end of the path the position must be
  **extrapolated along the end tangent**, never clamped — see pitfall 5.

Because both read from the same `#line` element, text and images stay locked
together no matter how far the path is bent.

### The bend is scroll velocity, not scroll position

A **paused** MorphSVG tween is created once:

```js
const morph = gsap.to(line, { morphSVG: { shape: '#wave' }, duration: 1, paused: true, ease: 'none' })
```

Each frame, `morph.progress(bend)` sets a static partial morph. `bend` chases a
target derived from ScrollTrigger's velocity and decays back to straight:

```
targetBend = min(|self.getVelocity()| / 2600, 1) · MAX_BEND
bend      += (targetBend − bend) · 0.08
```

`MAX_BEND = 0.35`. This matters: at `progress(1)` the wave is violently
over-bent and the line leaves the band entirely. 0.35 reproduces the gentle arc
seen in the reference video.

## Sizing

| | desktop (≥768px) | mobile |
|---|---|---|
| runway height | 200vh | 200vh |
| pinned stage height | 100vh | 100vh |
| svg width | 110vw | 170vw |
| font-size (user units) | 300 | 300 |
| image size (user units) | 280 × 280 | 280 × 280 |
| gap between segments (user units) | 120 | 120 |

Everything scales off the svg's rendered width, since the viewBox is fixed at
`0 0 2577 391`. At 110vw on a 1440px viewport the type renders at ~184px, which
matches the reference's proportion of roughly a quarter of the band height.

**The stage must be viewport-height, not band-height.** A pinned element sticks
to the *top* of the viewport, so a 60vh stage would leave the line hanging at the
top of the screen with 40vh of empty pin-spacer below it. Making the stage
`h-screen` and centring the svg inside it with flexbox produces the intended
centred band — this is why the reference describes "a viewport-sized container".

## Visual treatment

- Ground stays the site cream (`#FAF7F4`). No band, no dark slab — the section
  must read as continuous with About above and Services below.
- Type: `--font-cormorant` (Cormorant Garamond), weight 300, fill `#2C2C2C`.
- Images: square, `clip-path: url(#round-clip)` using the reference's
  `objectBoundingBox` rect with `rx=".08"`, and
  `preserveAspectRatio="xMidYMid slice"` so portraits crop rather than squash.
- `#wave` is never visible — `fill: none`, `opacity: 0`. It exists only as a
  morph target.

## Five pitfalls that fail silently

Each of these produces silently wrong output rather than an error, so they are
called out explicitly:

1. **The `<svg>` must be `flex: 0 0 auto`.** The stage centres its child with
   flexbox, and as a flex item the svg defaults to `flex-shrink: 1` — it
   silently shrinks to the container width and ignores `width: 110vw` entirely.
   The symptom is type roughly a third of the intended size, which is easy to
   mistake for a font-size problem and "fix" in the wrong place.
2. **The `<svg>` must be `overflow: visible`.** Segments spend most of their life
   outside the 2577-unit canvas and would otherwise be clipped away at both ends.
   The pinned stage does the clipping instead, via `overflow: hidden`.
3. **Do not gate this on `gsap.matchMedia()` with only a reduced-motion query.**
   A matchMedia context is activated only when at least one of its queries
   matches — `gsap-core.js` does `anyMatch && matches.push(c)`. A lone
   always-false `prefers-reduced-motion` query therefore never runs its callback
   at all, and every segment stays at `startOffset` 0, stacked on top of each
   other. `useTiltWheel` gets away with matchMedia only because it also carries
   `isMobile`/`isDesktop`, one of which always matches. Use a plain
   `window.matchMedia(...).matches` guard here.
5. **Measure segment widths every frame, not once.** `getComputedTextLength()`
   reports fallback-font widths until the webfont is actually applied to the SVG
   text, and `document.fonts.ready` is **not** a reliable barrier for that — it
   resolves for the fonts loaded so far, which on a slow phone can be before
   Cormorant reaches these `<text>` nodes. Measuring once loses that race
   silently: the train is laid out with wrong widths and never corrects itself,
   so segments overlap. This showed up only on mobile in production, where the
   race is lost. Three `getComputedTextLength()` calls per frame cost nothing
   next to the `getPointAtLength()` calls already there, and measuring per frame
   also removes the need to defer setup on `document.fonts.ready` at all.
6. **Never clamp an image's position with `getPointAtLength()`.** It clamps to
   the path's ends, so once an image's centre passes either end it parks there
   instead of travelling off-screen. Text is unaffected, so the symptom is the
   sentence flowing away normally while the photographs pile up at the left edge.
   Extrapolate along the end tangent for the overshoot.
4. **Read `trigger.progress` inside the render loop, not cached from `onUpdate`.**
   `onUpdate` fires only when the scroll *changes*. Since `setup()` waits on
   `document.fonts.ready`, the trigger can be created when the visitor is already
   inside the section — a slow font load, or a reload part-way down the page —
   and the train then sits parked off-screen until they scroll again.

## Section structure

```
<section>                                          ← cream, no padding of its own
  <div class="pin-height">                         ← 200vh runway, motion-reduce:hidden
    <div class="stage">                            ← h-screen, pinned, flex-centred, overflow-hidden
      <svg viewBox="0 0 2577 391">
        <defs><clipPath id="round-clip">…</clipPath></defs>
        <path id="line"/>  <path id="wave"/>
        <g id="track"> text · image · text · image · text </g>
      </svg>
    </div>
  </div>
  <div class="hidden motion-reduce:block">…static fallback…</div>
</section>
```

`pin-height` is deliberate: `globals.css` disables native smooth scrolling via
`html:not(:has(.pin-height))` because it fights ScrollTrigger's scrub. The
homepage already carries the class through `FeaturedGallery`; using it here keeps
the convention and matches the reference's own class name.

### Reduced motion

Under `prefers-reduced-motion: reduce` the runway is hidden and GSAP never
initialises. A static fallback renders the same promise as ordinary centred
markup — the sentence as a Cormorant heading with the two photographs beside it,
no pin, no morph, no travel.

## SVG ids must be unique per document

`#line`, `#wave`, `#track` and `#round-clip` are document-global. The homepage
renders this section once, so plain ids are fine. If the section is ever reused
on the same page, the ids must be suffixed — note it here so the next person
does not discover it by way of two sections fighting over one path.

## Non-goals

- No pointer interaction. Scroll is the only input.
- No infinite loop — the train passes once across the runway and is done.
- No text splitting or per-character animation; `<textPath>` does the bending.
- `FeaturedGallery`, `/portfolio`, and every other section are untouched.

## Verification

1. `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.
2. Live screenshots at 1440×900 show giant Cormorant type and rounded photos
   travelling along a straight line at rest, and along a gentle arc while
   scrolling.
3. Live screenshot at 390×844 shows the same, proportionally larger relative to
   the viewport.
4. With `prefers-reduced-motion: reduce` forced, the static fallback renders and
   no pin is created.
5. The section appears between About and Services, in that order.
