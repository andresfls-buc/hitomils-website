'use client'

import { useEffect } from 'react'
import InstagramIcon from '@/components/ui/InstagramIcon'
import { instagramUrl, type LandingLocale } from '@/lib/landing'
import { cn } from '@/lib/utils'

type AnalyticsWindow = Window & {
  gtag?: (command: 'event', name: string, parameters: Record<string, string>) => void
}

function track(name: string, locale: LandingLocale, placement?: string) {
  // Local previews do not send marketing events. Only fixed, non-personal fields.
  if (process.env.NODE_ENV !== 'production') return
  ;(window as AnalyticsWindow).gtag?.('event', name, {
    landing_variant: locale,
    ...(placement ? { contact_channel: 'instagram', placement } : {}),
  })
}

export function LandingView({ locale }: { locale: LandingLocale }) {
  useEffect(() => { track('landing_view', locale) }, [locale])
  return null
}

export default function InstagramContact({
  locale, label, placement, className,
}: { locale: LandingLocale; label: string; placement: string; className?: string }) {
  return (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-contact="instagram"
      data-placement={placement}
      onClick={() => track('contact_click', locale, placement)}
      className={cn('inline-flex min-h-12 items-center justify-center gap-3 border border-[#A8796A] bg-[#A8796A] px-7 py-4 font-sans text-sm text-white transition-colors hover:border-[#916452] hover:bg-[#916452] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8796A]', className)}
    >
      <InstagramIcon size={17} />
      {label}
    </a>
  )
}
