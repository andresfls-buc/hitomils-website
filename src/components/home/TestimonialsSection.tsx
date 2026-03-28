import SectionTitle from '@/components/ui/SectionTitle'
import { testimonials } from '@/data/testimonials'

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#2C2C2C]">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          subtitle="Client Stories"
          title="What Brides Say"
          centered
          light
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col">
              <p className="font-serif text-4xl text-[#B8A080] leading-none mb-4">&ldquo;</p>
              <blockquote className="font-sans text-sm text-white/75 leading-relaxed font-light flex-1">
                {t.quote}
              </blockquote>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="font-serif text-lg text-white">{t.name}</p>
                <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mt-1">
                  {t.occasion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
