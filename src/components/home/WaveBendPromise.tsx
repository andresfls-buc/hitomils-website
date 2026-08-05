'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useWaveBend } from './useWaveBend'

// Verbatim from the reference effect — do not regenerate or reformat.
const LINE_D = 'M0 195H644H1288H1932H2576'
const WAVE_D =
  'M0.21875 190.5C0.21875 190.5 382.004 0.5 644.219 0.5C906.434 0.5 1051.3 78.1239 1288.22 190.5C1531.72 306 1668.87 390.5 1932.22 390.5C2195.57 390.5 2576.22 190.5 2576.22 190.5'

const PHOTOS = [
  {
    src: '/images/portfolio/bridal-makeup-natural-ethereal-close-up-sapporo.jpg',
    alt: 'Ethereal natural bridal makeup close-up, Sapporo',
  },
  {
    src: '/images/portfolio/bridal-hair-half-up-hotel-smiling-hokkaido.jpg',
    alt: 'Bridal half-up hairstyle with pink peony bouquet, hotel room, Hokkaido',
  },
]

const SENTENCE = 'It’s your day — I’ll take care of everything — you just enjoy it.'

// The <text> elements are measured by the hook, so their styling must be on the
// element itself rather than inherited through a class that might not apply
// inside the SVG.
const textStyle = { fontFamily: 'var(--font-cormorant)' } as const

export default function WaveBendPromise() {
  const runwayRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const trackRef = useRef<SVGGElement>(null)

  useWaveBend(runwayRef, stageRef, lineRef, trackRef)

  return (
    <section>
      {/* The animated SVG is decorative; this carries the promise for screen readers. */}
      <p className="sr-only">{SENTENCE}</p>

      {/* ── Pinned travelling line (motion-safe) ──────────────────────────── */}
      <div ref={runwayRef} className="pin-height relative h-[200vh] motion-reduce:hidden">
        <div
          ref={stageRef}
          className="relative flex h-screen items-center overflow-hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 2577 391"
            xmlns="http://www.w3.org/2000/svg"
            /* shrink-0 is load-bearing: as a flex item the svg would otherwise
               shrink to the stage width and silently ignore w-[110vw]. */
            className="block w-[170vw] shrink-0 overflow-visible md:w-[110vw]"
          >
            <defs>
              <clipPath id="round-clip" clipPathUnits="objectBoundingBox">
                <rect width="1" height="1" rx=".08" ry=".08" />
              </clipPath>
            </defs>

            <path ref={lineRef} id="line" d={LINE_D} fill="none" />
            <path id="wave" d={WAVE_D} fill="none" opacity="0" />

            <g ref={trackRef} id="track">
              <text fill="#2C2C2C" fontSize="300" fontWeight="300" style={textStyle}>
                <textPath href="#line" startOffset="0" textAnchor="start">
                  It’s your day
                </textPath>
              </text>
              <image
                href={PHOTOS[0].src}
                width={280}
                height={280}
                clipPath="url(#round-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <text fill="#2C2C2C" fontSize="300" fontWeight="300" style={textStyle}>
                <textPath href="#line" startOffset="0" textAnchor="start">
                  I’ll take care of everything
                </textPath>
              </text>
              <image
                href={PHOTOS[1].src}
                width={280}
                height={280}
                clipPath="url(#round-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <text fill="#2C2C2C" fontSize="300" fontWeight="300" style={textStyle}>
                <textPath href="#line" startOffset="0" textAnchor="start">
                  you just enjoy it
                </textPath>
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* ── Static fallback (motion-reduce) ───────────────────────────────── */}
      <div className="hidden motion-reduce:block px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-serif text-3xl font-light leading-snug text-[#2C2C2C] md:text-5xl">
            {SENTENCE}
          </p>
          <div className="mt-12 flex justify-center gap-4">
            {PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="relative h-40 w-40 overflow-hidden rounded-2xl md:h-56 md:w-56"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
