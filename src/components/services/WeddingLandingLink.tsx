import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { defaultLandingLocale, landingPath } from '@/lib/landing'

export default function WeddingLandingLink() {
  return (
    <Link
      href={landingPath(defaultLandingLocale)}
      data-wedding-landing-link
      className="group flex flex-col gap-6 border border-[#C9A99A] border-l-4 border-l-[#A8796A] bg-[#EDD9D1] p-6 text-[#2C2C2C] shadow-[0_6px_24px_rgba(139,94,82,0.06)] transition-colors duration-200 hover:border-[#A8796A] hover:bg-[#E8D0C6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5E52] sm:flex-row sm:items-center sm:justify-between sm:p-8"
    >
      <span className="min-w-0">
        <span className="block font-serif text-3xl font-light leading-tight md:text-4xl">Weddings in Japan</span>
        <span lang="zh-Hant" className="mt-3 block font-sans text-base text-[#4F443E]">
          日本婚禮與婚紗妝髮
        </span>
        <span lang="zh-Hant" className="mt-2 block font-sans text-xs tracking-wide text-[#62504A]">
          繁體中文 · 台灣／香港
        </span>
      </span>
      <span lang="zh-Hant" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 border border-[#8B5E52] bg-[#8B5E52] px-6 py-3 font-sans text-sm font-medium text-[#FAF7F4] transition-colors group-hover:border-[#6F463D] group-hover:bg-[#6F463D] sm:min-w-44">
        查看婚禮妝髮
        <ArrowUpRight size={16} aria-hidden="true" />
      </span>
    </Link>
  )
}
