import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-end">
      {/* Background Image */}
      <Image
        src="/images/home/hero.jpg"
        alt="Elegant bridal makeup by Hitomi, Sapporo wedding hairstylist"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-20 md:pb-28">
        <p className="font-sans text-xs uppercase tracking-widest text-[#D6C4A8] mb-4">
          Bridal Makeup & Hair · Sapporo, Japan
        </p>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-tight max-w-3xl">
          Bridal Beauty<br />
          <em className="not-italic text-[#C9A99A]">in Sapporo</em>
        </h1>
        <p className="mt-6 font-sans text-base md:text-lg text-white/80 max-w-lg leading-relaxed font-light">
          Elegant, timeless looks crafted for your most beautiful day.
          Serving brides from around the world in Hokkaido, Japan.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button href="/portfolio" variant="filled" size="lg">
            View My Work
          </Button>
          <Button href="/contact" variant="ghost-light" size="lg">
            Get in Touch
          </Button>
        </div>
      </div>
    </section>
  )
}
