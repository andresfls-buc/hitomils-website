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
