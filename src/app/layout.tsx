import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { buildMetadata } from '@/lib/metadata'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = buildMetadata()

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://hitomils.com/#business',
  name: 'Hitomi — Bridal Makeup & Hair Artist',
  description:
    'Professional bridal makeup and wedding hairstyling in Sapporo, Japan. Serving international and Asian clients with elegant, timeless looks.',
  url: 'https://hitomils.com',
  image: 'https://hitomils.com/images/og-image.jpg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sapporo',
    addressRegion: 'Hokkaido',
    addressCountry: 'JP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.0621,
    longitude: 141.3544,
  },
  priceRange: '¥¥¥',
  currenciesAccepted: 'JPY',
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 43.0621,
      longitude: 141.3544,
    },
    geoRadius: '100000',
  },
  sameAs: ['https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet'],
  knowsLanguage: ['English', 'Japanese'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F4] text-[#2C2C2C]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
