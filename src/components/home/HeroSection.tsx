import HeroPhotoRotator from './HeroPhotoRotator'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="mhero">
      <HeroPhotoRotator />

      {/* The cream panel is a layer ON TOP of a full-bleed photo, not one
          half of a split — that edge and its shadow are what make the
          composition read as paper laid over an image. */}
      <div className="mhero-panel" aria-hidden="true" />

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
          {/* Not shown: the name is already displayed as the giant vertical
              word, which is aria-hidden. This keeps the h1 reading in full
              for assistive tech and crawlers without repeating it on screen. */}
          <span className="sr-only"> by Hitomi</span>
        </h1>

        <div className="hero-cta mt-8 flex flex-wrap items-center justify-start gap-2.5">
          <Button href="/portfolio" variant="filled" size="sm">
            View My Work
          </Button>
          <Button href="/contact" variant="ghost" size="sm">
            Book a Session
          </Button>
        </div>

        <p className="hero-body mhero-note">
          Bridal makeup and wedding hairstyling in Sapporo, Hokkaido. Twelve
          years refining a single craft — looks built for the length of a whole
          day, and for the photographs that outlive it.
        </p>
      </div>

    </section>
  )
}
