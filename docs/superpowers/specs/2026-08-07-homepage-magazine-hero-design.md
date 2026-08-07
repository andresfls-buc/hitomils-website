# Homepage Magazine Hero — Design

Date: 2026-08-07
Status: Awaiting copy sign-off; structure approved

## Goal

Replace `HeroSection` with an editorial, magazine-cover composition: an oversized
vertical **HITOMI** set in Cormorant Garamond running the full height of a cream
margin, a photo pane to its right carrying a warm wash, and a rotating set of
five portfolio photographs that crossfade every four seconds.

The existing hero is a stock split-screen — cream text column left, one photo
right, a single fade-and-scale on mount. Everything below it on the homepage
(`WaveBendPromise`, `FeaturedGallery`) is scroll-driven and far more ambitious,
so the first thing a bride sees is the least considered thing on the page. This
inverts that.

## The reference, and what was not carried over

Derived from a pinned magazine layout supplied by the site owner
(`https://jp.pinterest.com/pin/10133167906901327/`, image
`i.pinimg.com/1200x/a3/45/c2/a345c27971c6b8de6d06203096bfcb0c.jpg`).

Carried over:

- An oversized vertical display word, cropped by the frame rather than fitted to it.
- A narrow left rail of tiny tracked-out caption text.
- A justified micro-column of body copy set at caption size.
- Asymmetric composition — margin left, full-bleed photo right.

Deliberately **not** carried over:

1. **The hard-edged monochrome rectangle over the subject's eyes.** Vetoed by the
   owner. It also reads as fashion-editorial rather than bridal.
2. **The cobalt duotone.** Tested and rejected — see below.
3. **Type/headline occlusion.** In the reference the giant word passes *in front
   of* the horizontal headline. This was built, shown, and rejected: the owner
   read it as a collision rather than a device. The word and headline now occupy
   strictly separate columns. **Do not reintroduce the overlap.**

### Why the wash is warm and weak, not blue and strong

Roughly half the reference's impact is a saturated cobalt wash over a mid-tone
photograph. Three treatments were prototyped:

| | Treatment | Verdict |
|---|---|---|
| A | No wash, palette untouched | Handsome, tame |
| B | Full-bleed photo, cream word knocked out over it | Most arresting, but the scrim needed for text contrast visibly mutes the photo |
| C | Terracotta multiply + gold-light screen | **Chosen** |

C was initially assessed as too weak to bother with — at a 30% photo pane the
wash was nearly indistinguishable from A. That assessment was wrong once the
pane widened to 46%: the wash turns the studio backdrops from grey-white to warm
beige, which unifies the photo with the cream margin instead of letting it read
cool against it. It also satisfies the owner's explicit constraint of **no black
and white and no desaturation** — a constraint B's scrim violates.

Wash values: `--terracotta #A8796A` at `mix-blend-mode: multiply`, `opacity .26`,
plus `--gold-light #D6C4A8` at `mix-blend-mode: screen`, `opacity .16`.

### Working reference prototype

`docs/superpowers/specs/2026-08-07-homepage-magazine-hero-prototype.html` is a
runnable, screenshot-verified implementation of all three studies. Query params
force a deterministic frame: `#a` / `#b` / `#c` isolates one study, `?s=<0..4>`
pins one rotation frame instead of catching it mid-cycle.
**Where this document and the prototype disagree, the prototype is right.**

## The layout contract

This is the central mechanism, and the source of the one defect that shipped to
review. A `writing-mode: vertical-rl` element's **horizontal** footprint is its
line box — `font-size × line-height` — not the visual width of its glyphs.
Nothing may be positioned against the word by eye. The band is computed, and
every other element starts after it:

```css
--word-left:    4.5cqw;
--word-size:    25cqh;
--word-lh:      .78;
--word-band:    calc(var(--word-size) * var(--word-lh));
--gutter:       4cqw;
--content-left: calc(var(--word-left) + var(--word-band) + var(--gutter));
```

`.bigword` is placed at `--word-left`; `.content` and `.microcol` at
`--content-left`. Changing `--word-size` re-flows the whole composition
correctly instead of silently overlapping.

The units are **container query units, not viewport units**, and `.hero` carries
`container-type: size`. See pitfall 2.

## Section structure

```
<section class="hero">                    ← cream, container-type: size
  <div class="photo rotator">             ← right pane; wash via ::before/::after
    <img class="on"/> × 5                 ← crossfade stack
  </div>
  <div class="seamfade"/>                 ← mobile only
  <div class="rail">Sapporo · Hokkaido · Japan</div>
  <div class="bigword" aria-hidden>HITOMI</div>
  <div class="content">                   ← eyebrow · h1 · CTAs, in normal flow
  <p class="microcol">…</p>
</section>
```

