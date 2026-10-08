import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import PageHero from '@/components/ui/PageHero'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { services, addOns } from '@/data/services'
import { Check } from 'lucide-react'
import ServiceBookingButton from '@/components/services/ServiceBookingButton'
import WeddingLandingLink from '@/components/services/WeddingLandingLink'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: { absolute: 'Bridal Hair & Makeup in Sapporo, Hokkaido | Hitomi' },
  description:
    'Bridal makeup and wedding hair in Sapporo, Hokkaido, Japan. Salon and hotel services, English consultations, and travel across Japan on request.',
  alternates: { canonical: `${siteUrl}/services` },
})

function extractPrice(price: string): object {
  const numeric = price.replace(/[¥,〜]/g, '').trim()
  const isNumeric = /^\d+$/.test(numeric)
  if (!isNumeric) return { '@type': 'Offer', description: price, priceCurrency: 'JPY' }
  return {
    '@type': 'Offer',
    price: numeric,
    priceCurrency: 'JPY',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      minPrice: numeric,
      priceCurrency: 'JPY',
    },
  }
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Bridal Makeup & Hair Services in Sapporo, Hokkaido, Japan by Hitomi',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: s.title,
      description: s.description,
      provider: { '@id': `${siteUrl}/#business` },
      areaServed: { '@type': 'Country', name: 'Japan' },
      offers: extractPrice(s.price),
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

      <PageHero title="Bridal Hair & Makeup in Sapporo" subtitle="Hokkaido, Japan · Services & Pricing" />

      {/* Bridal Services */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionTitle subtitle="For Your Wedding Day" title="Wedding Makeup & Hairstyling" />
          </Reveal>
          <p className="mt-6 max-w-3xl font-sans text-sm text-[#7A7570] leading-relaxed">
            I&apos;m Hitomi, an English-speaking bridal makeup artist and wedding
            hairstylist based in Sapporo, Hokkaido, Japan. Choose hair and makeup
            at a Sapporo salon or get ready in your hotel room with an artist who
            comes to you. Both bridal services include a pre-wedding consultation,
            skin preparation, makeup and hairstyling, so we can plan a look that
            suits your features, dress and wishes.
          </p>
          <p className="mt-4 max-w-3xl font-sans text-sm text-[#7A7570] leading-relaxed">
            Communication is available in English and Japanese, whether you live
            locally or are travelling to Japan for your wedding. For ceremonies
            elsewhere in Hokkaido or Japan, share your date and venue to discuss
            availability, travel and accommodation costs.
          </p>
          <div className="mt-8">
            <WeddingLandingLink />
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {bridalServices.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.12}>
                <div id={service.id} className="border border-[#EDD9D1] p-8 md:p-10 h-full">
                  <h3 className="font-serif text-3xl font-light text-[#2C2C2C]">{service.title}</h3>
                  <div className="mt-3 h-px w-10 bg-[#B8A080]" />
                  <p className="mt-5 font-sans text-sm text-[#7A7570] leading-relaxed">{service.description}</p>
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
                  <ServiceBookingButton serviceName={service.title} servicePrice={service.price} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Special Occasions */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionTitle subtitle="Parties, Events & More" title="Occasion Makeup & Hair in Sapporo" />
          </Reveal>
          <p className="mt-6 max-w-3xl font-sans text-sm text-[#7A7570] leading-relaxed">
            You can also book makeup or hairstyling for graduation ceremonies,
            parties, formal dinners and photo shoots in Sapporo. Tell me about
            your event, outfit and preferred style so we can discuss the service
            you need. Occasion appointments are quoted individually.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {occasionServices.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.12}>
                <div id={service.id} className="border border-[#EDD9D1] p-8 md:p-10 h-full">
                  <h3 className="font-serif text-3xl font-light text-[#2C2C2C]">{service.title}</h3>
                  <div className="mt-3 h-px w-10 bg-[#B8A080]" />
                  <p className="mt-5 font-sans text-sm text-[#7A7570] leading-relaxed">{service.description}</p>
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
                  <ServiceBookingButton serviceName={service.title} servicePrice={service.price} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service areas and booking preparation */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionTitle subtitle="Where I Work" title="Wedding Hair & Makeup in Hokkaido & Japan" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 font-sans text-sm text-[#7A7570] leading-relaxed">
            <div>
              <h3 className="font-serif text-2xl text-[#2C2C2C] mb-4">Sapporo salon & hotel appointments</h3>
              <p>
                Choose a salon appointment or prepare in your hotel room in
                Sapporo. Hotel bridal appointments include travel within
                Sapporo city. See the service cards above for starting prices
                and what is included; your final quote is confirmed after
                consultation.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#2C2C2C] mb-4">Destination weddings in Hokkaido</h3>
              <p>
                Planning a wedding in Niseko, Lake Toya or another Hokkaido
                location? Send your wedding date, venue and getting-ready
                address to discuss an appointment. Travel outside Sapporo is
                arranged according to availability, with travel and
                accommodation costs quoted separately.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#2C2C2C] mb-4">Weddings elsewhere in Japan</h3>
              <p>
                I am based in Hokkaido and can travel elsewhere in Japan on
                request, subject to availability. Share your city or venue and
                schedule when you enquire so we can discuss the travel
                arrangements and costs. We can plan your wedding look in
                English or Japanese.
              </p>
            </div>
          </div>
          <div className="mt-12 max-w-3xl">
            <h3 className="font-serif text-2xl text-[#2C2C2C]">How to enquire about bridal hair & makeup</h3>
            <p className="mt-4 font-sans text-sm text-[#7A7570] leading-relaxed">
              Message me on Instagram with your date, city or venue, the time
              you need to be ready, and whether you prefer a salon or hotel
              appointment. Reference photos help explain the hair and makeup
              you have in mind. For bridal bookings, please enquire at least
              three months in advance to check availability.
            </p>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionTitle subtitle="Extras" title="Add-ons & Notes" />
          </Reveal>
          <Reveal delay={0.1} className="mt-12 max-w-2xl">
            <div className="border border-[#EDD9D1]">
              {addOns.map((addon, i) => (
                <div
                  key={addon.title}
                  className={`flex items-center justify-between px-6 py-4 ${i < addOns.length - 1 ? 'border-b border-[#EDD9D1]' : ''}`}
                >
                  <span className="font-sans text-sm text-[#2C2C2C]">{addon.title}</span>
                  <span className="font-sans text-sm text-[#A8796A] whitespace-nowrap ml-4">{addon.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 space-y-4 text-sm text-[#7A7570] font-sans leading-relaxed">
              <p><span className="text-[#2C2C2C] font-medium">Payment:</span> Cash (JPY) accepted on the day. Bank transfer available upon request.</p>
              <p><span className="text-[#2C2C2C] font-medium">Cancellation:</span> Full refund if cancelled 30+ days before the event. 50% charge for cancellations within 14 days.</p>
              <p><span className="text-[#2C2C2C] font-medium">Travel:</span> Available across Hokkaido and elsewhere in Japan on request, subject to availability. Travel and accommodation costs apply for locations outside Sapporo.</p>
              <p><span className="text-[#2C2C2C] font-medium">Bridal bookings:</span> Please inquire at least 3 months in advance to secure your date.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Salon Locations */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionTitle subtitle="Sapporo, Hokkaido, Japan" title="Salon Locations in Sapporo" centered />
          </Reveal>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <Reveal delay={0}>
              <div className="flex flex-col gap-6">
                <div className="border border-[#EDD9D1] p-6">
                  <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-2">Teine</p>
                  <h3 className="font-serif text-2xl font-light text-[#2C2C2C]">Total Beauty Bonita 手稲店</h3>
                  <div className="mt-3 h-px w-10 bg-[#B8A080]" />
                  <p className="mt-4 font-sans text-sm text-[#7A7570] leading-relaxed">
                    〒006-0021<br />藤川ビル 2階, 3 Chome-4-5 Teinehoncho 1 Jo<br />Teine Ward, Sapporo, Hokkaido
                  </p>
                </div>
                <div className="overflow-hidden border border-[#EDD9D1]">
                  <iframe title="Total Beauty Bonita 手稲店" src="https://maps.google.com/maps?q=3+Chome-4-5+Teinehoncho+1+Jo,+Teine+Ward,+Sapporo,+Hokkaido+006-0021&output=embed&z=16" width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="flex flex-col gap-6">
                <div className="border border-[#EDD9D1] p-6">
                  <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-2">Hassamu-minami</p>
                  <h3 className="font-serif text-2xl font-light text-[#2C2C2C]">Total Beauty Bonita 発寒南店</h3>
                  <div className="mt-3 h-px w-10 bg-[#B8A080]" />
                  <p className="mt-4 font-sans text-sm text-[#7A7570] leading-relaxed">
                    〒063-0061<br />6 Chome-3-10 Nishimachikita<br />Nishi Ward, Sapporo, Hokkaido
                  </p>
                </div>
                <div className="overflow-hidden border border-[#EDD9D1]">
                  <iframe title="Total Beauty Bonita 発寒南店" src="https://maps.google.com/maps?q=6+Chome-3-10+Nishimachikita,+Nishi+Ward,+Sapporo,+Hokkaido+063-0061&output=embed&z=16" width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#EDD9D1]">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-[#2C2C2C]">Plan Your Wedding Hair & Makeup in Japan</h2>
            <p className="mt-4 font-sans text-sm text-[#7A7570] font-light max-w-md mx-auto">
              Share your wedding date, venue and preferred service on Instagram
              to check availability and receive a personalised quote for
              Sapporo, Hokkaido or your destination wedding elsewhere in Japan.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet" variant="filled" size="lg" external>
                Message on Instagram
              </Button>
              <Button href="/contact" variant="ghost" size="lg">Contact Info</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
