import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { buildMetadata } from '@/lib/metadata'
import { siteUrl } from '@/lib/site'

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

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#hitomi`,
  name: 'Hitomi Landazabal',
  url: `${siteUrl}/about`,
  image: `${siteUrl}/images/about/hitomi-landazabal-bridal-makeup-artist-sapporo.jpg`,
  jobTitle: 'Bridal Makeup & Hair Artist',
  description:
    'English-speaking bridal makeup artist and wedding hairstylist based in Sapporo, Hokkaido, Japan. Over 12 years of bridal experience, trained at Belle e Poque. Travel across Japan on request.',
  knowsLanguage: ['English', 'Japanese'],
  sameAs: ['https://www.instagram.com/hitomi.l.s_sapporo/'],
  worksFor: {
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sapporo',
    addressRegion: 'Hokkaido',
    addressCountry: 'JP',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteUrl}/#business`,
  name: 'Hitomi — Bridal Makeup & Hair Artist',
  description:
    'Bridal makeup and wedding hairstyling in Japan, based in Sapporo, Hokkaido. English and Japanese communication, with travel across Japan on request.',
  url: siteUrl,
  image: `${siteUrl}/images/about/hitomi-landazabal-bridal-makeup-artist-sapporo.jpg`,
  founder: { '@id': `${siteUrl}/#hitomi` },
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
  areaServed: [
    { '@type': 'City', name: 'Sapporo' },
    { '@type': 'AdministrativeArea', name: 'Hokkaido' },
    { '@type': 'Country', name: 'Japan' },
  ],
  sameAs: ['https://www.instagram.com/hitomi.l.s_sapporo/'],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F4] text-[#2C2C2C]">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5B5KJV854H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5B5KJV854H');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wdcr9p47cd");
          `}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
