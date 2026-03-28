import Link from 'next/link'
import { MapPin } from 'lucide-react'
import InstagramIcon from '@/components/ui/InstagramIcon'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-[#2C2C2C] text-[#FAF7F4] py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <p className="font-serif text-3xl mb-3">Hitomi</p>
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
            across Hokkaido, Japan.<br />
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
