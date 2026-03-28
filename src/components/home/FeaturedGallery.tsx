import Image from 'next/image'
import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import { featuredImages } from '@/data/portfolio'
import Button from '@/components/ui/Button'

export default function FeaturedGallery() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <SectionTitle
            subtitle="Portfolio"
            title="Selected Work"
          />
          <Button href="/portfolio" variant="ghost" size="sm">
            Full Portfolio
          </Button>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {featuredImages.map((image, i) => (
            <Link
              key={image.src}
              href="/portfolio"
              className={`relative overflow-hidden block group ${
                i === 0 || i === 3 ? 'row-span-2' : ''
              }`}
              style={{
                aspectRatio: i === 0 || i === 3 ? '3/4' : '4/3',
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
