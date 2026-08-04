'use client'

import {
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { portfolioImages } from '@/data/portfolio'
import type { GalleryImage } from '@/types'

// useLayoutEffect warns during SSR (no DOM to lay out); fall back to useEffect there.
// The effect body never actually runs on the server either way — this only silences the warning.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

const GAP = 12 // px — matches the gap-3 Tailwind utility used below
const MOBILE_GAP = 8 // px — matches gap-2 on the mobile columns
const ROW_COUNT = 3
const COL_COUNT = 2
const DESKTOP_QUERY = '(min-width: 768px)'

// Mobile is the same mechanic as desktop turned 90°: the band is pinned and the
// columns travel their own vertical overflow, so the section holds until every
// photo has passed through.
//
// An earlier version instead drifted both columns by a fixed ±120px across the
// whole section without pinning. That was a mistake: 240px of travel spread
// over a 9480px page works out to ~21px of relative shift per screen — real in
// the transform values, invisible to the eye.

// 5 of the 77 entries in portfolio.ts point at the same file as another entry —
// they existed so a photo could appear under two category filters. With the
// filters gone the same face would simply show up twice, so we keep the first
// occurrence of each file. This also has to happen before distribution: `src` is
// used as the React key and as the lightbox index key, and duplicates silently
// dropped rendered images and mapped 5 of them to the wrong slide.
const UNIQUE_IMAGES = portfolioImages.filter(
  (img, i, all) => all.findIndex((other) => other.src === img.src) === i
)

// ─── desktop row distribution — the parallax driver ────────────────────────
// Splitting the images evenly across 3 rows makes all three row widths ~equal
// and the effect collapses into one flat marquee. Rows must be deliberately
// uneven: deal each image to whichever row is furthest below its width budget
// (0.42 / 0.34 / 0.24 of total width). In a row every image shares a height, so
// aspect ratio alone orders the widths. Landscape images are dealt first so the
// wide ones concentrate in the widest row.
const ROW_RATIO = [0.42, 0.34, 0.24] as const

function distributeRows(images: GalleryImage[]): GalleryImage[][] {
  const wide = images.filter((img) => img.width > img.height)
  const tall = images.filter((img) => img.width <= img.height)
  const unit = (img: GalleryImage) => img.width / img.height
  const total = images.reduce((sum, img) => sum + unit(img), 0)
  const budget = ROW_RATIO.map((r) => r * total)
  const used = [0, 0, 0]
  const rows: GalleryImage[][] = [[], [], []]

  for (const img of [...wide, ...tall]) {
    let best = 0
    let bestGap = -Infinity
    for (let r = 0; r < ROW_COUNT; r++) {
      const gap = budget[r] - used[r]
      if (gap > bestGap) {
        bestGap = gap
        best = r
      }
    }
    rows[best].push(img)
    used[best] += unit(img)
  }
  return rows
}

// ─── mobile column distribution ────────────────────────────────────────────
// Same idea as the rows, on the other axis: columns share a width, so an
// image's height is proportional to height/width. The two columns must come out
// UNEVEN — equal heights would mean equal overflow, both columns travelling the
// same distance, and no parallax at all. 0.58 / 0.42 gives the taller column
// roughly 1.4x the travel of the shorter one.
const COL_RATIO = [0.58, 0.42] as const

function distributeCols(images: GalleryImage[]): GalleryImage[][] {
  const unit = (img: GalleryImage) => img.height / img.width
  const total = images.reduce((sum, img) => sum + unit(img), 0)
  const budget = COL_RATIO.map((r) => r * total)
  const used = [0, 0]
  const cols: GalleryImage[][] = [[], []]

  for (const img of images) {
    let best = 0
    let bestGap = -Infinity
    for (let c = 0; c < COL_COUNT; c++) {
      const gap = budget[c] - used[c]
      if (gap > bestGap) {
        bestGap = gap
        best = c
      }
    }
    cols[best].push(img)
    used[best] += unit(img)
  }
  return cols
}

// Computed once at module scope — pure functions of static data, so the
// server-rendered HTML and the client's first render agree.
const ROWS = distributeRows(UNIQUE_IMAGES)
const COLS = distributeCols(UNIQUE_IMAGES)

const EAGER_PER_GROUP = 4

/**
 * Rows and columns group the photos differently, so the layout can't be a
 * pure CSS swap — the markup itself changes at the breakpoint. Server snapshot
 * is `false`, i.e. the mobile column layout is what gets server-rendered; all
 * 72 images and their alt text are present either way, and desktop swaps to
 * rows on mount, below the fold.
 */
function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(DESKTOP_QUERY)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  )
}