`.content` is a single flow container rather than four absolutely-placed items,
so the eyebrow, headline and CTAs cannot collide with each other either.

## Sizing

| | desktop (>900px) | small (≤900px) |
|---|---|---|
| hero height | `88vh`, min `580px`, max `860px` | `92vh`, no max |
| photo pane | `left: 46%`, full height | full width, `bottom: 38%` |
| `--word-size` | `25cqh` | `19cqh` |
| `--word-left` | `4.5cqw` | `3.5cqw` |
| `--gutter` | `4cqw` | `5cqw` |
| word anchor | `top: -5cqh` (crops terminal I) | `bottom: 4%` (uncropped) |
| headline | `clamp(2.4rem, 6.2vw, 5.6rem)` | `clamp(2rem, 9vw, 3rem)` |
| rail | shown | hidden |
| micro-column | shown | hidden |
| CTAs | row, `flex-wrap` | column |

The breakpoint is **900px, not 768px**. Between roughly 768 and 900 the desktop
split is too cramped: the word band plus the headline plus two CTA buttons do not
fit beside a 46% photo pane, and the CTAs wrap onto the photograph.

On small screens the seam turns horizontal — photo on top, cream panel below —
with the word running down the left edge across **both**, which preserves the
crossing device rather than abandoning it.

## The photo rotation

Five frames, 4s hold, 1.2s crossfade — a 20s full cycle.

| # | file (`/images/portfolio/…`) | `object-position` | role |
|---|---|---|---|
| 1 | `bridal-makeup-natural-updo-elegant-portrait-sapporo.jpg` | `55% 20%` | direct gaze; anchor frame and LCP image |
| 2 | `editorial-makeup-messy-bun-pearl-earrings-sapporo.jpg` | `72% 50%` | different model, cream backdrop |
| 3 | `bridal-makeup-close-up-coral-tones-hokkaido.jpg` | `50% 8%` | tightest crop; varies the rhythm |
| 4 | `bridal-makeup-portrait-half-up-hair-sapporo.jpg` | `50% 25%` | shows the hair work, not only makeup |
| 5 | `bridal-makeup-long-wavy-hair-floral-lace-gown-sapporo.jpg` | `50% 20%` | palest; a rest before the loop |

Selection was made from a screenshot contact sheet of all 33 single-subject
portrait-orientation portfolio images, not from filenames. Frames 1, 3, 4 and 5
plus `lace-gown-half-down-hair`, `soft-glam-off-shoulder`, `soft-light-reclining`
and `close-up-coral-peach-pearl-earring` share a pale studio backdrop and the
same styling and grade — close enough that rotating five of *them* read as
nearly static. Frame 2 exists to break that.

Only `opacity` is animated, so the crossfade stays on the compositor and never
triggers layout. The cycle pauses on `document.hidden`.

## Semantics, SEO and accessibility

- **`.bigword` is decorative** and must carry `aria-hidden="true"`. It is a
  `<div>`, never a heading.
- **The `<h1>` must remain real text.** The current site's h1 is *"Bridal Beauty
  by Hitomi"*. The prototype shows only *"Bridal Beauty"* — see Open questions.
- Frame 1 carries a descriptive `alt`. Frames 2–5 are decorative duplicates of
  portfolio content in this context; give them empty `alt=""` **or** descriptive
  alts, but be consistent — do not mix.
- The rail (`Sapporo · Hokkaido · Japan`) is real text, not an image.
- The micro-column must not drop below `10.5px`; it is already at the floor of
  what is acceptable, and it is hidden entirely on small screens.
- Colour contrast: ink `#2C2C2C` on cream `#FAF7F4` passes comfortably. The
  gold-bordered ghost button on cream is the weakest pairing on the page and
  should be checked, not assumed.

## Performance

- The photo pane is the LCP element. **Frame 1 only** gets `priority`; frames 2–5
  must not, or they compete for bandwidth during first paint.
- `sizes` should be `(max-width: 900px) 100vw, 54vw`.
- The wash is two CSS pseudo-elements — no image cost.
- Cormorant Garamond is already loaded via `next/font` in `layout.tsx`; the giant
  word adds no new font request.

## Reduced motion

Under `prefers-reduced-motion: reduce` the rotation never starts and frame 1
becomes a plain static hero. The composition itself is static, so there is no
separate fallback layout to maintain — unlike `WaveBendPromise` and
`FeaturedGallery`, which need one.

