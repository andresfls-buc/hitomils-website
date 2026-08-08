'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useWaveBend } from './useWaveBend'

// Verbatim from the reference effect — do not regenerate or reformat.
const LINE_D = 'M0 195H644H1288H1932H2576'
const WAVE_D =
  'M0.21875 190.5C0.21875 190.5 382.004 0.5 644.219 0.5C906.434 0.5 1051.3 78.1239 1288.22 190.5C1531.72 306 1668.87 390.5 1932.22 390.5C2195.57 390.5 2576.22 190.5 2576.22 190.5'

type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'image'; src: string; alt: string }

// Single source of truth for the track. The measuring twins below are built from
// the same array, so a copy edit can never leave them out of sync — and out of
// sync means silently wrong spacing.
const SEGMENTS: Segment[] = [
  { kind: 'text', value: 'It’s your day' },
  {
    kind: 'image',
    src: '/images/portfolio/bridal-makeup-natural-ethereal-close-up-sapporo.jpg',
    alt: 'Ethereal natural bridal makeup close-up, Sapporo',
  },
  { kind: 'text', value: 'I’ll take care of everything' },
  {
    kind: 'image',
    src: '/images/portfolio/bridal-hair-half-up-hotel-smiling-hokkaido.jpg',
    alt: 'Bridal half-up hairstyle with pink peony bouquet, hotel room, Hokkaido',
  },
  { kind: 'text', value: 'you just enjoy it' },
]

const PHOTOS = SEGMENTS.filter((s): s is Extract<Segment, { kind: 'image' }> => s.kind === 'image')
const PHRASES = SEGMENTS.filter((s): s is Extract<Segment, { kind: 'text' }> => s.kind === 'text')

const SENTENCE = 'It’s your day — I’ll take care of everything — you just enjoy it.'

// Font must be declared on the element itself; a class may not reach inside the SVG.
const textStyle = { fontFamily: 'var(--font-cormorant)' } as const
const TEXT_ATTRS = { fontSize: 300, fontWeight: 300, style: textStyle } as const

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
      {/* Pin distance IS the reading speed: the train covers its whole length
          over however long the stage stays pinned. Longer pin = slower writing.
          That knob now lives in useWaveBend's TRAVEL, in multiples of the frozen
          viewport height — it used to be this div's h-[800vh]/h-[380vh], but a
          runway measured in vh made the document's height a multiple of the
          viewport's, and in-app browsers that resize their web view then shifted
          every section below by hundreds of pixels. */}
      <div ref={runwayRef} className="pin-height relative motion-reduce:hidden">
        <div
          ref={stageRef}
          className="relative flex h-[var(--vh)] items-center overflow-hidden"
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

            {/* ── Measuring twins ────────────────────────────────────────────
                WebKit returns 0 from getComputedTextLength() AND getBBox() for a
                <text> whose content sits inside a <textPath> — verified against
                the live site. Measuring the on-path text there yields width 0 for
                every phrase, so they all stack on top of each other on iOS.
                These plain <text> copies carry no textPath and measure correctly
                in every engine. Parked far off-canvas and fully transparent, so
                they can never be seen but are still laid out and measurable. */}
            <g id="wave-measure" opacity="0" aria-hidden="true" pointerEvents="none">
              {PHRASES.map((phrase) => (
                <text key={phrase.value} className="wave-measure" x={0} y={-10000} {...TEXT_ATTRS}>
                  {phrase.value}
                </text>
              ))}
            </g>

            <g ref={trackRef} id="track">
              {SEGMENTS.map((seg) =>
                seg.kind === 'text' ? (
                  <text key={seg.value} fill="#2C2C2C" {...TEXT_ATTRS}>
                    <textPath href="#line" startOffset="0" textAnchor="start">
                      {seg.value}
                    </textPath>
                  </text>
                ) : (
                  <image
                    key={seg.src}
                    href={seg.src}
                    width={280}
                    height={280}
                    clipPath="url(#round-clip)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                )
              )}
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
