import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import PageHero from '@/components/ui/PageHero'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { services, addOns } from '@/data/services'
import { Check } from 'lucide-react'

export const metadata: Metadata = buildMetadata({
  title: 'Services & Pricing',
  description:
    'Bridal makeup and wedding hairstyling services in Sapporo, Japan. Transparent pricing for bridal packages, special occasions, and add-ons. English-speaking makeup artist in Hokkaido.',
  alternates: { canonical: 'https://hitomils.com/services' },
})

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Bridal Makeup & Hair Services by Hitomi, Sapporo',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: s.title,
      description: s.description,
      offers: {
        '@type': 'Offer',
        price: s.price.replace('¥', '').replace(',', ''),
        priceCurrency: 'JPY',
      },
    },
  })),
}

export default function ServicesPage() {
  const bridalServices = services.filter((s) => s.category === 'bridal')
  const occasionServices = services.filter((s) => s.category === 'occasion')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageHero title="Services & Pricing" subtitle="What I Offer" />

      {/* Bridal Services */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="For Your Wedding Day" title="Bridal Services" />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {bridalServices.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="border border-[#EDD9D1] p-8 md:p-10"
              >
                <h3 className="font-serif text-3xl font-light text-[#2C2C2C]">
                  {service.title}
                </h3>
                <div className="mt-3 h-px w-10 bg-[#B8A080]" />
                <p className="mt-5 font-sans text-sm text-[#7A7570] leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={14} className="text-[#B8A080] mt-0.5 shrink-0" />
                      <span className="font-sans text-sm text-[#7A7570]">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-[#EDD9D1]">
                  <p className="font-serif text-3xl text-[#2C2C2C]">{service.price}</p>
                  {service.priceNote && (
                    <p className="mt-1 font-sans text-xs text-[#7A7570]">{service.priceNote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Occasions */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Parties, Events & More" title="Special Occasions" />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {occasionServices.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="border border-[#EDD9D1] p-8 md:p-10"
              >
                <h3 className="font-serif text-3xl font-light text-[#2C2C2C]">
                  {service.title}
                </h3>
                <div className="mt-3 h-px w-10 bg-[#B8A080]" />
                <p className="mt-5 font-sans text-sm text-[#7A7570] leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={14} className="text-[#B8A080] mt-0.5 shrink-0" />
                      <span className="font-sans text-sm text-[#7A7570]">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-[#EDD9D1]">
                  <p className="font-serif text-3xl text-[#2C2C2C]">{service.price}</p>
                  {service.priceNote && (
                    <p className="mt-1 font-sans text-xs text-[#7A7570]">{service.priceNote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Extras" title="Add-ons & Notes" />

          <div className="mt-12 max-w-2xl">
            <div className="border border-[#EDD9D1]">
              {addOns.map((addon, i) => (
                <div
                  key={addon.title}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i < addOns.length - 1 ? 'border-b border-[#EDD9D1]' : ''
                  }`}
                >
                  <span className="font-sans text-sm text-[#2C2C2C]">{addon.title}</span>
                  <span className="font-sans text-sm text-[#A8796A] whitespace-nowrap ml-4">
                    {addon.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4 text-sm text-[#7A7570] font-sans leading-relaxed">
              <p>
                <span className="text-[#2C2C2C] font-medium">Payment:</span> Cash (JPY) accepted on the day. Bank transfer available upon request.
              </p>
              <p>
                <span className="text-[#2C2C2C] font-medium">Cancellation:</span> Full refund if cancelled 30+ days before the event. 50% charge for cancellations within 14 days.
              </p>
              <p>
                <span className="text-[#2C2C2C] font-medium">Travel:</span> Available for weddings across Hokkaido. Travel and accommodation costs apply for locations outside Sapporo.
              </p>
              <p>
                <span className="text-[#2C2C2C] font-medium">Bridal bookings:</span> Please inquire at least 3 months in advance to secure your date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#EDD9D1]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#2C2C2C]">
            Ready to Begin?
          </h2>
          <p className="mt-4 font-sans text-sm text-[#7A7570] font-light max-w-md mx-auto">
            Reach out on Instagram to discuss your vision, check availability,
            and receive a personalised quote.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet"
              variant="filled"
              size="lg"
              external
            >
              Message on Instagram
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Contact Info
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
