import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site'

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Bridal Makeup & Hair in Sapporo, Hokkaido, Japan | Hitomi',
      template: '%s | Hitomi — Bridal Makeup & Hair',
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
    ...overrides,
  }
}
