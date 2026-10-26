'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { LandingGalleryImage } from '@/data/landingGallery'
import type { LandingLocale } from '@/lib/landing'
import { createLiquidGlassRenderer } from './liquidGlassRenderer'
import styles from './LiquidGlassCarousel.module.css'

const labels = {
  en: { gallery: 'Hitomi bridal portfolio carousel', previous: 'Previous photo', next: 'Next photo', drag: 'Drag to explore', carousel: 'carousel', credit: 'Hair & makeup by Hitomi' },
  'zh-hk': { gallery: 'Hitomi 新娘化妝及髮型作品輪播', previous: '上一張照片', next: '下一張照片', drag: '拖動欣賞作品', carousel: '輪播圖', credit: '化妝及髮型：Hitomi' },
  'zh-tw': { gallery: 'Hitomi 新娘妝髮作品輪播', previous: '上一張照片', next: '下一張照片', drag: '拖曳欣賞作品', carousel: '輪播圖', credit: '妝髮造型：Hitomi' },
}

export default function LiquidGlassCarousel({ images, locale }: { images: LandingGalleryImage[]; locale: LandingLocale }) {
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const redrawRef = useRef<() => void>(() => {})
  const stepRef = useRef(1)
  const reducedMotionRef = useRef(false)
  const scrollAnimationRef = useRef(0)
  const dragRef = useRef<{ x: number; scroll: number; pointer: number } | null>(null)
  const copy = labels[locale]
  const count = images.length

  useEffect(() => {
    const track = trackRef.current, canvas = canvasRef.current
    const card = track?.querySelector<HTMLElement>(`.${styles.card}`)
    if (!track || !canvas || !card || count < 2) return
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = motionQuery.matches
    let renderer = motionQuery.matches ? null : createLiquidGlassRenderer(canvas)
    let width = 0, height = 0, cardWidth = 0, cardHeight = 0, step = 1, inset = 0
    let frame = 0, settleTimer: ReturnType<typeof setTimeout> | undefined
    let previousScroll = 0, disposed = false
    const draw = () => {
      frame = 0
      if (disposed) return
      const delta = Math.abs(track.scrollLeft - previousScroll)
      const motion = delta > count * step / 2 ? 0 : Math.min(delta / 45, 1)
      previousScroll = track.scrollLeft
      let ready = false
      try {
        ready = renderer?.draw({ width, height, cardWidth, cardHeight, step, inset, scroll: track.scrollLeft, count, motion, images: Array.from(track.querySelectorAll<HTMLImageElement>('img')) }) ?? false
      } catch {
        renderer?.dispose()
        renderer = null
      }
      track.dataset.glass = ready ? 'true' : 'false'
      if (motion > 0.005 && renderer) frame = requestAnimationFrame(draw)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw) }
    redrawRef.current = schedule
    const measure = () => {
      const position = width ? track.scrollLeft / step : count
      width = track.clientWidth; height = track.clientHeight
      cardWidth = card.offsetWidth; cardHeight = card.offsetHeight
      step = cardWidth + parseFloat(getComputedStyle(track).columnGap)
      inset = (width - cardWidth) / 2
      stepRef.current = step
      track.scrollLeft = position * step
      previousScroll = track.scrollLeft
      schedule()
    }
    const onScroll = () => {
      setActive(((Math.round(track.scrollLeft / step) % count) + count) % count)
      schedule()
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => {
        if (dragRef.current || scrollAnimationRef.current) return
        const position = track.scrollLeft / step
        // Three repeated sets let both directions wrap without a visible jump.
        if (position < count * 0.5) track.scrollLeft += count * step
        else if (position > count * 2.5) track.scrollLeft -= count * step
        schedule()
      }, 180)
    }
    const resize = new ResizeObserver(measure)
    resize.observe(track)
    track.addEventListener('scroll', onScroll, { passive: true })
    const onContextLost = (event: Event) => {
      event.preventDefault(); track.dataset.glass = 'false'; renderer?.dispose(); renderer = null
    }
    const onContextRestored = () => {
      if (!motionQuery.matches) renderer = createLiquidGlassRenderer(canvas)
      schedule()
    }
    const onMotionChange = () => {
      reducedMotionRef.current = motionQuery.matches
      renderer?.dispose()
      renderer = motionQuery.matches ? null : createLiquidGlassRenderer(canvas)
      track.dataset.glass = 'false'
      schedule()
    }
    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)
    motionQuery.addEventListener('change', onMotionChange)
    const visibility = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) schedule() })
    visibility.observe(track)
    const onPageVisible = () => { if (!document.hidden) schedule() }
    document.addEventListener('visibilitychange', onPageVisible)
    window.addEventListener('pageshow', schedule)
    measure()
    return () => {
      disposed = true; redrawRef.current = () => {}
      cancelAnimationFrame(frame); clearTimeout(settleTimer)
      cancelAnimationFrame(scrollAnimationRef.current)
      scrollAnimationRef.current = 0
      resize.disconnect(); track.removeEventListener('scroll', onScroll)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      motionQuery.removeEventListener('change', onMotionChange)
      visibility.disconnect()
      document.removeEventListener('visibilitychange', onPageVisible)
      window.removeEventListener('pageshow', schedule)
      renderer?.dispose()
    }
  }, [count])

  const settleTo = (position: number) => {
    const track = trackRef.current
    if (!track) return
    // Keep native snapping disabled throughout the release animation. Restoring
    // it before scrolling can snap immediately, then launch a second movement.
    track.dataset.settling = 'true'
    cancelAnimationFrame(scrollAnimationRef.current)
    scrollAnimationRef.current = 0
    const from = track.scrollLeft
    track.scrollTo({ left: from, behavior: 'instant' })
    const target = Math.max(0, Math.min(position, track.scrollWidth - track.clientWidth))
    const distance = target - from
    const complete = () => {
      track.scrollLeft = target
      scrollAnimationRef.current = 0
      delete track.dataset.settling
    }
    if (reducedMotionRef.current || Math.abs(distance) < 1) { complete(); return }
    const duration = 360 + Math.min(Math.abs(distance) / stepRef.current, 1) * 160
    let previousTime: number | undefined
    let elapsed = 0
    const animate = (time: number) => {
      // Start on the first rendered frame and bound catch-up after a slow frame.
      // Glass rendering must not turn a delayed frame into an abrupt slide jump.
      if (previousTime !== undefined) elapsed += Math.min(Math.max(time - previousTime, 0), 32)
      previousTime = time
      const progress = Math.min(elapsed / duration, 1)
      // Smooth acceleration and deceleration, with no momentum or overshoot.
      const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10)
      track.scrollLeft = from + distance * eased
      if (progress < 1) scrollAnimationRef.current = requestAnimationFrame(animate)
      else complete()
    }
    scrollAnimationRef.current = requestAnimationFrame(animate)
  }
  const move = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const current = Math.round(track.scrollLeft / stepRef.current)
    settleTo((current + direction) * stepRef.current)
  }
  const finishDrag = () => {
    const track = trackRef.current
    if (!track || !dragRef.current) return
    const pointer = dragRef.current.pointer
    dragRef.current = null
    if (track.hasPointerCapture(pointer)) track.releasePointerCapture(pointer)
    const target = Math.round(track.scrollLeft / stepRef.current) * stepRef.current
    settleTo(target)
    delete track.dataset.dragging
  }

  return (
    <div className={styles.carousel} role="region" aria-roledescription={copy.carousel} aria-label={copy.gallery}>
      <div className={styles.caption} aria-live="polite" aria-atomic="true"><span>{images[active].captions[locale]}</span><span className={styles.credit}>{copy.credit}</span></div>
      <div className={styles.stage}>
        <div
          ref={trackRef}
          className={styles.track}
          tabIndex={0}
          aria-label={copy.drag}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) }
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== 'mouse' || event.button !== 0) return
            event.preventDefault()
            event.currentTarget.dataset.dragging = 'true'
            cancelAnimationFrame(scrollAnimationRef.current)
            scrollAnimationRef.current = 0
            delete event.currentTarget.dataset.settling
            event.currentTarget.scrollTo({ left: event.currentTarget.scrollLeft, behavior: 'instant' })
            dragRef.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, pointer: event.pointerId }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current
            if (drag) event.currentTarget.scrollLeft = drag.scroll + drag.x - event.clientX
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={finishDrag}
        >
          {[0, 1, 2].flatMap(set => images.map((photo, index) => (
            <figure key={`${set}-${photo.src}`} className={styles.card} aria-hidden={set !== 1 ? true : undefined}>
              <Image src={photo.src} alt={set === 1 ? photo.captions[locale] : ''} fill sizes="(max-width: 767px) 248px, (max-width: 1280px) 340px, 380px" className={styles.image} data-gallery-index={index} draggable={false} onLoad={(event) => { event.currentTarget.dataset.glassReady = 'true'; redrawRef.current() }} />
            </figure>
          )))}
        </div>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={() => move(-1)} aria-label={copy.previous} className={styles.arrow}><ArrowLeft size={19} /></button>
        <span className={styles.counter} aria-live="polite" aria-atomic="true"><span className={styles.current}>{String(active + 1).padStart(2, '0')}</span><span className={styles.divider} aria-hidden="true"> / </span><span className={styles.total}>{String(count).padStart(2, '0')}</span></span>
        <button type="button" onClick={() => move(1)} aria-label={copy.next} className={styles.arrow}><ArrowRight size={19} /></button>
      </div>
    </div>
  )
}
