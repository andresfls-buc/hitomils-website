import Link from 'next/link'
import { MapPin } from 'lucide-react'
import InstagramIcon from '@/components/ui/InstagramIcon'
import LanguageSwitcher from '@/components/landing/LanguageSwitcher'
import BrandLogo from '@/components/ui/BrandLogo'
import { landingCopy } from '@/data/landing'
import { instagramUrl, landingNav, type LandingLocale } from '@/lib/landing'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer({ locale = 'en', landing = false }: { locale?: LandingLocale; landing?: boolean }) {
  if (landing) {
    const copy = landingCopy[locale]
    const nav = landingNav[locale]
    return (
      <footer className="bg-[#2C2C2C] px-6 pt-16 pb-28 text-[#FAF7F4] md:pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div><Link href="/" aria-label={locale === 'en' ? 'Hitomi Landazabal — Home' : 'Hitomi Landazabal — 首頁'} className="inline-block transition-opacity hover:opacity-80"><BrandLogo variant="footer" light /></Link><p className="mt-5 text-sm leading-relaxed text-[#FAF7F4]/75">{copy.footerDescription}</p></div>
          <nav aria-label={nav.navigation} className="flex flex-col items-start gap-4 text-sm text-[#FAF7F4]/80"><a href="#services">{nav.services}</a><a href="#work">{nav.work}</a><a href="#locations">{nav.locations}</a><a href="#faq">{nav.faq}</a></nav>
          <div><a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm"><InstagramIcon size={20} />@hitomi.l.s_sapporo</a><div className="mt-6 rounded-sm bg-[#FAF7F4] p-4"><LanguageSwitcher locale={locale} /></div></div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl border-t border-white/20 pt-6 text-xs text-[#FAF7F4]/70">© {new Date().getFullYear()} Hitomi Landazabal. {copy.rights}</p>
      </footer>
    )
  }
  return (
    <footer className="bg-[#2C2C2C] text-[#FAF7F4] py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <Link href="/" aria-label="Hitomi Landazabal — Home" className="mb-3 inline-block transition-opacity hover:opacity-80">
            <BrandLogo variant="footer" light />
          </Link>
          <p className="font-sans text-sm text-[#B8A080] leading-relaxed">
            Bridal Makeup & Hair Artist
          </p>
          <div className="flex items-center gap-2 mt-4 text-[#7A7570]">
            <MapPin size={14} />
            <span className="font-sans text-xs">Sapporo, Hokkaido, Japan</span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-5">Pages</p>
          <nav className="flex flex-col gap-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-sans text-sm text-[#FAF7F4]/70 hover:text-[#C9A99A] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact / Social */}
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-5">Connect</p>
          <a
            href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[#FAF7F4]/70 hover:text-[#C9A99A] transition-colors group"
            aria-label="Follow Hitomi on Instagram"
          >
            <InstagramIcon size={20} />
            <span className="font-sans text-sm">@hitomi.l.s_sapporo</span>
          </a>
          <p className="mt-6 font-sans text-xs text-[#7A7570] leading-relaxed">
            Available for weddings & events<br />
            in Sapporo &amp; Hokkaido.<br />
            Travel across Japan on request.<br />
            Communication in English & Japanese.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="font-sans text-xs text-[#7A7570]">
          © {new Date().getFullYear()} Hitomi Landazabal. All rights reserved.
        </p>
        <p className="font-sans text-xs text-[#7A7570]">
          Sapporo, Hokkaido, Japan
        </p>
      </div>
    </footer>
  )
}