export default function PortfolioMarquee() {
  const isDesktop = useIsDesktop()
  const sectionRef = useRef<HTMLElement>(null)
  const pinHeightRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const groupRefs = useRef<(HTMLDivElement | null)[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const groups = isDesktop ? ROWS : COLS

  // Visual reading order changes with the layout, so the lightbox has to index
  // into whichever arrangement is currently on screen.
  const { indexBySrc, slides } = useMemo(() => {
    const flat = groups.flat()
    return {
      indexBySrc: new Map(flat.map((img, i) => [img.src, i])),
      slides: flat.map((img) => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
      })),
    }
  }, [groups])

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Reduced motion gets the plain static layout in both arrangements.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const elements = groupRefs.current.filter(
          (el): el is HTMLDivElement => el !== null
        )

        const pinHeight = pinHeightRef.current
        const container = containerRef.current
        const expected = isDesktop ? ROW_COUNT : COL_COUNT
        if (!pinHeight || !container || elements.length !== expected) return

        // Group extents come from portfolio.ts's width/height fields, never from
        // waiting on image loads — public/images/portfolio/ is 99MB. Only the
        // group's own cross-axis size is read from the DOM, and that is pure CSS.
        let overflows: number[] = []
        const measure = () => {
          if (isDesktop) {
            const viewportWidth = document.documentElement.clientWidth
            overflows = ROWS.map((row, i) => {
              const rowHeight = elements[i].getBoundingClientRect().height
              const width =
                row.reduce(
                  (w, img) => w + (img.width / img.height) * rowHeight,
                  0
                ) + GAP * Math.max(0, row.length - 1)
              return Math.max(0, width - viewportWidth)
            })
          } else {
            const windowHeight = container.getBoundingClientRect().height
            overflows = COLS.map((col, i) => {
              const colWidth = elements[i].getBoundingClientRect().width
              const height =
                col.reduce(
                  (h, img) => h + (img.height / img.width) * colWidth,
                  0
                ) + MOBILE_GAP * Math.max(0, col.length - 1)
              return Math.max(0, height - windowHeight)
            })
          }
        }
        measure()

        // Everything below is function-based and re-evaluated on refresh, and
        // ScrollTrigger refreshes on window resize. Baking these in at mount
        // was the resize bug: after a 1440 -> 1024 resize the rows kept the
        // old travel distance and scrolled ~1400px past their own end,
        // dragging the last image right off the left edge of the screen.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: () => '+=' + Math.max(...overflows, 1),
            pin: container,
            scrub: true,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
        })

        // Each group travels exactly its own overflow → different distances over
        // identical scroll = different speeds = the parallax. The pin holds
        // until the longest group has run out, so every photo passes through.
        elements.forEach((group, i) => {
          tl.to(
            group,
            isDesktop
              ? { x: () => -overflows[i], ease: 'none', duration: 1 }
              : { y: () => -overflows[i], ease: 'none', duration: 1 },
            0
          )
        })
      })
      // matchMedia + context automatically revert all tweens/ScrollTriggers created
      // above whenever the query changes or this component unmounts.
    }, sectionRef)

    return () => ctx.revert()
  }, [isDesktop])

  const renderImage = (image: GalleryImage, indexInGroup: number) => {
    const eager = indexInGroup < EAGER_PER_GROUP
    return (
      <button
        key={image.src}
        type="button"
        onClick={() => setLightboxIndex(indexBySrc.get(image.src) ?? 0)}
        aria-label={`View full-size: ${image.alt}`}
        className={
          isDesktop
            ? 'block h-full w-auto flex-none'
            : 'block w-full cursor-pointer'
        }
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          // sizes describes rendered WIDTH. On mobile each column is half the
          // screen; on desktop widths are height-driven, ~190px portrait to
          // ~380px landscape.
          sizes="(max-width: 767px) 50vw, 30vw"
          className="rounded-[2px] bg-[#EDE7E1] object-cover"
          // Explicit aspect-ratio, not just the width/height attributes:
          // Chromium's implicit attribute-derived ratio is unreliable across a
          // long run of width:auto flex siblings (confirmed via CDP — some
          // images silently rendered at the wrong width without this), which
          // desynchronised each row's real scrollWidth from the computed
          // overflow the tween targets.
          style={
            isDesktop
              ? {
                  height: '100%',
                  width: 'auto',
                  aspectRatio: `${image.width} / ${image.height}`,
                }
              : {
                  width: '100%',
                  height: 'auto',
                  aspectRatio: `${image.width} / ${image.height}`,
                }
          }
        />
      </button>
    )
  }

  return (
    <>
      {/*
        These three wrappers stay mounted at every breakpoint and only their
        classes and children change. ScrollTrigger's `pin` wraps the container
        in a .pin-spacer div that React knows nothing about, so letting React
        unmount this subtree on a breakpoint change crashed the page outright
        (React removing a node GSAP had already re-parented). Swapping only the
        children keeps the pinned node stable and the revert safe.
      */}
      <section ref={sectionRef}>
        <div ref={pinHeightRef} className="pin-height relative">
          <div
            ref={containerRef}
            className={
              isDesktop
                ? 'flex h-screen flex-col justify-center gap-3 overflow-hidden'
                : // items-start keeps each column at its natural content height —
                  // the default `stretch` would clamp it to the window and there
                  // would be nothing left to travel.
                  'flex h-screen items-start gap-2 overflow-hidden px-4'
            }
          >
            {groups.map((group, i) => (
              <div
                key={i}
                ref={(el) => {
                  groupRefs.current[i] = el
                }}
                className={
                  isDesktop
                    ? 'flex h-[calc((100vh-4*12px)/3)] flex-none gap-3 will-change-transform'
                    : // no will-change here: these columns run to ~9000px and
                      // promoting that to its own layer is a lot of memory on a phone.
                      'flex flex-1 flex-col gap-2'
                }
              >
                {group.map(renderImage)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
      />
    </>
  )
}
