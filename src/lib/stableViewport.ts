'use client'

// ─── why this exists ────────────────────────────────────────────────────────
// In-app browsers (Instagram's above all) resize the web view itself when their
// chrome slides in and out, rather than overlaying it. Every `vh` on the page
// re-resolves the instant that happens.
//
// On the homepage that was catastrophic rather than merely untidy: the hero,
// two pinned stages and two scroll runways were ALL sized in `vh`, so a 110px
// change in chrome height moved the document height by 748px — an amplification
// of 6.8x. The scroll offset stays where it is, so everything below the first
// runway lurches by hundreds of pixels, and because the chrome re-appears the
// moment the content jumps back under the user's thumb, it oscillates. That is
// the carousel "jumping up and down".
//
// The fix is to stop reading the live viewport. `--vh` is frozen at its first
// measured value and only re-measured on a change that is a genuine relayout —
// a width change or a height change too large to be browser chrome. That is the
// same 25% threshold GSAP applies in ScrollTrigger's own `ignoreMobileResize`,
// deliberately: the two must agree, or one would refresh while the other held.

const CHROME_RATIO = 0.25

let cached = 0
let baseWidth = 0
let baseHeight = 0
let installed = false

const listeners = new Set<() => void>()

// Measure what CSS means by 100vh, NOT window.innerHeight. On mobile the two
// disagree: `vh` resolves against the large viewport (chrome hidden) while
// innerHeight reports the current one. Reading the same number CSS would have
// used is what makes freezing it a no-op visually — the value written on
// hydration is identical to the one the stylesheet already produced.
function measure(): number {
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:absolute;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none'
  document.body.appendChild(probe)
  const height = probe.offsetHeight || window.innerHeight
  document.body.removeChild(probe)
  return height
}

function publish() {
  document.documentElement.style.setProperty('--vh', `${cached}px`)
}

/** The frozen viewport height in px. 0 before install (SSR). */
export function stableViewportHeight(): number {
  if (!cached && typeof window !== 'undefined') cached = measure()
  return cached
}

/** Runs `fn` when the frozen height actually changes. Returns an unsubscribe. */
export function onStableViewportChange(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/**
 * Idempotent — the hooks that depend on `--vh` each call this so none of them
 * has to assume it was mounted, and React's double-invoked effects are safe.
 */
export function installStableViewport(): void {
  if (installed || typeof window === 'undefined') return
  installed = true

  cached = measure()
  baseWidth = window.innerWidth
  baseHeight = window.innerHeight
  publish()

  const onResize = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    // Chrome sliding away changes only the height, and never by much. Anything
    // else — rotation, a desktop window drag, a genuine breakpoint change — is
    // a relayout we DO want to follow.
    const isChrome =
      width === baseWidth && Math.abs(height - baseHeight) <= height * CHROME_RATIO
    if (isChrome) return

    baseWidth = width
    baseHeight = height

    const next = measure()
    if (next === cached) return
    cached = next
    publish()
    listeners.forEach((fn) => fn())
  }

  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('orientationchange', onResize, { passive: true })
}
