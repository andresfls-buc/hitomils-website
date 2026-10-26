import Link from 'next/link'
import { landingLocaleKeys, landingLocales, landingNav, landingPath, type LandingLocale } from '@/lib/landing'

export default function LanguageSwitcher({ locale = 'en', compact = false }: { locale?: LandingLocale; compact?: boolean }) {
  return (
    <nav aria-label={landingNav[locale].languages} className="flex flex-wrap items-center gap-x-5 gap-y-3">
      {landingLocaleKeys.map((key) => (
        <Link
          key={key}
          href={landingPath(key)}
          hrefLang={landingLocales[key].lang}
          lang={landingLocales[key].lang}
          aria-current={key === locale ? 'page' : undefined}
          className={`py-2 text-xs transition-colors hover:text-[#A8796A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8796A] ${key === locale ? 'text-[#916452] underline underline-offset-8 decoration-[#C9A99A]' : 'text-[#625D58]'}`}
        >
          {compact ? (key === 'en' ? 'English' : key === 'zh-hk' ? '香港' : '台灣') : landingLocales[key].label}
        </Link>
      ))}
    </nav>
  )
}
