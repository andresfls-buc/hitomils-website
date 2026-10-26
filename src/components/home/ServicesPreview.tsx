import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import WeddingLandingLink from '@/components/services/WeddingLandingLink'

const previewServices = [
  {
    title: 'Bridal Hair & Makeup — At Salon',
    description:
      'Bridal makeup and wedding hairstyling at a Sapporo salon, with an English or Japanese consultation to plan your look.',
    from: '¥12,000〜',
    href: '/services#bridal-combo-salon',
  },
  {
    title: 'Bridal Hair & Makeup — At Hotel',
    description:
      'Wedding hair and makeup in your Sapporo hotel room. Travel across Hokkaido and elsewhere in Japan is available on request.',
    from: '¥22,000〜',
    href: '/services#bridal-combo-hotel',
  },
  {
    title: 'Special Occasions',
    description:
      'Makeup and hairstyling in Sapporo for graduations, parties, formal events and photo shoots.',
    from: 'On request',
    href: '/services#event-makeup',
  },
]

export default function ServicesPreview() {
  return (
    <section id="services" className="scroll-mt-24 py-24 md:py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <SectionTitle subtitle="Sapporo · Hokkaido · Japan" title="Bridal & Occasion Services" centered />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewServices.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.14}>
              <div className="group border border-[#EDD9D1] p-8 hover:border-[#C9A99A] transition-colors duration-300 h-full">
                <h3 className="font-serif text-2xl font-light text-[#2C2C2C]">
                  {service.title}
                </h3>
                <div className="mt-3 h-px w-10 bg-[#B8A080]" />
                <p className="mt-5 font-sans text-sm text-[#7A7570] leading-relaxed">
                  {service.description}
                </p>
                <p className="mt-6 font-sans text-xs uppercase tracking-widest text-[#B8A080]">
                  {service.from === 'On request' ? 'On request' : `From ${service.from}`}
                </p>
                <Link
                  href={service.href}
                  className="mt-4 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[#2C2C2C] hover:text-[#C9A99A] transition-colors group-hover:gap-3"
                >
                  View Service
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10">
          <WeddingLandingLink />
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 text-center">
            <Button href="/services" variant="ghost">
              View All Services & Prices
            </Button>
          </div>
        </Reveal>

      </div>
    </section>
  )
}
