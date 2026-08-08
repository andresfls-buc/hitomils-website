'use client'

import { useRef } from 'react'
import Image from 'next/image'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { portfolioImages } from '@/data/portfolio'
import type { GalleryImage } from '@/types'
import { useTiltWheel } from './useTiltWheel'

const DESKTOP_COUNT = 16
const MOBILE_COUNT = 10

function pickEven<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return arr.slice(0, n)
  const step = (arr.length - 1) / (n - 1)
  return Array.from({ length: n }, (_, i) => arr[Math.round(i * step)])
}

// Desktop and mobile each get their own curated spread across the whole
// portfolio, so neither ring clusters inside a single category.
const DESKTOP_TILES = pickEven(portfolioImages, DESKTOP_COUNT)
const MOBILE_TILES = pickEven(portfolioImages, MOBILE_COUNT)

// Reduced-motion fallback reuses the desktop selection as a plain grid.
const GRID_IMAGES = DESKTOP_TILES

function Tiles({ images, variant }: { images: GalleryImage[]; variant: 'desktop' | 'mobile' }) {
  // Both sets are rendered; the hook animates whichever one the breakpoint shows.
  // No `display: contents` wrapper — the tiles must be real children of the
  // preserve-3d wheel for the compositor to depth-sort them.
  const sizing =
    variant === 'mobile' ? 'w-[26vw] md:hidden' : 'w-[10vw] min-w-[120px] max-md:hidden'

  return (
    <>
      {images.map((image, i) => (
        <div
          key={`${variant}-${image.src}`}
          className={`wheel-tile-${variant} ${sizing} absolute top-0 left-0 aspect-[3/4] opacity-0 will-change-transform [transform-style:preserve-3d] shadow-[0_18px_50px_rgba(44,44,44,0.16)]`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 26vw, 10vw"
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
  const stageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  useTiltWheel(runwayRef, stageRef, containerRef, wheelRef)

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-12">
            <SectionTitle subtitle="Portfolio" title="Selected Work" />
          </div>
        </Reveal>
      </div>

      {/* ── Pinned 3D tilt wheel (motion-safe) ────────────────────────────── */}
      {/* No height here on purpose. The runway used to be h-[280vh]/h-[200vh],
          which made the document's total height a multiple of the viewport's —
          so an in-app browser resizing its web view moved everything below by
          hundreds of pixels and the wheel appeared to jump. The scroll distance
          now comes from ScrollTrigger's pin spacer in px (see useTiltWheel),
          the same way PortfolioMarquee does it. */}
      <div ref={runwayRef} className="pin-height relative motion-reduce:hidden">
        <div ref={stageRef} className="relative h-[var(--vh)] overflow-hidden">
          <div ref={containerRef} className="absolute inset-0 [perspective:1200px]">
            <div
              ref={wheelRef}
              className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d]"
            >
              <Tiles images={DESKTOP_TILES} variant="desktop" />
              <Tiles images={MOBILE_TILES} variant="mobile" />
            </div>
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

      {/* ── CTA, below the wheel ──────────────────────────────────────────── */}
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
