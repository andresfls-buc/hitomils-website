import HeroPhotoRotator from './HeroPhotoRotator'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="mhero">
      <HeroPhotoRotator />

      {/* Gives the vertical word a pale bed to cross on small screens. */}
      <div className="mhero-seamfade" aria-hidden="true" />

      <p className="mhero-rail">Sapporo · Hokkaido · Japan</p>

      {/* Decorative. The real heading is the h1 below — this must never
          become one, and screen readers must not read it. */}
      <div className="mhero-word" aria-hidden="true">
        HITOMI
      </div>

      <div className="mhero-content">
        <p className="hero-eyebrow font-sans text-[10px] uppercase tracking-[0.24em] text-[#7A7570]">
          Bridal Makeup &amp; Hair
        </p>

        <h1 className="hero-title mhero-title mt-[1.1rem]">
          Bridal
          <br />
          <em>Beauty</em>
          <span className="mhero-byline">by Hitomi</span>
        </h1>

        <div className="hero-cta mt-10 flex flex-wrap items-center gap-3">
          <Button href="/portfolio" variant="filled" size="lg">
            View My Work
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Book a Session
          </Button>
        </div>
      </div>

      <p className="hero-body mhero-note">
        Bridal makeup and wedding hairstyling in Sapporo, Hokkaido. Twelve years
        refining a single craft — looks built for the length of a whole day, and
        for the photographs that outlive it.
      </p>
    </section>
  )
}
