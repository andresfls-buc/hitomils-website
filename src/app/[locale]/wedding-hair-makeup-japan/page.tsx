import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BridalLanding from '@/components/landing/BridalLanding'
import { landingCopy } from '@/data/landing'
import { defaultLandingLocale, isLandingLocale, landingLocales, landingLocaleKeys, landingPath } from '@/lib/landing'
import { buildMetadata } from '@/lib/metadata'
import { siteUrl } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLandingLocale(locale)) notFound()
  const copy = landingCopy[locale]
  const url = `${siteUrl}${landingPath(locale)}`
  return buildMetadata({
    title: { absolute: copy.title }, description: copy.description,
    keywords: undefined,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(landingLocaleKeys.map((key) => [landingLocales[key].lang, `${siteUrl}${landingPath(key)}`])),
        'x-default': `${siteUrl}${landingPath(defaultLandingLocale)}`,
      },
    },
    openGraph: {
      type: 'website', title: copy.title, description: copy.description, url,
      siteName: 'Hitomi — Bridal Makeup & Hair Artist', locale: landingLocales[locale].ogLocale,
      alternateLocale: landingLocaleKeys.filter((key) => key !== locale).map((key) => landingLocales[key].ogLocale),
      images: [{ url: `${siteUrl}/images/portfolio/bridal-makeup-natural-updo-elegant-portrait-sapporo.jpg`, width: 800, height: 1067, alt: copy.galleryAlt[0] }],
    },
    twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, images: [`${siteUrl}/images/portfolio/bridal-makeup-natural-updo-elegant-portrait-sapporo.jpg`] },
  })
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params
  if (!isLandingLocale(locale)) notFound()
  return <BridalLanding locale={locale} />
}
