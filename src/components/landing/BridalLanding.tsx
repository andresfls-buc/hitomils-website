import Image from 'next/image'
import { Check, Plus } from 'lucide-react'
import InstagramContact, { LandingView } from './InstagramContact'
import WeddingHero from './WeddingHero'
import LiquidGlassCarousel from './LiquidGlassCarousel'
import GoogleReviewsLink from './GoogleReviewsLink'
import { landingGallery } from '@/data/landingGallery'
import { landingCopy } from '@/data/landing'
import { services } from '@/data/services'
import { testimonials } from '@/data/testimonials'
import type { LandingLocale } from '@/lib/landing'

const googleReviewsUrl = testimonials[0]?.googleUrl
const bridalServices = ['bridal-combo-salon', 'bridal-combo-hotel'].map((id) => services.find((service) => service.id === id)!)

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`mb-5 text-xs tracking-[0.2em] uppercase ${light ? 'text-[#EDD9D1]' : 'text-[#916452]'}`}>{children}</p>
}

export default function BridalLanding({ locale }: { locale: LandingLocale }) {
  const copy = landingCopy[locale]
  return (
    <div className="bridal-landing pb-20 md:pb-0">
      <LandingView locale={locale} />
      <WeddingHero locale={locale} />

      <section aria-label={copy.artistEyebrow} className="px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 border-y border-[#DDD1C7] py-8 sm:grid-cols-3 sm:py-10">
          {copy.trust.map((item, index) => <div key={item.value} className={`py-3 text-center ${index > 0 ? 'sm:border-l sm:border-[#DDD1C7]' : ''}`}><p className="font-serif text-2xl md:text-3xl">{item.value}</p><p className="mt-2 text-xs text-[#625D58]">{item.label}</p></div>)}
        </div>
      </section>

      <section id="services" className="scroll-mt-24 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl"><Eyebrow>{copy.servicesEyebrow}</Eyebrow><h2 className="text-4xl font-light md:text-5xl">{copy.servicesTitle}</h2><p className="mt-5 text-sm leading-[1.9] text-[#625D58]">{copy.servicesIntro}</p></div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {copy.services.map((service, index) => <article key={service.title} className="border border-[#DDD1C7] bg-white/50 p-7 md:p-10">
              <span className="font-serif text-lg text-[#916452]">0{index + 1}</span>
              <h3 className="mt-4 text-3xl font-light">{service.title}</h3>
              <p className="mt-4 min-h-16 text-sm leading-relaxed text-[#625D58]">{service.description}</p>
              <p className="mt-7 font-serif text-4xl">{bridalServices[index].price}</p><p className="mt-2 text-xs leading-relaxed text-[#625D58]">{service.priceNote}</p>
              <ul className="my-7 space-y-3 border-t border-[#DDD1C7] pt-6">{service.includes.map((item) => <li key={item} className="flex gap-3 text-sm text-[#625D58]"><Check size={15} className="mt-0.5 shrink-0 text-[#916452]" />{item}</li>)}</ul>
              <InstagramContact locale={locale} label={copy.cta} placement={index === 0 ? 'salon' : 'hotel'} className="w-full" />
            </article>)}
          </div>
          <div className="mt-8 flex flex-col gap-4 border-l-2 border-[#C9A99A] bg-[#EDD9D1]/30 p-6 md:flex-row md:gap-10 md:p-8"><h3 className="shrink-0 text-2xl md:max-w-64">{copy.preWeddingTitle}</h3><p className="text-sm leading-[1.9] text-[#625D58]">{copy.preWeddingText}</p></div>
        </div>
      </section>

      <section id="work" className="scroll-mt-24 overflow-hidden bg-[#EFE8E1] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center"><Eyebrow>{copy.portfolioEyebrow}</Eyebrow><h2 className="text-4xl font-light md:text-5xl">{copy.portfolioTitle}</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#625D58]">{copy.portfolioIntro}</p></div>
        </div>
        <LiquidGlassCarousel images={landingGallery} locale={locale} />
      </section>

      <section id="artist" className="scroll-mt-24 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-3xl bg-[#EDD9D1]"><Image src="/images/about/hitomi-landazabal-bridal-weddings-makeup-sapporo.jpg" alt="Hitomi Landazabal" fill sizes="(max-width: 767px) 85vw, 384px" className="object-cover object-top" /></div>
          <div><Eyebrow>{copy.artistEyebrow}</Eyebrow><h2 className="text-4xl leading-tight font-light md:text-5xl">{copy.artistTitle}</h2><p className="mt-6 text-sm leading-[1.9] text-[#625D58]">{copy.artistText}</p>{googleReviewsUrl && <div className="mt-8"><GoogleReviewsLink href={googleReviewsUrl} label={copy.reviews} /></div>}</div>
        </div>
      </section>

      <section id="locations" className="scroll-mt-24 bg-[#2C2C2C] px-6 py-20 text-[#FAF7F4] md:py-24">
        <div className="mx-auto max-w-6xl"><Eyebrow light>{copy.locationsEyebrow}</Eyebrow><h2 className="text-4xl font-light md:text-5xl">{copy.locationsTitle}</h2><div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-12">{copy.locations.map((location, index) => <article key={location.title} className="border-t border-white/25 pt-6"><span className="text-xs text-[#EDD9D1]">0{index + 1}</span><h3 className="mt-4 text-3xl font-light">{location.title}</h3><p className="mt-4 text-sm leading-[1.9] text-[#FAF7F4]/80">{location.text}</p></article>)}</div></div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl"><Eyebrow>{copy.stepsEyebrow}</Eyebrow><h2 className="text-4xl font-light md:text-5xl">{copy.stepsTitle}</h2><ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-12">{copy.steps.map((step, index) => <li key={step.title}><span className="font-serif text-5xl font-light text-[#916452]">0{index + 1}</span><h3 className="mt-5 text-2xl">{step.title}</h3><p className="mt-3 text-sm leading-[1.9] text-[#625D58]">{step.text}</p></li>)}</ol></div>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-[#DDD1C7] px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20"><div><Eyebrow>{copy.faqEyebrow}</Eyebrow><h2 className="text-4xl font-light md:text-5xl">{copy.faqTitle}</h2></div><div>{copy.faqs.map((faq) => <details key={faq.question} className="group border-b border-[#DDD1C7] py-5"><summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8796A] [&::-webkit-details-marker]:hidden">{faq.question}<Plus size={17} className="mt-1 shrink-0 text-[#916452] transition-transform group-open:rotate-45" /></summary><p className="mt-4 pr-6 text-sm leading-[1.9] text-[#625D58]">{faq.answer}</p></details>)}</div></div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-[#EDD9D1]/50 px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
          <div><Eyebrow>{copy.contactEyebrow}</Eyebrow><h2 className="text-4xl leading-tight font-light md:text-5xl">{copy.contactTitle}</h2><p className="mt-5 max-w-lg text-sm leading-[1.9] text-[#625D58]">{copy.contactText}</p><InstagramContact locale={locale} label={copy.cta} placement="final" className="mt-7" /><p className="mt-4 text-xs text-[#625D58]">{copy.languageNote}</p></div>
          <div className="border border-[#C9A99A] bg-[#FAF7F4]/60 p-7 md:p-9"><h3 className="text-2xl">{copy.messageChecklist}</h3><ul className="mt-6 space-y-4">{copy.messageItems.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#625D58]"><Check size={16} className="mt-0.5 shrink-0 text-[#916452]" />{item}</li>)}</ul><p className="mt-6 border-t border-[#DDD1C7] pt-5 text-xs leading-relaxed text-[#625D58]">{copy.availabilityNote}</p></div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#DDD1C7] bg-[#FAF7F4]/95 px-6 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden"><InstagramContact locale={locale} label={copy.cta} placement="mobile_sticky" className="min-h-11 w-full py-3" /></div>
    </div>
  )
}
