import type { Metadata } from 'next'
import Image from 'next/image'
import { buildMetadata } from '@/lib/metadata'
import PageHero from '@/components/ui/PageHero'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { MapPin, Sparkles } from 'lucide-react'

export const metadata: Metadata = buildMetadata({
  title: 'About Hitomi',
  description:
    'Meet Hitomi Landazabal — bridal makeup artist and wedding hairstylist based in Sapporo, Japan. Specialising in elegant looks for international and Asian brides in Hokkaido.',
  alternates: { canonical: 'https://hitomils.com/about' },
})

const specialties = [
  'Bridal Makeup & Hair',
  'Asian & Western Features',
  'Long Hair Styling',
  'Natural & Glam Looks',
  'Skin-First Techniques',
  'International Clients',
]

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Hitomi" subtitle="The Artist" />

      {/* Bio Section */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Image */}
          <div className="relative order-2 md:order-1">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/about/portrait.jpg"
                alt="Hitomi Landazabal, bridal makeup and hair artist, Sapporo Japan"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-full h-full border border-[#B8A080] -z-10" />
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <SectionTitle subtitle="My Story" title="Hello, I'm Hitomi" />

            <div className="mt-8 space-y-5 font-sans text-base text-[#7A7570] leading-relaxed font-light">
              <p>
                I&apos;m a bridal makeup artist and wedding hairstylist based in beautiful
                Sapporo, Hokkaido. My passion for beauty began as a love of transformation
                — the moment when a woman looks in the mirror and feels truly, completely herself.
              </p>
              <p>
                Over the years, I have had the privilege of working with brides from Japan,
                Europe, North America, and across Asia. I understand that every woman is
                unique, and I take time to listen, to understand your vision, and to create
                a look that honours who you are — not who a trend says you should be.
              </p>
              <p>
                My approach is rooted in skin care and technique. Before any brush touches
                your face, I ensure your skin is prepared and nourished. I work with
                professional-grade products chosen for longevity and photography performance,
                so your look stays flawless from your morning preparations through your
                final dance.
              </p>
              <p>
                Whether you envision a soft, dewey natural look or a polished evening
                glamour, I am here to make your wedding morning as calm, beautiful, and
                memorable as the ceremony itself.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[#7A7570]">
              <MapPin size={16} className="text-[#B8A080]" />
              <span className="font-sans text-sm">
                Based in Sapporo, Hokkaido — available across Japan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="What I Do Best" title="Specialties" centered />

          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4">
            {specialties.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border border-[#EDD9D1] px-5 py-4"
              >
                <Sparkles size={16} className="text-[#B8A080] shrink-0" />
                <span className="font-sans text-sm text-[#2C2C2C]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTitle subtitle="Where I Work" title="Sapporo, Hokkaido" />
            <p className="mt-8 font-sans text-base text-[#7A7570] leading-relaxed font-light">
              Sapporo is one of Japan&apos;s most stunning cities for a destination wedding.
              From intimate chapel ceremonies in the city to lavish receptions surrounded by
              Hokkaido&apos;s breathtaking natural landscapes — I am here to be part of your day.
            </p>
            <p className="mt-4 font-sans text-base text-[#7A7570] leading-relaxed font-light">
              I travel throughout Hokkaido for weddings. For events further afield across
              Japan, please reach out — I would love to discuss your plans.
            </p>
            <p className="mt-4 font-sans text-sm text-[#7A7570]">
              I communicate fluently in both <strong className="text-[#2C2C2C] font-medium">English</strong> and{' '}
              <strong className="text-[#2C2C2C] font-medium">Japanese</strong> — so you can always feel understood.
            </p>
          </div>

          {/* Location badge */}
          <div className="flex items-center justify-center">
            <div className="border border-[#EDD9D1] p-12 text-center">
              <MapPin size={32} className="text-[#B8A080] mx-auto mb-4" />
              <p className="font-serif text-3xl text-[#2C2C2C]">Sapporo</p>
              <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mt-2">
                Hokkaido, Japan
              </p>
              <div className="mt-6 h-px w-12 bg-[#B8A080] mx-auto" />
              <p className="mt-6 font-sans text-xs text-[#7A7570]">
                Available for travel<br />across Hokkaido & Japan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#EDD9D1]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#2C2C2C]">
            Let&apos;s Create Your Bridal Look Together
          </h2>
          <p className="mt-4 font-sans text-sm text-[#7A7570] font-light">
            I would love to hear about your wedding vision.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="filled" size="lg">
              Get in Touch
            </Button>
            <Button href="/portfolio" variant="ghost" size="lg">
              View My Work
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
