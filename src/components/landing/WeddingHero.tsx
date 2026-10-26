import { landingCopy } from '@/data/landing'
import type { LandingLocale } from '@/lib/landing'
import InstagramContact from './InstagramContact'
import LanguageSwitcher from './LanguageSwitcher'
import WeddingHeroCarousel from './WeddingHeroCarousel'
import BrandLogo from '@/components/ui/BrandLogo'
import styles from './WeddingHero.module.css'

export default function WeddingHero({ locale }: { locale: LandingLocale }) {
  const copy = landingCopy[locale]
  return (
    <section id="hero" className={styles.hero} data-locale={locale} aria-labelledby="wedding-hero-title">
      <WeddingHeroCarousel locale={locale} />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.coverbar}>
        <div className={styles.masthead} aria-hidden="true"><BrandLogo variant="hero" light decorative /></div>
        <div className={styles.edition}>
          <p className={styles.location}>{copy.eyebrow}</p>
          <div className={styles.languages}><LanguageSwitcher locale={locale} compact /></div>
        </div>
      </div>
      <div className={styles.content}>
        <h1 id="wedding-hero-title" className={styles.title}>
          <span className={styles.service}>{copy.heading}</span>
          <span className={styles.headline}>{copy.signature}</span>
        </h1>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.actions}>
          <InstagramContact locale={locale} label={copy.cta} placement="hero" className={styles.contact} />
        </div>
        <p className={styles.note}>{copy.languageNote}</p>
      </div>
    </section>
  )
}
