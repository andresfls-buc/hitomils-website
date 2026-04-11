import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { getAllPosts } from '@/lib/blog'
import PageHero from '@/components/ui/PageHero'
import BlogCard from '@/components/blog/BlogCard'
import Reveal from '@/components/ui/Reveal'

export const metadata: Metadata = buildMetadata({
  title: 'Wedding & Bridal Beauty Blog',
  description:
    'Expert advice on wedding makeup, bridal hairstyling, and planning your beauty for a destination wedding in Japan. Written by Hitomi, a professional bridal artist in Sapporo, Hokkaido.',
  alternates: { canonical: 'https://hitomils.com/blog' },
  openGraph: {
    type: 'website',
    title: 'Wedding & Bridal Beauty Blog | Hitomi — Sapporo, Japan',
    description:
      'Expert advice on wedding makeup, bridal hairstyling, and planning your beauty for a destination wedding in Japan.',
  },
})

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const featured = posts.find((p) => p.featured) || posts[0]
  const rest = posts.filter((p) => p.slug !== featured.slug)

  return (
    <>
      <PageHero title="Beauty & Wedding Journal" subtitle="The Blog" />

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">

          <Reveal>
            <p className="font-sans text-sm text-[#7A7570] font-light max-w-2xl mb-16 leading-relaxed">
              Practical guides, insider tips, and honest advice on wedding beauty in Japan —
              written for international brides planning their special day in Hokkaido and beyond.
            </p>
          </Reveal>

          {/* Featured post */}
          {featured && (
            <Reveal delay={0.1}>
              <div className="mb-16">
                <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-5">
                  Featured Article
                </p>
                <BlogCard post={featured} featured />
              </div>
            </Reveal>
          )}

          {/* Rest of posts */}
          {rest.length > 0 && (
            <>
              <Reveal>
                <div className="h-px bg-[#EDD9D1] mb-16" />
                <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-8">
                  All Articles
                </p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((post, i) => (
                  <Reveal key={post.slug} delay={i * 0.1}>
                    <BlogCard post={post} />
                  </Reveal>
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </>
  )
}
