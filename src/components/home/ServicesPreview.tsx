import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'

const previewServices = [
  {
    title: 'Bridal Makeup',
    description:
      'Flawless, long-lasting makeup tailored to your features and wedding aesthetic. Natural glow to polished glamour.',
    from: '¥35,000',
    href: '/services#bridal-makeup',
  },
  {
    title: 'Wedding Hairstyling',
    description:
      'Elegant updos, flowing waves, or traditional styles crafted to complement your dress and last all day.',
    from: '¥30,000',
    href: '/services#bridal-hair',
  },
  {
    title: 'Special Occasions',
    description:
      'Graduation ceremonies, parties, photo shoots — any moment you want to look and feel your very best.',
    from: '¥15,000',
    href: '/services#event-makeup',
  },
]

export default function ServicesPreview() {
  return (
    <section className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          subtitle="What I Offer"
          title="Services & Pricing"
          centered
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewServices.map((service) => (
            <div
              key={service.title}
              className="group border border-[#EDD9D1] p-8 hover:border-[#C9A99A] transition-colors duration-300"
            >
              <h3 className="font-serif text-2xl font-light text-[#2C2C2C]">
                {service.title}
              </h3>
              <div className="mt-3 h-px w-10 bg-[#B8A080]" />
              <p className="mt-5 font-sans text-sm text-[#7A7570] leading-relaxed">
                {service.description}
              </p>
              <p className="mt-6 font-sans text-xs uppercase tracking-widest text-[#B8A080]">
                From {service.from}
              </p>
              <Link
                href={service.href}
                className="mt-4 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[#2C2C2C] hover:text-[#C9A99A] transition-colors group-hover:gap-3"
              >
                See Details
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/services" variant="ghost">
            View All Services & Prices
          </Button>
        </div>
      </div>
    </section>
  )
}
