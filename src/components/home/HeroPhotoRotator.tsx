'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

/** 4s hold; the crossfade itself is 1200ms, set in globals.css. */
const HOLD_MS = 4000

const FRAMES = [
  {
    src: '/images/portfolio/bridal-makeup-natural-updo-elegant-portrait-sapporo.jpg',
    objectPosition: '55% 20%',
    alt: 'Bride with a natural updo and soft bridal makeup, Sapporo',
  },
  {
    src: '/images/portfolio/editorial-makeup-messy-bun-pearl-earrings-sapporo.jpg',
    objectPosition: '72% 50%',
    alt: '',
  },
  {
    src: '/images/portfolio/bridal-makeup-close-up-coral-tones-hokkaido.jpg',
    objectPosition: '50% 8%',
    alt: '',
  },
  {
    src: '/images/portfolio/bridal-makeup-portrait-half-up-hair-sapporo.jpg',
    objectPosition: '50% 25%',
    alt: '',
  },
  {
    src: '/images/portfolio/bridal-makeup-long-wavy-hair-floral-lace-gown-sapporo.jpg',
    objectPosition: '50% 20%',
    alt: '',
  },
] as const

export default function HeroPhotoRotator() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    // Static hero under reduced motion: frame 0 stays, no timer is created.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timer: number | undefined

    const start = () => {
      if (timer === undefined) {
        timer = window.setInterval(
          () => setActive((prev) => (prev + 1) % FRAMES.length),
          HOLD_MS
        )
      }
    }
    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer)
        timer = undefined
      }
    }
    // A backgrounded tab should not burn a crossfade every four seconds.
    const onVisibility = () => (document.hidden ? stop() : start())

    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="mhero-photo">
      {FRAMES.map((frame, i) => (
        <Image
          key={frame.src}
          src={frame.src}
          alt={frame.alt}
          fill
          /* Frame 0 is the LCP element. The rest must NOT be priority or
             they compete for bandwidth during first paint.
             Next.js 16 deprecated `priority`'s implicit fetchPriority=high
             (see node_modules/next/dist/docs .../components/image.md); it now
             only toggles eager loading + a preload link, so the hint must be
             set explicitly or the DOM never gets fetchpriority="high". */
          priority={i === 0}
          fetchPriority={i === 0 ? 'high' : undefined}
          sizes="(max-width: 900px) 100vw, 54vw"
          className="mhero-frame object-cover"
          data-on={i === active}
          style={{ objectPosition: frame.objectPosition }}
        />
      ))}
    </div>
  )
}
