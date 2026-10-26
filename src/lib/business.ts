import { instagramUrl } from '@/lib/landing'
import { siteUrl } from '@/lib/site'

export const googleBusinessProfileUrl = 'https://share.google/4WgUx0VlOZucwBqwb'

export const personSchema = {
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
  sameAs: [instagramUrl],
  worksFor: { '@id': `${siteUrl}/#business` },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sapporo',
    addressRegion: 'Hokkaido',
    addressCountry: 'JP',
  },
}

export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  '@id': `${siteUrl}/#business`,
  name: 'Hitomi — Bridal Makeup & Hair Artist',
  alternateName: 'Hitomi L.S — Bridal Makeup & Hair, Sapporo',
  description:
    'Bridal makeup and wedding hairstyling in Japan, based in Sapporo, Hokkaido. English and Japanese communication, with travel across Japan on request.',
  url: siteUrl,
  image: `${siteUrl}/images/about/hitomi-landazabal-bridal-makeup-artist-sapporo.jpg`,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/brand/hl-master.png`,
    width: 1040,
    height: 729,
  },
  founder: { '@id': `${siteUrl}/#hitomi` },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sapporo',
    addressRegion: 'Hokkaido',
    addressCountry: 'JP',
  },
  openingHours: 'Mo-Sa 08:00-19:00',
  currenciesAccepted: 'JPY',
  areaServed: [
    { '@type': 'City', name: 'Sapporo' },
    { '@type': 'AdministrativeArea', name: 'Hokkaido' },
    { '@type': 'Country', name: 'Japan' },
  ],
  sameAs: [instagramUrl, googleBusinessProfileUrl],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer inquiries',
    url: instagramUrl,
    availableLanguage: ['English', 'Japanese'],
  },
}
