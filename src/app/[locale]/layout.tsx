import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteLayout from '@/components/layout/SiteLayout'
import { buildMetadata } from '@/lib/metadata'
import { isLandingLocale, landingLocaleKeys } from '@/lib/landing'

export const metadata: Metadata = buildMetadata()
export const dynamicParams = false
export function generateStaticParams() {
  return landingLocaleKeys.map((locale) => ({ locale }))
}

export default async function LocalizedLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLandingLocale(locale)) notFound()
  return <SiteLayout locale={locale} landing>{children}</SiteLayout>
}
