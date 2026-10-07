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
          Sapporo · Hokkaido · Japan
        </p>

        <h1 className="hero-title mhero-title mt-[1.1rem]">
          Bridal
          <br />
          <em>Makeup</em>
          <span className="block mt-3 font-sans text-sm font-light tracking-wide">
            &amp; Wedding Hair
          </span>
          {/* Not shown: the name is already displayed as the giant vertical
              word, which is aria-hidden. This keeps the h1 reading in full
              for assistive tech and crawlers without repeating it on screen. */}
          <span className="sr-only"> by Hitomi</span>
        </h1>

        <p className="hero-body mhero-note">
          English-speaking bridal makeup artist and wedding hairstylist based
          in Sapporo, Hokkaido, Japan. Salon and hotel services for your wedding
          day, with travel across Japan on request.
        </p>
      </div>

      {/* Docked bottom-left, out of the text flow. */}
      <div className="hero-cta mhero-cta flex flex-col items-start gap-2.5">
        <Button href="/portfolio" variant="filled" size="sm">
          View My Work
        </Button>
        <Button href="/contact" variant="ghost" size="sm">
          Check Availability
        </Button>
      </div>
    </section>
  )
}
