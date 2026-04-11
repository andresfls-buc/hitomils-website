import SectionTitle from '@/components/ui/SectionTitle'
import Reveal from '@/components/ui/Reveal'
import { testimonials } from '@/data/testimonials'

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill={i < count ? '#F4B942' : 'none'}
          stroke={i < count ? '#F4B942' : '#ffffff30'}
          strokeWidth="1"
          aria-hidden
        >
          <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#2C2C2C]">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <SectionTitle
            subtitle="Client Stories"
            title="What Brides Say"
            centered
            light
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.14}>
              <div className="flex flex-col">
                <p className="font-serif text-lg text-white">{t.name}</p>
                <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mt-1">{t.occasion}</p>
                <div className="mt-4 mb-4 h-px w-8 bg-white/10" />
                <Stars count={t.stars} />
                <p className="font-serif text-4xl text-[#B8A080] leading-none mt-4 mb-2">&ldquo;</p>
                <blockquote className="font-sans text-sm text-white/75 leading-relaxed font-light flex-1">
                  {t.quote}
                </blockquote>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Google overall rating strip */}
        <Reveal delay={0.2}>
          <div className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-sans text-xs text-white/50 uppercase tracking-widest">Reviews on Google</span>
            </div>
            <Stars count={5} />
            <a
              href="https://share.google/4WgUx0VlOZucwBqwb"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-widest text-[#B8A080] hover:text-white transition-colors"
            >
              See all reviews →
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  )
}
