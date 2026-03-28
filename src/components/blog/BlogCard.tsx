import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#EDD9D1] hover:border-[#C9A99A] transition-colors duration-300">
          {/* Image placeholder */}
          <div className="relative bg-[#F5EDE8] aspect-[4/3] md:aspect-auto overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-2">
                  {post.category}
                </p>
                <div className="h-px w-12 bg-[#B8A080] mx-auto" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs uppercase tracking-widest text-[#B8A080]">
                {post.category}
              </span>
              <span className="text-[#D6C4A8]">·</span>
              <span className="font-sans text-xs text-[#7A7570]">{post.readingTime}</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2C2C2C] leading-snug group-hover:text-[#A8796A] transition-colors">
              {post.title}
            </h2>

            <p className="mt-4 font-sans text-sm text-[#7A7570] leading-relaxed line-clamp-3">
              {post.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <time
                dateTime={post.date}
                className="font-sans text-xs text-[#7A7570]"
              >
                {post.dateFormatted}
              </time>
              <span className="font-sans text-xs uppercase tracking-widest text-[#A8796A] group-hover:gap-2 transition-all">
                Read Article →
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="border border-[#EDD9D1] hover:border-[#C9A99A] transition-colors duration-300 h-full flex flex-col">
        {/* Image placeholder */}
        <div className="relative bg-[#F5EDE8] aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080]">
              {post.category}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-sans text-xs uppercase tracking-widest text-[#B8A080]">
              {post.category}
            </span>
            <span className="text-[#D6C4A8]">·</span>
            <span className="font-sans text-xs text-[#7A7570]">{post.readingTime}</span>
          </div>

          <h2 className="font-serif text-2xl font-light text-[#2C2C2C] leading-snug group-hover:text-[#A8796A] transition-colors flex-1">
            {post.title}
          </h2>

          <p className="mt-3 font-sans text-sm text-[#7A7570] leading-relaxed line-clamp-2">
            {post.description}
          </p>

          <div className="mt-5 pt-4 border-t border-[#EDD9D1] flex items-center justify-between">
            <time dateTime={post.date} className="font-sans text-xs text-[#7A7570]">
              {post.dateFormatted}
            </time>
            <span className="font-sans text-xs uppercase tracking-widest text-[#A8796A]">
              Read →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
