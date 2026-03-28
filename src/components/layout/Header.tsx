'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const headerBg = isHome
    ? scrolled
      ? 'bg-[#FAF7F4]/95 backdrop-blur-sm shadow-sm'
      : 'bg-transparent'
    : 'bg-[#FAF7F4]/95 backdrop-blur-sm shadow-sm'

  const textColor = isHome && !scrolled ? 'text-white' : 'text-[#2C2C2C]'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          headerBg
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          {/* Wordmark */}
          <Link href="/" className={cn('font-serif text-2xl md:text-3xl tracking-wide transition-colors', textColor)}>
            Hitomi
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
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
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className={cn('md:hidden p-1 transition-colors', textColor)}
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
        className={cn(
          'fixed top-0 right-0 h-full w-72 z-50 bg-[#FAF7F4] flex flex-col transition-transform duration-300 ease-in-out',
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 h-16">
          <span className="font-serif text-2xl text-[#2C2C2C]">Hitomi</span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-[#2C2C2C] p-1"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-6">
          {navLinks.map(({ href, label }) => (
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
        </nav>
        <div className="mt-auto px-6 pb-8">
          <p className="font-sans text-xs uppercase tracking-widest text-[#7A7570]">
            Sapporo, Japan
          </p>
        </div>
      </div>
    </>
  )
}
