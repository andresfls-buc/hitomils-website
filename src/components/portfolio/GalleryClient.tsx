'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { GalleryImage } from '@/types'
import { cn } from '@/lib/utils'

type Category = 'all' | 'bridal-makeup' | 'hairstyling' | 'special-occasion'

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'bridal-makeup', label: 'Bridal Makeup' },
  { value: 'hairstyling', label: 'Hairstyling' },
  { value: 'special-occasion', label: 'Special Occasions' },
]

interface Props {
  images: GalleryImage[]
}

export default function GalleryClient({ images }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const filtered =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory)

  const slides = filtered.map((img) => ({
    src: img.src,
    alt: img.alt,
    width: img.width,
    height: img.height,
  }))

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              'font-sans text-xs uppercase tracking-widest px-5 py-2.5 border transition-all duration-200',
              activeCategory === cat.value
                ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]'
                : 'bg-transparent text-[#2C2C2C] border-[#2C2C2C]/30 hover:border-[#2C2C2C]'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
        {filtered.map((image, i) => (
          <div
            key={image.src}
            className="break-inside-avoid relative overflow-hidden cursor-pointer group"
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        styles={{
          container: { backgroundColor: 'rgba(0,0,0,0.95)' },
        }}
      />
    </>
  )
}
