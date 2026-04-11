import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import PageHero from '@/components/ui/PageHero'
import SectionTitle from '@/components/ui/SectionTitle'
import Reveal from '@/components/ui/Reveal'
import { MapPin, Clock, Mail } from 'lucide-react'
import InstagramIcon from '@/components/ui/InstagramIcon'

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Contact Hitomi Landazabal, bridal makeup and hair artist in Sapporo, Japan. Reach out via Instagram to inquire about availability and pricing for your wedding day.',
  alternates: { canonical: 'https://makeupbyhitomi.com/contact' },
})

export default function ContactPage() {
  return (
    <>
      <PageHero title="Get in Touch" subtitle="Contact" />

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

          {/* Instagram — Primary */}
          <Reveal>
            <div>
              <SectionTitle subtitle="Primary Contact" title="Instagram" />
              <p className="mt-8 font-sans text-base text-[#7A7570] leading-relaxed font-light">
                The best way to reach me is through Instagram. Send me a direct message
                to discuss your wedding date, vision, and any questions you have.
                I typically respond within 24 hours.
              </p>
              <a
                href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 flex items-center gap-4 group"
                aria-label="Message Hitomi on Instagram @hitomi.l.s_sapporo"
              >
                <div className="w-16 h-16 border border-[#EDD9D1] flex items-center justify-center group-hover:bg-[#EDD9D1] transition-colors">
                  <InstagramIcon size={24} className="text-[#A8796A]" />
                </div>
                <div>
                  <p className="font-serif text-2xl text-[#2C2C2C] group-hover:text-[#A8796A] transition-colors">
                    @hitomi.l.s_sapporo
                  </p>
                  <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mt-1">Send a DM</p>
                </div>
              </a>
              <a
                href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 font-sans text-xs uppercase tracking-widest text-white bg-[#A8796A] px-8 py-4 hover:bg-[#C9A99A] transition-colors"
                aria-label="Open Hitomi's Instagram profile"
              >
                <InstagramIcon size={16} />
                Message on Instagram
              </a>
              <p className="mt-6 font-sans text-xs text-[#7A7570] leading-relaxed">
                You can write to me in <strong className="text-[#2C2C2C]">English</strong> or{' '}
                <strong className="text-[#2C2C2C]">Japanese</strong> — I&apos;m comfortable in both.
              </p>
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.16}>
            <div>
              <SectionTitle subtitle="Details" title="Information" />
              <div className="mt-8 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#EDD9D1] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-[#B8A080]" />
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-1">Location</p>
                    <p className="font-sans text-sm text-[#2C2C2C]">Sapporo, Hokkaido, Japan</p>
                    <p className="font-sans text-xs text-[#7A7570] mt-1">Available for travel across Hokkaido & Japan</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#EDD9D1] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={16} className="text-[#B8A080]" />
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-1">Working Hours</p>
                    <p className="font-sans text-sm text-[#2C2C2C]">Mon – Sat, 8:00 AM – 7:00 PM</p>
                    <p className="font-sans text-xs text-[#7A7570] mt-1">Early morning appointments available (surcharge applies)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#EDD9D1] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={16} className="text-[#B8A080]" />
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-1">Email</p>
                    <p className="font-sans text-sm text-[#2C2C2C]">Available upon request via Instagram</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 border border-[#EDD9D1] p-6">
                <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-3">A Note on Bookings</p>
                <p className="font-sans text-sm text-[#7A7570] leading-relaxed">
                  For bridal and wedding day bookings, please reach out{' '}
                  <strong className="text-[#2C2C2C]">at least 3 months in advance</strong> to
                  check availability and secure your date. Popular dates fill quickly,
                  especially during spring and autumn wedding seasons.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* Final Instagram Strip */}
      <section className="py-20 px-6 bg-[#2C2C2C]">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <InstagramIcon size={32} className="text-[#B8A080] mx-auto mb-5" />
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white">
              Follow Along on Instagram
            </h2>
            <p className="mt-4 font-sans text-sm text-white/60 font-light">
              Latest work, behind-the-scenes, and inspiration for your special day.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <a
              href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 font-sans text-xs uppercase tracking-widest text-white border border-white px-8 py-4 hover:bg-white hover:text-[#2C2C2C] transition-all duration-200"
              aria-label="Follow @hitomi.l.s_sapporo on Instagram"
            >
              <InstagramIcon size={16} />
              @hitomi.l.s_sapporo on Instagram
            </a>
          </Reveal>
        </div>
      </section>
    </>
  )
}
