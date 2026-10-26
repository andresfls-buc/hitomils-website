import { ArrowUpRight } from 'lucide-react'

export default function GoogleReviewsLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-google-reviews="true"
      className="group flex min-h-16 w-full items-center gap-3.5 rounded-full border border-[#DDD1C7] bg-[#FAF7F4] px-4 py-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_18px_rgba(73,61,52,0.08)] transition-colors hover:border-[#A8796A] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8796A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F4] sm:w-fit"
    >
      <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-white shadow-[inset_0_1px_2px_rgba(73,61,52,0.06)]" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-[#493D34]">{label}</span>
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#F1EAE3] text-[#756255] transition-colors group-hover:bg-[#F7EEE9]" aria-hidden="true">
        <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
      </span>
    </a>
  )
}
