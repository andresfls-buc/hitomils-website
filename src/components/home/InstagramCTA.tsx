import InstagramIcon from '@/components/ui/InstagramIcon'

export default function InstagramCTA() {
  return (
    <section className="py-20 px-6 bg-[#EDD9D1]">
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-[#A8796A] mb-4">
          Follow the Journey
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-[#2C2C2C]">
          See More on Instagram
        </h2>
        <p className="mt-4 font-sans text-sm text-[#7A7570] font-light">
          Behind-the-scenes, latest work, and inspiration for your wedding day.
        </p>
        <a
          href="https://www.instagram.com/hitomi.l.s_sapporo/?utm_source=ig_web_button_share_sheet"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 font-sans text-sm uppercase tracking-widest text-[#2C2C2C] border border-[#2C2C2C] px-8 py-4 hover:bg-[#2C2C2C] hover:text-white transition-all duration-200"
          aria-label="Follow Hitomi on Instagram @hitomi.l.s_sapporo"
        >
          <InstagramIcon size={18} />
          @hitomi.l.s_sapporo
        </a>
      </div>
    </section>
  )
}
