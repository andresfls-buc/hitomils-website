'use client'

import { useLayoutEffect, useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import {
  installStableViewport,
  onStableViewportChange,
  stableViewportHeight,
} from '@/lib/stableViewport'

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

// How long the stage stays pinned, in multiples of the frozen viewport height —
// this is the reading-speed knob. Reproduces the old CSS runways exactly: they
// were 800vh/380vh wrapped around a 100vh stage, so the pin lasted the
// difference. The train is ~9944 user units, ~6100px wide on a 1440px desktop
// and ~2560px on a 390px phone, which puts both of these near 1.1px of travel
// per 1px of scroll. Desktop needs the longer pin because the svg is 110vw
// there vs 170vw on mobile, so the same train covers far more screen-widths
// per screen of scroll.
const TRAVEL_DESKTOP = 7.0
const TRAVEL_MOBILE = 2.8
const DESKTOP_QUERY = '(min-width: 768px)' // Tailwind's `md`, which the markup used

interface Segment {
  el: SVGGraphicsElement
  textPath: SVGTextPathElement | null
  // Plain off-path <text> twin used purely for measurement; null for images.
  ruler: SVGTextContentElement | null
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
    installStableViewport()

    // Only a genuine relayout gets here — chrome sliding in and out never
    // changes the frozen height, so it never forces a re-measure.
    const unsubscribe = onStableViewportChange(() => ScrollTrigger.refresh())

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

        // WebKit returns 0 from getComputedTextLength() (and from getBBox()) for a
        // <text> whose content lives inside a <textPath> — confirmed against the
        // live site. Measuring the on-path text therefore gives every phrase a
        // width of 0 on iOS and they all stack. Measure these plain off-path
        // twins instead; they report correctly in every engine.
        const rulers = Array.from(
          (track.ownerSVGElement ?? track).querySelectorAll<SVGTextContentElement>('.wave-measure')
        )

        let textIndex = 0
        const segments: Segment[] = Array.from(track.children).map((node) => {
          const el = node as SVGGraphicsElement
          const isText = el.tagName === 'text'
          return {
            el,
            textPath: isText ? (el.firstElementChild as SVGTextPathElement) : null,
            ruler: isText ? (rulers[textIndex++] ?? null) : null,
            width: IMG_SIZE,
            at: 0,
          }
        })

        // Lay the segments end to end into a "train" and return its total length.
        //
        // This re-runs every frame rather than once at setup, and that is
        // deliberate: getComputedTextLength() reports fallback-font widths until
        // the webfont is actually applied, and document.fonts.ready is NOT a
        // reliable barrier for that — it resolves for the fonts loaded so far,
        // which on a slow phone can be before Cormorant reaches these nodes.
        // Measuring once loses that race silently and never self-corrects.
        // A few getComputedTextLength() calls per frame is a rounding error next
        // to the getPointAtLength() calls below.
        const measure = () => {
          let cursor = 0
          for (const seg of segments) {
            if (seg.ruler) {
              const w = seg.ruler.getComputedTextLength()
              // Keep the last good width if an engine ever reports 0 here, so a
              // bad measurement degrades to stale spacing rather than a pile-up.
              if (w > 0) seg.width = w
            } else {
              seg.width = IMG_SIZE
            }
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

        // '+=' px rather than 'bottom bottom': the runway has no height of its
        // own now, so the pin spacer IS the scroll distance. Deriving it from
        // the frozen viewport height keeps the document's total height steady
        // when an in-app browser's chrome slides away.
        const trigger = ScrollTrigger.create({
          trigger: runway,
          start: 'top top',
          end: () =>
            '+=' +
            Math.round(
              (window.matchMedia(DESKTOP_QUERY).matches
                ? TRAVEL_DESKTOP
                : TRAVEL_MOBILE) * stableViewportHeight()
            ),
          pin: stage,
          scrub: 0.5,
          invalidateOnRefresh: true,
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

    return () => {
      unsubscribe()
      ctx.revert()
    }
  }, [runwayRef, stageRef, lineRef, trackRef])
}
