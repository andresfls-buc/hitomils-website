import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    /*
     * flex-col-reverse on mobile  →  image renders on top, text below
     * md:flex-row on desktop      →  text on left (DOM first), image on right
     */
    <section className="flex flex-col-reverse md:flex-row h-screen min-h-[620px] overflow-hidden">

      {/* ── LEFT: Text panel ───────────────────────────────────── */}
      <div className="
        flex flex-col justify-center
        w-full md:w-[40%]
        bg-[#FAF7F4]
        px-8 sm:px-12 lg:px-14 xl:px-20
        py-10 md:py-0
        flex-1 md:flex-none
      ">

        {/* Eyebrow */}
        <p className="hero-eyebrow
          font-sans text-[10px] uppercase tracking-[0.22em] text-[#B8A080]">
          Bridal Makeup &amp; Hair · Sapporo, Japan
        </p>

        {/* Heading */}
        <h1 className="hero-title
          mt-5 font-serif font-light leading-[1.08]
          text-[#2C2C2C]
          text-[2.6rem] sm:text-5xl lg:text-[3.2rem] xl:text-[3.8rem]">
          Bridal Beauty<br />
          <em className="not-italic text-[#A8796A]">by Hitomi</em>
        </h1>

        {/* Separator */}
        <div className="hero-body mt-6 mb-6 w-8 h-px bg-[#D6C4A8]" />

        {/* Body */}
        <p className="hero-body
          font-sans font-light text-[#7A7570]
          text-sm leading-[1.9] max-w-[270px]">
          Timeless, elegant looks for your most unforgettable day.
          Serving brides from around the world in Hokkaido, Japan.
        </p>

        {/* CTAs */}
        <div className="hero-cta mt-9 flex flex-col xs:flex-row gap-3">
          <Button href="/portfolio" variant="filled" size="lg">
            View My Work
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Book a Session
          </Button>
        </div>
      </div>

      {/* ── RIGHT: Image panel ─────────────────────────────────── */}
      <div className="
        relative
        w-full md:w-[60%]
        h-[58vh] md:h-full
        shrink-0
        overflow-hidden
      ">
        <Image
          src="/images/home/hero.jpg"
          alt="Elegant bridal makeup by Hitomi, Sapporo wedding hairstylist"
          fill
          priority
          className="hero-image object-cover object-center"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

    </section>
  )
}
