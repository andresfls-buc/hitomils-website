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

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add({ reduceMotion: '(prefers-reduced-motion: reduce)' }, (context) => {
        // Reduced motion: the static fallback is already visible; skip GSAP entirely.
        if (context.conditions?.reduceMotion) return

        const line = lineRef.current
        const track = trackRef.current
        const stage = stageRef.current
        const runway = runwayRef.current
        if (!line || !track || !stage || !runway) return

        let cancelled = false
        let teardown: (() => void) | null = null

        // An arrow function, deliberately: TypeScript keeps the non-null
        // narrowing of `line`/`track`/`stage` above inside a closure created
        // after the guard, but not inside a hoisted `function setup()`, which
        // it must assume could run before the guard.
        const setup = () => {
          // ── measure the train ─────────────────────────────────────────────
          const segments: Segment[] = Array.from(track.children).map((node) => {
            const el = node as SVGGraphicsElement
            const isText = el.tagName === 'text'
            return {
              el,
              textPath: isText ? (el.firstElementChild as SVGTextPathElement) : null,
              width: isText ? (el as SVGTextContentElement).getComputedTextLength() : IMG_SIZE,
              at: 0,
            }
          })

          let cursor = 0
          for (const seg of segments) {
            seg.at = cursor
            cursor += seg.width + GAP
          }
          const trainLength = cursor - GAP

          const baseLength = line.getTotalLength()
          const travel = baseLength + trainLength

          // ── the bend is a paused morph we scrub by hand ────────────────────
          const morph = gsap.to(line, {
            morphSVG: { shape: '#wave' },
            duration: 1,
            paused: true,
            ease: 'none',
          })

          let progress = 0
          let bend = 0
          let targetBend = 0

          const trigger = ScrollTrigger.create({
            trigger: runway,
            start: 'top top',
            end: 'bottom bottom',
            pin: stage,
            scrub: 0.5,
            onUpdate: (self) => {
              progress = self.progress
              targetBend =
                Math.min(Math.abs(self.getVelocity()) / VELOCITY_FULL, 1) * MAX_BEND
            },
          })

          const render = () => {
            bend += (targetBend - bend) * BEND_EASE
            morph.progress(bend)

            // Re-read every frame: morphing changes the path's length.
            const length = line.getTotalLength()
            const head = baseLength - progress * travel

            for (const seg of segments) {
              const at = head + seg.at

              if (seg.textPath) {
                // Glyphs falling outside the path simply are not rendered, which
                // is what makes segments enter and leave the band.
                seg.textPath.setAttribute('startOffset', String(at))
                continue
              }

              const mid = Math.max(0, Math.min(length, at + seg.width / 2))
              const before = line.getPointAtLength(Math.max(0, mid - 1))
              const after = line.getPointAtLength(Math.min(length, mid + 1))
              const point = line.getPointAtLength(mid)
              const deg = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI

              seg.el.setAttribute(
                'transform',
                `translate(${point.x} ${point.y}) rotate(${deg}) translate(${-seg.width / 2} ${-IMG_SIZE / 2})`
              )
            }
          }

          gsap.ticker.add(render)
          render() // paint the first frame before the browser does

          return () => {
            gsap.ticker.remove(render)
            morph.kill()
            trigger.kill()
          }
        }

        // Text widths come from getComputedTextLength(), which is wrong until the
        // webfont has actually loaded. Measuring early lays the whole train out
        // with fallback-font widths and never corrects itself.
        document.fonts.ready.then(() => {
          if (cancelled) return
          teardown = setup()
        })

        // gsap.context reverts tweens and ScrollTriggers, but not the ticker
        // callback or the pending fonts promise — those must be handled here.
        return () => {
          cancelled = true
          teardown?.()
        }
      })
    }, runwayRef)

    return () => ctx.revert()
  }, [runwayRef, stageRef, lineRef, trackRef])
}
