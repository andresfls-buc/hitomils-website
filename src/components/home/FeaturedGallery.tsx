'use client'

import { useLayoutEffect, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { portfolioImages } from '@/data/portfolio'
import type { GalleryImage } from '@/types'

// useLayoutEffect warns during SSR (no DOM to lay out); fall back to useEffect there.
// The effect body never actually runs on the server either way — this only silences the warning.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// ─── seeded PRNG ────────────────────────────────────────────────────────────
// Per-photo size/position must be computed at module scope with a fixed seed
// so the server-rendered HTML and the client's first render produce identical
// values — bare Math.random() here would cause a hydration mismatch.
function createRng(seed: number) {
  let s = seed
  return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648
}

// ─── tuning constants ───────────────────────────────────────────────────────
// Verified against the reference prototype (madewithgsap Effect 072) — keep as-is.
const X_IN = 42 // vw — entry point (right)
const X_OUT = -42 // vw — exit point (left)
const Y_SPREAD = 13 // vh — max vertical offset from centre
const DRIFT = 7 // vh — vertical drift across the journey
const TRAVEL = 1 // duration of one photo's journey
const IN_FLIGHT = 5.5 // photos on screen at once
const STAGGER = TRAVEL / IN_FLIGHT

interface PhotoConfig {
  image: GalleryImage
  width: number // vh
  height: number // vh
  y0: number // vh
  y1: number // vh
  peak: number
}

function pickEven<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return arr.slice(0, n)
  const step = (arr.length - 1) / (n - 1)
  return Array.from({ length: n }, (_, i) => arr[Math.round(i * step)])
}

function buildPhotos(
  images: GalleryImage[],
  seed: number,
  hMin: number,
  hMax: number
): PhotoConfig[] {
  const rnd = createRng(seed)
  const between = (a: number, b: number) => a + rnd() * (b - a)

  return images.map((image) => {
    const portrait = rnd() > 0.35
    const h = between(hMin, hMax) // vh
    const width = h * (portrait ? 0.75 : 1.4) // size by height so nothing overflows the band
    const y0 = between(-Y_SPREAD, Y_SPREAD)
    const y1 = y0 + between(-DRIFT, DRIFT)
    const peak = between(0.85, 1.15)
    return { image, width, height: h, y0, y1, peak }
  })
}

const DESKTOP_COUNT = 16
const MOBILE_COUNT = 8

// Desktop and mobile each get their own curated spread of photos and their own
// size range (mobile is widened slightly so photos still read at small widths).
const DESKTOP_PHOTOS = buildPhotos(pickEven(portfolioImages, DESKTOP_COUNT), 7, 24, 42)
const MOBILE_PHOTOS = buildPhotos(pickEven(portfolioImages, MOBILE_COUNT), 7, 30, 50)

// Reduced-motion fallback reuses the desktop selection as a plain grid.
const GRID_IMAGES = DESKTOP_PHOTOS.map((p) => p.image)

function PhotoStream({ photos, variant }: { photos: PhotoConfig[]; variant: 'desktop' | 'mobile' }) {
  return (
    <>
      {photos.map((photo, i) => (
        <div
          key={`${variant}-${photo.image.src}`}
          className={`media-${variant} absolute top-1/2 left-1/2 opacity-0 will-change-transform shadow-[0_18px_50px_rgba(44,44,44,0.16)]`}
          style={{ width: `${photo.width}vh`, height: `${photo.height}vh` }}
        >
          <Image
            src={photo.image.src}
            alt={photo.image.alt}
            fill
            sizes="(max-width: 768px) 60vw, 32vw"
            className="object-cover"
            loading={i < 3 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </>
  )
}

export default function FeaturedGallery() {
  const runwayRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isMobile: '(max-width: 767.98px)',
          isDesktop: '(min-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const conditions = context.conditions ?? {}
          const isMobile = Boolean(conditions.isMobile)
          const reduceMotion = Boolean(conditions.reduceMotion)

          // Reduced motion: the CSS-only static grid is already visible; skip GSAP entirely.
          if (reduceMotion) return

          const row = rowRef.current
          if (!row) return

          const photos = isMobile ? MOBILE_PHOTOS : DESKTOP_PHOTOS
          const els = Array.from(
            row.querySelectorAll<HTMLDivElement>(isMobile ? '.media-mobile' : '.media-desktop')
          )

          // The timeline is scrubbed in full, from t=0 to its natural end, so
          // the stream builds up from an empty screen and empties out again.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: runwayRef.current,
              start: 'top top',
              end: 'bottom bottom',
              pin: row,
              scrub: 0.6,
            },
          })

          photos.forEach((photo, i) => {
            const el = els[i]
            if (!el) return

            gsap.set(el, {
              xPercent: -50,
              yPercent: -50,
              scale: 0,
              opacity: 1,
              x: `${X_IN}vw`,
              y: `${photo.y0}vh`,
            })

            const at = i * STAGGER

            // horizontal travel — linear
            tl.to(el, { x: `${X_OUT}vw`, y: `${photo.y1}vh`, duration: TRAVEL, ease: 'none' }, at)

            // scale — bell curve: 0 → peak → 0
            tl.to(
              el,
              {
                keyframes: [
                  { scale: photo.peak, duration: TRAVEL * 0.5, ease: 'power2.out' },
                  { scale: 0, duration: TRAVEL * 0.5, ease: 'power2.in' },
                ],
                onUpdate() {
                  el.style.zIndex = String(Math.round(Number(gsap.getProperty(el, 'scale')) * 1000))
                },
              },
              at
            )
          })
        }
      )
      // matchMedia + context automatically revert all tweens/ScrollTriggers created above
      // whenever the breakpoint changes or this component unmounts.
    }, runwayRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-12">
            <SectionTitle subtitle="Portfolio" title="Selected Work" />
          </div>
        </Reveal>
      </div>

      {/* ── Pinned photo stream (motion-safe) ─────────────────────────────── */}
      <div
        ref={runwayRef}
        className="pin-height relative h-[300vh] max-md:h-[200vh] motion-reduce:hidden"
      >
        <div ref={rowRef} className="relative h-screen overflow-hidden">
          <div className="contents max-md:hidden">
            <PhotoStream photos={DESKTOP_PHOTOS} variant="desktop" />
          </div>
          <div className="contents md:hidden">
            <PhotoStream photos={MOBILE_PHOTOS} variant="mobile" />
          </div>
        </div>
      </div>

      {/* ── Static grid fallback (motion-reduce) ──────────────────────────── */}
      <div className="hidden motion-reduce:block max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GRID_IMAGES.map((img) => (
            <div key={img.src} className="relative aspect-[3/4] overflow-hidden bg-[#EDD9D1]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 23vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA, below the stream ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mt-16 flex justify-center">
        <Reveal>
          <Button href="/portfolio" variant="ghost" size="sm">
            Full Portfolio
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
