import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import PageHero from '@/components/ui/PageHero'
import GalleryClient from '@/components/portfolio/GalleryClient'
import { portfolioImages } from '@/data/portfolio'

export const metadata: Metadata = buildMetadata({
  title: 'Portfolio',
  description:
    'Browse the bridal makeup and wedding hairstyling portfolio of Hitomi Landazabal in Sapporo, Japan. Elegant looks for international and Asian brides in Hokkaido.',
  alternates: { canonical: 'https://makeupbyhitomi.com/portfolio' },
})

const gallerySchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: "Hitomi's Bridal Makeup & Hair Portfolio — Sapporo, Japan",
  description:
    'A collection of bridal makeup and wedding hairstyling work by Hitomi Landazabal in Sapporo, Hokkaido.',
  url: 'https://makeupbyhitomi.com/portfolio',
  image: portfolioImages.map((img) => ({
    '@type': 'ImageObject',
    contentUrl: `https://makeupbyhitomi.com${img.src}`,
    description: img.alt,
    width: img.width,
    height: img.height,
  })),
}

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />

      <PageHero
        title="Portfolio"
        subtitle="Selected Work"
      />

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-sans text-sm text-[#7A7570] font-light max-w-xl mb-12">
            A selection of bridal makeup, wedding hairstyling, and special occasion work
            from weddings across Hokkaido and beyond.
          </p>

          <GalleryClient images={portfolioImages} />
        </div>
      </section>
    </>
  )
}
