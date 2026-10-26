'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { heroCarouselLabels, weddingHeroImages } from '@/data/weddingHero'
import type { LandingLocale } from '@/lib/landing'
import styles from './WeddingHero.module.css'

export default function WeddingHeroCarousel({ locale }: { locale: LandingLocale }) {
  const [active, setActive] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [loaded, setLoaded] = useState<boolean[]>([])
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const copy = heroCarouselLabels[locale]
  const count = weddingHeroImages.length

  useEffect(() => {
    const section = rootRef.current?.closest('section')
    if (!section) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setReducedMotion(motion.matches)
    const onVisibility = () => setPageVisible(!document.hidden)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(section)
    onMotion(); onVisibility()
    motion.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const next = (active + 1) % count
  const ready = !!loaded[next]
  useEffect(() => {
    if (reducedMotion || !visible || !pageVisible || !ready) return
    const timer = setTimeout(() => setActive(next), 6000)
    return () => clearTimeout(timer)
  }, [next, reducedMotion, visible, pageVisible, ready])

  return (
    <div
      ref={rootRef}
      className={styles.carousel}
      role="group"
      aria-label={copy.gallery}
      data-hero-slide={active + 1}
      data-hero-paused={reducedMotion || !visible || !pageVisible}
    >
      {weddingHeroImages.map((photo, index) => (
        <div key={photo.src} className={styles.frame} role="group" aria-label={`${copy.slide} ${index + 1} / ${count}`} data-active={active === index} aria-hidden={active !== index} style={{ '--photo-desktop': photo.positionDesktop, '--photo-mobile': photo.positionMobile } as CSSProperties}>
          <Image src={photo.src} alt={active === index ? photo.alt[locale] : ''} fill sizes="100vw" preload={index === 0} className={styles.photo} draggable={false} onLoad={() => setLoaded(previous => { const updated = [...previous]; updated[index] = true; return updated })} />
        </div>
      ))}
      <div className={styles.dock}>
        <div className={styles.caption}><p>{weddingHeroImages[active].caption[locale]}</p><p className={styles.credit}>{copy.photoCredit}</p></div>
      </div>
    </div>
  )
}
