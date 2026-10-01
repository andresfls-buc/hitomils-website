import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import HeroSection from '@/components/home/HeroSection'
import IntroSection from '@/components/home/IntroSection'
import WaveBendPromise from '@/components/home/WaveBendPromise'
import ServicesPreview from '@/components/home/ServicesPreview'
import FeaturedGallery from '@/components/home/FeaturedGallery'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import InstagramCTA from '@/components/home/InstagramCTA'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  alternates: { canonical: siteUrl },
})

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'BeautyBusiness',
  '@id': `${siteUrl}/#business`,
  name: 'Hitomi — Bridal Makeup & Hair Artist',
  url: siteUrl,
  image: `${siteUrl}/images/about/hitomi-landazabal-bridal-makeup-artist-sapporo.jpg`,
  description:
    'English-speaking bridal makeup artist and wedding hairstylist based in Sapporo, Hokkaido. Serving international and Asian brides, with travel across Japan on request.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sapporo',
    addressRegion: 'Hokkaido',
    addressCountry: 'JP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.0618,
    longitude: 141.3545,
  },
  areaServed: [
    { '@type': 'City', name: 'Sapporo' },
    { '@type': 'AdministrativeArea', name: 'Hokkaido' },
    { '@type': 'Country', name: 'Japan' },
  ],
  founder: {
    '@type': 'Person',
    '@id': `${siteUrl}/#hitomi`,
    name: 'Hitomi Landazabal',
    jobTitle: 'Bridal Makeup & Hair Artist',
    url: `${siteUrl}/about`,
    image: `${siteUrl}/images/about/hitomi-landazabal-bridal-makeup-artist-sapporo.jpg`,
    knowsLanguage: ['en', 'ja'],
    sameAs: ['https://www.instagram.com/hitomi.l.s_sapporo/'],
  },
  sameAs: ['https://www.instagram.com/hitomi.l.s_sapporo/'],
  priceRange: '¥¥¥',
  currenciesAccepted: 'JPY',
  openingHours: 'Mo-Sa 08:00-19:00',
  knowsLanguage: ['en', 'ja'],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HeroSection />
      <WaveBendPromise />
      <IntroSection />
      <ServicesPreview />
      <FeaturedGallery />
      <TestimonialsSection />
      <InstagramCTA />
    </>
  )
}
