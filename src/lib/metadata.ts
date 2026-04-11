import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://makeupbyhitomi.com'

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Hitomi | Bridal Makeup & Hair Artist in Sapporo, Japan',
      template: '%s | Hitomi — Bridal Makeup & Hair',
    },
    description:
      'Professional bridal makeup and wedding hairstyling in Sapporo, Japan. Serving international and Asian clients with elegant, timeless looks. Contact Hitomi for your special day.',
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
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Hitomi — Bridal Makeup & Hair Artist in Sapporo, Japan',
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
