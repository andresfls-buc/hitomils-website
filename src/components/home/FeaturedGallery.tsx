'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { portfolioImages } from '@/data/portfolio'

// ─── constants ────────────────────────────────────────────────────────────────
const INTERVAL = 5000

// Shuffle once at module load so order is random every page visit
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TOTAL = portfolioImages.length

// ─── Arrow button ─────────────────────────────────────────────────────────────
function Arrow({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
      className="
        absolute top-1/2 -translate-y-1/2 z-10
        w-10 h-10 rounded-full
        bg-white/90 backdrop-blur-sm shadow
        flex items-center justify-center
        text-[#2C2C2C] hover:text-[#A8796A]
        transition-colors duration-200
      "
      style={{ [dir === 'left' ? 'left' : 'right']: '12px' }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        {dir === 'left'
          ? <path d="M11 3.5L6 9L11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M7 3.5L12 9L7 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturedGallery() {
  const [index,          setIndex]          = useState(0)
  const [lightboxIdx,    setLightboxIdx]    = useState(-1)
  const [lightboxCurrent, setLightboxCurrent] = useState(0)
  const [paused,      setPaused]      = useState(false)
  const [spv,         setSpv]         = useState(3)   // slides per view

  // Shuffle on the client only — avoids server/client mismatch that
  // causes the lightbox to open the wrong photo
  const [shuffled, setShuffled] = useState(portfolioImages)
  const [slides,   setSlides]   = useState(() =>
    portfolioImages.map((img) => ({ src: img.src, alt: img.alt, width: img.width, height: img.height }))
  )
  useEffect(() => {
    const s = shuffle(portfolioImages)
    setShuffled(s)
    setSlides(s.map((img) => ({ src: img.src, alt: img.alt, width: img.width, height: img.height })))
  }, [])

  // maxIndex = last valid starting position so we never show blank slots
  const maxIndex = TOTAL - spv

  // ── Keep spv in sync with viewport (matches Tailwind sm / lg) ──────────────
  useEffect(() => {
    const update = () =>
      setSpv(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ── Clamp index when spv changes ───────────────────────────────────────────
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, maxIndex)))
  }, [maxIndex])

  // ── Navigation ──────────────────────────────────────────────────────────────
  const next = useCallback(
    () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
    [maxIndex],
  )
  const prev = useCallback(
    () => setIndex((i) => (i <= 0 ? maxIndex : i - 1)),
    [maxIndex],
  )

  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleArrow = useCallback(
    (dir: 'prev' | 'next') => {
      // pause immediately
      setPaused(true)
      dir === 'prev' ? prev() : next()

      // clear any existing resume timer, then restart after 5s
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
      resumeTimer.current = setTimeout(() => setPaused(false), 5000)
    },
    [prev, next],
  )

  // ── Auto-advance ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, INTERVAL)
    return () => clearInterval(id)
  }, [paused, next])

  /*
   * translateX formula:
   *   The track has no explicit width, so its CSS width = its containing block
   *   (the overflow-hidden wrapper) = W.
   *   Each item has width W/spv (via Tailwind responsive classes).
   *   translateX % is relative to the element itself (the track) whose width = W.
   *   To advance 1 slide → move W/spv → (100/spv)% of W.
   *   So: translateX = -(index × 100/spv)%
   */
  const translateX = -(index * (100 / spv))

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <SectionTitle subtitle="Portfolio" title="Selected Work" />
            <Button href="/portfolio" variant="ghost" size="sm">Full Portfolio</Button>
          </div>
        </Reveal>

        {/* ── Carousel ───────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Clipping window */}
          <div className="overflow-hidden">
            {/* Sliding track */}
            <div
              className="flex flex-nowrap transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {shuffled.map((img, i) => (  // shuffled is now client-only state
                <div
                  key={img.src}
                  // w-full on mobile (spv=1), w-1/2 on sm (spv=2), w-1/3 on lg (spv=3)
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-1.5 cursor-pointer group"
                  onClick={() => { setLightboxIdx(i); setPaused(true) }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EDD9D1]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      loading={i < 6 ? 'eager' : 'lazy'}
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <Arrow dir="left"  onClick={() => handleArrow('prev')} />
          <Arrow dir="right" onClick={() => handleArrow('next')} />
        </div>

        {/* ── Counter ─────────────────────────────────────────────────────────── */}
        <p className="mt-5 text-right font-sans text-[11px] tracking-widest text-[#B8A080]">
          {String(index + 1).padStart(2, '0')} / {String(maxIndex + 1).padStart(2, '0')}
        </p>

      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      <Lightbox
        open={lightboxIdx >= 0}
        index={lightboxIdx}
        on={{
          view: ({ index: i }) => setLightboxCurrent(i),
        }}
        close={() => {
          setLightboxIdx(-1)
          setPaused(false)
          // Sync carousel to the photo the user last viewed in the lightbox
          setIndex(Math.min(lightboxCurrent, maxIndex))
        }}
        slides={slides}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
      />
    </section>
  )
}
