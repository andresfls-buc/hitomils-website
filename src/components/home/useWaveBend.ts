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
