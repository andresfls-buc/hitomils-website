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

export default function HomePage() {
  return (
    <>
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
