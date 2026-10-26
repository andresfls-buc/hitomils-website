import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site'

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const defaults: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Bridal Makeup & Hair in Sapporo, Hokkaido, Japan | Hitomi',
      template: '%s | Hitomi',
    },
    description:
      'English-speaking bridal makeup artist and wedding hairstylist in Sapporo, Hokkaido, Japan. Salon and hotel appointments, with Japan travel on request.',
    keywords: [
      'bridal makeup Sapporo',
      'wedding hair Sapporo',
      'makeup artist Japan',
      'bridal hairstylist Hokkaido',
      'bridal makeup artist English speaking Japan',
      'wedding makeup foreigners Japan',
      'Sapporo wedding beauty',
      'Hokkaido bridal stylist',
    ],
    authors: [{ name: 'Hitomi Landazabal' }],
    creator: 'Hitomi Landazabal',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Hitomi — Bridal Makeup & Hair Artist',
      images: [
        {
          url: `${siteUrl}/images/home/bridal-makeup-veil-reclining-soft-gaze-sapporo.jpg`,
          width: 2048,
          height: 1365,
          alt: 'Hitomi — Bridal Makeup & Hair Artist in Hokkaido, Japan',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
  }

  return {
    ...defaults,
    ...overrides,
    // Pages often override only the social title or description. Keep the
    // shared cover image unless a page explicitly replaces or removes it.
    openGraph: overrides.openGraph === null
      ? null
      : { ...defaults.openGraph, ...overrides.openGraph },
    twitter: overrides.twitter === null
      ? null
      : { ...defaults.twitter, ...overrides.twitter },
  }
}
