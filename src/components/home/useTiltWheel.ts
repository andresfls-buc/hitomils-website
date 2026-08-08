'use client'

import { useLayoutEffect, useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  installStableViewport,
  onStableViewportChange,
  stableViewportHeight,
} from '@/lib/stableViewport'

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
  // How far the stage stays pinned, in multiples of the frozen viewport height.
  // These reproduce the old CSS runways exactly: the runway was 280vh/200vh and
  // the stage inside it 100vh, so the pin lasted the difference.
  travel: number
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
  travel: 1.8, // was h-[280vh] minus the 100vh stage
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
  travel: 1.0, // was max-md:h-[200vh] minus the 100vh stage
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
    installStableViewport()

    // A genuine relayout (rotation, a breakpoint change) does move the frozen
    // height, and the pin distance is derived from it, so ScrollTrigger has to
    // re-measure. Chrome sliding in and out never gets this far.
    const unsubscribe = onStableViewportChange(() => ScrollTrigger.refresh())

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

          // '+=' px rather than 'bottom bottom': the runway no longer has a
          // height of its own, so the pin spacer IS the scroll distance. Driving
          // it from the frozen viewport height keeps the document's total height
          // constant when an in-app browser's chrome slides away.
          const trigger = ScrollTrigger.create({
            trigger: runwayRef.current,
            start: 'top top',
            end: () => '+=' + Math.round(tune.travel * stableViewportHeight()),
            pin: stage,
            scrub: 0.6,
            invalidateOnRefresh: true,
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

    return () => {
      unsubscribe()
      ctx.revert()
    }
  }, [runwayRef, stageRef, containerRef, wheelRef])
}