Guard with a plain `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
check. GSAP is not involved here, so [[reference-gsap-gotchas]]'s matchMedia trap
does not apply.

## Six pitfalls that fail silently

1. **A vertical word's horizontal footprint is its line box, not its glyphs.**
   Placing the headline against it by eye put the headline *inside* the
   letterforms at every viewport width. Compute the band.
2. **`vh` desyncs from the hero box the moment `max-height` clamps it.** At
   820×1180 the hero is capped at 860px while `25vh` still measures 295px, so the
   word overflowed its frame and rendered as "ITOM". Fixed with
   `container-type: size` on `.hero` and `cqh`/`cqw` throughout. Container query
   units inside a `:root` custom property resolve at the *use* site, so the
   declarations can stay in `:root` and still measure the hero.
3. **Rotated `vertical-rl` reads bottom-to-top, so the element's *bottom* edge is
   the first letter.** Anchoring the crop to `bottom` ate the H and the word read
   "ITOMI". Anchor to `top` so the crop lands on the terminal I.
4. **One `object-position` cannot serve a rotating set.** A single shared value
   cropped `close-up-coral-tones` straight through the subject's forehead. Each
   frame carries its own.
5. **On small screens the word crosses the photograph.** With tight face crops it
   lands on skin and the ink goes muddy — and which crop is showing changes every
   four seconds, so per-photo tuning cannot fix it. `.seamfade` fades the foot of
   the photo to cream and the word always crosses that instead.
6. **The wash layers create a paint-order trap.** `.warm .photo::before` carries
   `z-index: 2`; the word must outrank it (`z-index: 5`) or it gets tinted by the
   screen layer. Any new overlay must be slotted into this order deliberately.

## Copy — PLACEHOLDER, needs sign-off

Every string below is authored by Claude and is **not** approved. It must be
replaced or confirmed before implementation.

| slot | placeholder |
|---|---|
| eyebrow | `Bridal Makeup & Hair` |
| h1 | `Bridal` / `Beauty` (italic) |
| rail | `Sapporo · Hokkaido · Japan` |
| micro-column | `Bridal makeup and wedding hairstyling in Sapporo, Hokkaido. Twelve years refining a single craft — looks built for the length of a whole day, and for the photographs that outlive it.` |
| CTAs | `View My Work` → `/portfolio`, `Book a Session` → `/contact` |

The CTA labels and destinations match the current `HeroSection` and carry over
unchanged. "Twelve years" is consistent with `IntroSection`'s "12+ years", but is
still invented phrasing.

## Open questions

1. **Does the h1 keep "by Hitomi"?** Dropping it weakens the h1 for SEO. The
   giant word says HITOMI but is `aria-hidden` and invisible to crawlers as a
   heading. Options: restore the full phrase as a third line, put "by Hitomi" in
   the eyebrow, or accept the shorter h1 and rely on the `BeautyBusiness` schema
   in `page.tsx`, which already names her.
2. **Is 4s the right hold?** It is the owner's stated number and has not been
   watched for a full 20s cycle in situ.
3. **Alt-text policy for frames 2–5** — descriptive or empty. See above.

## Non-goals

- No scroll-driven motion in the hero. The rotation is the only movement.
- No pointer interaction, no manual slide controls, no dots or arrows.
- No GSAP. This is CSS transitions plus one timer.
- No new photography or image processing — the wash is a CSS overlay, the source
  files are untouched.
- `IntroSection`, `WaveBendPromise`, `ServicesPreview`, `FeaturedGallery`,
  `TestimonialsSection` and `InstagramCTA` are untouched.
- `PageHero` (used by `/about`, `/services`, etc.) is untouched. This is the
  homepage hero only.

## Verification

1. `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.
2. Screenshots at **1440, 1280, 1024, 820 and 390** wide. The 820 and 1024 cases
   are load-bearing — pitfall 2 was invisible at 1440 and at 390.
3. At every width: the word reads **HITOMI** in full (a cropped terminal I is
   intended; a cropped H is a bug), and no element overlaps the word.
4. Pin each rotation frame with `?s=0..4` and confirm no crop cuts through a
   subject's face.
5. With `prefers-reduced-motion: reduce` forced, frame 1 renders and no timer is
   created.
6. Lighthouse: LCP element is the hero photo and does not regress against the
   current hero.
7. Per `AGENTS.md`, read the relevant guide in `node_modules/next/dist/docs/`
   before writing the component — this Next.js version's conventions may differ
   from training data.
