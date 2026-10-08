'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import LanguageSwitcher from '@/components/landing/LanguageSwitcher'
import BrandLogo from '@/components/ui/BrandLogo'
import { landingEntryPath, landingNav, landingPath, type LandingLocale } from '@/lib/landing'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header({ locale = 'en' }: { locale?: LandingLocale }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isLanding = pathname === landingPath(locale)
  const localizedNav = landingNav[locale]
  const links = isLanding ? [
    { href: '#services', label: localizedNav.services },
    { href: '#work', label: localizedNav.work },
    { href: '#locations', label: localizedNav.locations },
    { href: '#faq', label: localizedNav.faq },
    { href: '#contact', label: localizedNav.contact },
  ] : navLinks

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    const trigger = toggleRef.current
    const background = Array.from(document.querySelectorAll<HTMLElement>('header, main, footer'))
    const previousInert = background.map((element) => element.inert)
    document.body.style.overflow = 'hidden'
    background.forEach((element) => { element.inert = true })
    const focusable = () => Array.from(drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button, summary') ?? [])
    focusable()[0]?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
      if (event.key !== 'Tab') return
      const elements = focusable()
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      background.forEach((element, index) => { element.inert = previousInert[index] })
      window.removeEventListener('keydown', handleKeyDown)
      trigger?.focus()
    }
  }, [menuOpen])

  const headerBg = isHome
    ? scrolled
      ? 'bg-[#FAF7F4]/95 backdrop-blur-sm shadow-sm'
      : 'bg-transparent'
    : 'bg-[#FAF7F4]/95 backdrop-blur-sm shadow-sm'

  // White over the hero, but the hero photographs are high-key — plain white
  // strokes vanish against them, which is why the burger icon looked absent.
  // The shadow costs nothing on darker frames and rescues it on pale ones.
  // White over the hero, per preference. The hero photographs are high-key,
  // so a single soft shadow was not enough — plain white strokes disappeared
  // against pale skin and the burger icon read as missing entirely. Two
  // stacked shadows give a tight edge plus a halo, which holds on any frame.
  const textColor = isHome && !scrolled
    ? 'text-white [filter:drop-shadow(0_1px_2px_rgba(44,44,44,0.95))_drop-shadow(0_0_8px_rgba(44,44,44,0.7))]'
    : 'text-[#2C2C2C]'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          headerBg
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" aria-label={locale === 'en' ? 'Hitomi Landazabal — Home' : 'Hitomi Landazabal — 首頁'} className={cn('inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8796A]', isHome && !scrolled && 'max-[1000px]:[filter:drop-shadow(0_1px_2px_rgba(44,44,44,0.8))]')}>
            <BrandLogo light={isHome && !scrolled} className={isHome && !scrolled ? 'min-[1001px]:invert-0' : undefined} />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label={isLanding ? localizedNav.navigation : 'Main navigation'} className="hidden lg:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'font-sans text-xs uppercase tracking-widest transition-colors hover:text-[#C9A99A]',
                  textColor,
                  pathname === href && 'text-[#C9A99A]'
                )}
              >
                {label}
              </Link>
            ))}
            {isLanding ? <details className={cn('relative text-xs', textColor)}>
              <summary className="cursor-pointer py-3">{locale === 'en' ? 'Language / 語言' : '語言'}</summary>
              <div className="absolute right-0 top-full w-64 border border-[#DDD1C7] bg-[#FAF7F4] p-5 shadow-sm"><LanguageSwitcher locale={locale} /></div>
            </details> : <Link href={landingEntryPath} lang="zh-Hant" className={cn('py-3 text-xs transition-colors hover:text-[#C9A99A]', textColor)}>繁體中文</Link>}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            ref={toggleRef}
            onClick={() => setMenuOpen(true)}
            aria-label={isLanding ? localizedNav.menu : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={cn('lg:hidden p-1 transition-colors', textColor)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        id="mobile-navigation"
        ref={drawerRef}
        role={menuOpen ? 'dialog' : undefined}
        aria-modal={menuOpen ? true : undefined}
        aria-label={isLanding ? localizedNav.navigation : 'Main navigation'}
        inert={!menuOpen}
        className={cn(
          'fixed top-0 right-0 h-full w-72 z-50 overflow-y-auto bg-[#FAF7F4] flex flex-col transition-transform duration-300 ease-in-out',
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 h-16">
          <BrandLogo />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label={isLanding ? localizedNav.close : 'Close menu'}
            className="text-[#2C2C2C] p-1"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'font-serif text-3xl text-[#2C2C2C] hover:text-[#C9A99A] transition-colors',
                pathname === href && 'text-[#C9A99A]'
              )}
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-[#DDD1C7] pt-5" onClick={() => setMenuOpen(false)}><LanguageSwitcher locale={locale} /></div>
        </nav>
        <div className="mt-auto px-6 pb-8">
          <p className="font-sans text-xs uppercase tracking-widest text-[#7A7570]">
            {locale === 'en' ? 'Sapporo, Japan' : '日本 · 北海道 · 札幌'}
          </p>
        </div>
      </div>
    </>
  )
}
