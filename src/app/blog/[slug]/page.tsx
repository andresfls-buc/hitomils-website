import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { buildMetadata } from '@/lib/metadata'
import { getAllSlugs, getPostBySlug, getAllPosts } from '@/lib/blog'
import { Clock, ArrowLeft, Tag } from 'lucide-react'
import InstagramIcon from '@/components/ui/InstagramIcon'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const slugs = getAllSlugs()
  if (!slugs.includes(slug)) return {}

  const post = getPostBySlug(slug)
  return buildMetadata({
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://makeupbyhitomi.com/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ['Hitomi Landazabal'],
      tags: post.tags,
      images: [
        {
          url: `https://makeupbyhitomi.com/images/blog/${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const slugs = getAllSlugs()
  if (!slugs.includes(slug)) notFound()

  const post = getPostBySlug(slug)
  const allPosts = getAllPosts()
  const related = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@id': 'https://makeupbyhitomi.com/#hitomi',
      '@type': 'Person',
      name: 'Hitomi Landazabal',
      url: 'https://makeupbyhitomi.com/about',
      image: 'https://makeupbyhitomi.com/images/about/hitomi-landazabal-bridal-makeup-artist-sapporo.jpg',
      jobTitle: 'Bridal Makeup & Hair Artist',
    },
    publisher: {
      '@id': 'https://makeupbyhitomi.com/#business',
      '@type': 'LocalBusiness',
      name: 'Hitomi — Bridal Makeup & Hair Artist',
      url: 'https://makeupbyhitomi.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://makeupbyhitomi.com/blog/${slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    inLanguage: 'en',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Article Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Background image */}
        <Image
          src={`/images/blog/${slug}.jpg`}
          alt={post.title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-[#2C2C2C]/75" />
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8">
            <Link
              href="/blog"
              className="font-sans text-xs uppercase tracking-widest text-[#B8A080] hover:text-[#D6C4A8] transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={12} />
              Journal
            </Link>
            <span className="text-[#B8A080]/40">/</span>
            <span className="font-sans text-xs uppercase tracking-widest text-white/40 truncate max-w-48">
              {post.category}
            </span>
          </nav>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="font-sans text-xs uppercase tracking-widest text-[#B8A080] border border-[#B8A080]/30 px-3 py-1">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-white/50">
              <Clock size={12} />
              <span className="font-sans text-xs">{post.readingTime}</span>
            </div>
            <time dateTime={post.date} className="font-sans text-xs text-white/50">
              {post.dateFormatted}
            </time>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="mt-6 font-sans text-base text-white/65 font-light leading-relaxed max-w-2xl">
            {post.description}
          </p>

          {/* Author */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
            <div>
              <p className="font-serif text-base text-white">Hitomi Landazabal</p>
              <p className="font-sans text-xs text-[#B8A080] mt-0.5">
                Bridal Makeup & Hair Artist · Sapporo, Japan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">

          {/* Main content */}
          <div className="prose">
            <MDXRemote source={post.content} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="border border-[#EDD9D1] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={12} className="text-[#B8A080]" />
                  <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080]">
                    Topics
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-sans text-xs text-[#7A7570] border border-[#EDD9D1] px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-[#EDD9D1] p-6">
              <p className="font-serif text-xl text-[#2C2C2C] leading-snug mb-3">
                Planning your wedding in Japan?
              </p>
              <p className="font-sans text-xs text-[#7A7570] leading-relaxed mb-5">
                I specialise in bridal makeup and hair for international couples in
                Sapporo, Hokkaido. Let&apos;s talk about your vision.
              </p>
              <a
                href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[#2C2C2C] border border-[#2C2C2C] px-4 py-3 hover:bg-[#2C2C2C] hover:text-white transition-all duration-200"
              >
                <InstagramIcon size={14} />
                Message on Instagram
              </a>
            </div>

            {/* About author */}
            <div className="border border-[#EDD9D1] p-5">
              <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-3">
                About the Author
              </p>
              <p className="font-serif text-lg text-[#2C2C2C] mb-2">Hitomi Landazabal</p>
              <p className="font-sans text-xs text-[#7A7570] leading-relaxed">
                Professional bridal makeup artist and wedding hairstylist based in
                Sapporo, Hokkaido, Japan. Serving international and Asian brides
                with elegant, timeless looks.
              </p>
              <Link
                href="/about"
                className="mt-3 inline-block font-sans text-xs uppercase tracking-widest text-[#A8796A] hover:text-[#2C2C2C] transition-colors"
              >
                Read More →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 px-6 bg-white border-t border-[#EDD9D1]">
          <div className="max-w-4xl mx-auto">
            <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-8">
              Continue Reading
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group border border-[#EDD9D1] hover:border-[#C9A99A] transition-colors p-6"
                >
                  <span className="font-sans text-xs uppercase tracking-widest text-[#B8A080]">
                    {p.category}
                  </span>
                  <h3 className="font-serif text-xl font-light text-[#2C2C2C] mt-2 group-hover:text-[#A8796A] transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 font-sans text-xs text-[#7A7570] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                  <p className="mt-3 font-sans text-xs uppercase tracking-widest text-[#A8796A]">
                    Read →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 px-6 bg-[#2C2C2C]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl text-white">Ready to book your bridal artist?</p>
            <p className="font-sans text-sm text-white/60 mt-1">Sapporo, Hokkaido · English speaking</p>
          </div>
          <a
            href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-3 font-sans text-xs uppercase tracking-widest text-white border border-white px-7 py-3.5 hover:bg-white hover:text-[#2C2C2C] transition-all duration-200"
          >
            <InstagramIcon size={14} />
            Get in Touch
          </a>
        </div>
      </section>
    </>
  )
}
