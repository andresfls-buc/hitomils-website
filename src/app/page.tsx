import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import HeroSection from '@/components/home/HeroSection'
import IntroSection from '@/components/home/IntroSection'
import ServicesPreview from '@/components/home/ServicesPreview'
import FeaturedGallery from '@/components/home/FeaturedGallery'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import InstagramCTA from '@/components/home/InstagramCTA'

export const metadata: Metadata = buildMetadata({
  alternates: { canonical: 'https://hitomils.com' },
})

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ServicesPreview />
      <FeaturedGallery />
      <TestimonialsSection />
      <InstagramCTA />
    </>
  )
}
