import HeroImageSequence from "./HeroImageSequence";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[88vh] min-h-[580px] max-h-[860px] overflow-hidden bg-[#FAF7F4]">
      {/* ── Image container ───────────────────────────────────────────────
          Mobile  : full bleed (image behind gradient overlay).
          Desktop : right column only, inset from top/bottom so it feels
                    framed rather than wallpapered.
      ─────────────────────────────────────────────────────────────────── */}
      <div
        className="
        absolute inset-0
        md:left-[40%] md:top-6 md:bottom-6 md:right-6
      "
      >
        <HeroImageSequence />
        {/* Subtle overlay to reduce visual weight */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ── Text panel ────────────────────────────────────────────────────
          Mobile  : pinned to the BOTTOM, full width, gradient fade upward.
          Desktop : solid cream column on the LEFT, full height.
      ─────────────────────────────────────────────────────────────────── */}
      <div
        className="
        absolute left-0 z-10
        flex flex-col
        px-8 sm:px-12 lg:px-14 xl:px-20

        bottom-0 w-full justify-end
        bg-gradient-to-t from-[#FAF7F4] via-[#FAF7F4]/95 to-transparent
        pt-24 pb-12

        md:inset-y-0 md:w-[42%] md:justify-center
        md:bg-[#FAF7F4] md:pt-0 md:pb-0
      "
      >
        <p
          className="hero-eyebrow
          font-sans text-xs uppercase tracking-[0.22em] text-[#7A7570]"
        >
          Bridal Makeup &amp; Hair · Sapporo, Japan
        </p>

        <h1
          className="hero-title
          mt-5 font-serif font-light leading-[1.08] text-[#2C2C2C]
          text-[2.6rem] sm:text-5xl lg:text-[3.2rem] xl:text-[3.8rem]"
        >
          Bridal Beauty
          <br />
          <em className="not-italic text-[#A8796A]">by Hitomi </em>
        </h1>

        <div className="hero-body mt-6 mb-6 w-8 h-px bg-[#D6C4A8]" />

        <p
          className="hero-body
          font-sans font-light text-[#7A7570]
          text-sm leading-[1.9] max-w-[270px]"
        >
          Timeless, elegant looks for your most unforgettable day. Serving
          brides from around the world in Hokkaido, Japan.
        </p>

        <div className="hero-cta mt-9 flex flex-col xs:flex-row gap-3">
          <Button href="/portfolio" variant="filled" size="lg">
            View My Work
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Book a Session
          </Button>
        </div>
      </div>
    </section>
  );
}
