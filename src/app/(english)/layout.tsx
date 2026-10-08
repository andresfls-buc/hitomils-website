import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata()

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>
}
