interface PageHeroProps {
  title: string
  subtitle?: string
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative bg-[#2C2C2C] py-32 px-6 flex items-end">
      <div className="max-w-6xl mx-auto w-full">
        {subtitle && (
          <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-3">
            {subtitle}
          </p>
        )}
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
          {title}
        </h1>
        <div className="mt-6 h-px w-20 bg-[#B8A080]" />
      </div>
    </section>
  )
}
